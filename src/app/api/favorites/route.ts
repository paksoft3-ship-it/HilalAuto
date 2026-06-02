import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function hashSessionId(sessionId: string) {
  return crypto.createHash("sha256").update(sessionId).digest("hex");
}

function getSessionHash(value: unknown) {
  const sessionId = String(value || "").trim();
  if (!sessionId || sessionId.length < 12) return null;
  return hashSessionId(sessionId);
}

function isFavoritesTableUnavailable(error: { code?: string } | null) {
  return error?.code === "42501" || error?.code === "42P01" || error?.code === "42703";
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionHash = getSessionHash(searchParams.get("session_id"));
  if (!sessionHash) {
    return NextResponse.json({ favorites: [], count: 0, isSaved: false });
  }

  const listingId = searchParams.get("listing_id");
  if (listingId) {
    const { data, error } = await supabaseAdmin
      .from("hazaral_favorites")
      .select("id")
      .eq("session_id", sessionHash)
      .eq("listing_id", listingId)
      .maybeSingle();

    if (isFavoritesTableUnavailable(error)) {
      return NextResponse.json({ isSaved: false });
    }

    return NextResponse.json({ isSaved: Boolean(data?.id) });
  }

  const { data, error } = await supabaseAdmin
    .from("hazaral_favorites")
    .select(`
      id,
      listing_id,
      created_at,
      listing:hazaral_listings!inner(
        *,
        dealer:hazaral_dealers(id, company_name, city, is_verified, logo_url, slug)
      )
    `)
    .eq("session_id", sessionHash)
    .eq("listing.status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    if (isFavoritesTableUnavailable(error)) {
      return NextResponse.json({ favorites: [], count: 0 });
    }
    console.error("[favorites/list]", error);
    return NextResponse.json({ error: "Favoriler alınamadı." }, { status: 500 });
  }

  const favorites = (data || [])
    .map((row) => row.listing)
    .filter(Boolean);

  return NextResponse.json({ favorites, count: favorites.length });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const sessionHash = getSessionHash(body.session_id);
  const listingId = String(body.listing_id || "").trim();

  if (!sessionHash || !listingId) {
    return NextResponse.json({ error: "Favori bilgisi eksik." }, { status: 400 });
  }

  const { data: listing } = await supabaseAdmin
    .from("hazaral_listings")
    .select("id")
    .eq("id", listingId)
    .eq("status", "active")
    .maybeSingle();

  if (!listing) {
    return NextResponse.json({ error: "İlan bulunamadı." }, { status: 404 });
  }

  const { error } = await supabaseAdmin
    .from("hazaral_favorites")
    .upsert({ listing_id: listingId, session_id: sessionHash }, { onConflict: "listing_id,session_id" });

  if (error) {
    console.error("[favorites/create]", error);
    return NextResponse.json({ error: "Favoriye eklenemedi." }, { status: 500 });
  }

  return NextResponse.json({ isSaved: true });
}

export async function DELETE(req: Request) {
  const body = await req.json().catch(() => ({}));
  const sessionHash = getSessionHash(body.session_id);
  const listingId = String(body.listing_id || "").trim();

  if (!sessionHash || !listingId) {
    return NextResponse.json({ error: "Favori bilgisi eksik." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("hazaral_favorites")
    .delete()
    .eq("session_id", sessionHash)
    .eq("listing_id", listingId);

  if (error) {
    console.error("[favorites/delete]", error);
    return NextResponse.json({ error: "Favoriden kaldırılamadı." }, { status: 500 });
  }

  return NextResponse.json({ isSaved: false });
}

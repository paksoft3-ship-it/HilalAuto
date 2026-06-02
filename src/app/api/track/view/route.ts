import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

const RATE_WINDOW_MS = 60 * 60 * 1000;

function hashIp(ip: string): string {
  return createHash("sha256").update(ip + (process.env.SUPABASE_JWT_SECRET ?? "")).digest("hex");
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { listing_id, dealer_id, session_id, device_type, referrer, utm_source, utm_medium, utm_campaign } = body;

    if (!listing_id || !dealer_id || !session_id) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Rate limit: 1 view insert per session per listing per hour
    const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
    const { count } = await supabaseAdmin
      .from("hazaral_listing_views")
      .select("id", { count: "exact", head: true })
      .eq("listing_id", listing_id)
      .eq("session_id", session_id)
      .gte("created_at", since);

    if ((count ?? 0) > 0) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const { data, error } = await supabaseAdmin
      .from("hazaral_listing_views")
      .insert({
        listing_id,
        dealer_id,
        session_id,
        device_type: device_type || "desktop",
        viewer_ip: hashIp(getIp(req)),
        referrer: referrer || null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
      })
      .select("id")
      .single();

    if (error) throw error;

    // Atomic-style increments via read-then-write (acceptable for analytics)
    const [{ data: l }, { data: d }] = await Promise.all([
      supabaseAdmin.from("hazaral_listings").select("view_count").eq("id", listing_id).single(),
      supabaseAdmin.from("hazaral_dealers").select("total_views").eq("id", dealer_id).single(),
    ]);

    await Promise.all([
      l && supabaseAdmin.from("hazaral_listings").update({ view_count: (l.view_count ?? 0) + 1 }).eq("id", listing_id),
      d && supabaseAdmin.from("hazaral_dealers").update({ total_views: (d.total_views ?? 0) + 1 }).eq("id", dealer_id),
    ]);

    return NextResponse.json({ ok: true, view_id: data?.id });
  } catch {
    return NextResponse.json({ ok: true }); // Never fail the user
  }
}

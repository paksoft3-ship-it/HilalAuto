import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

async function getDealer(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const client = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user } } = await client.auth.getUser();
  if (!user) return null;

  const { data } = await supabaseAdmin
    .from("hazaral_dealers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  return data;
}

// PATCH /api/dealer/listings/[id] — update listing (owner only)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const dealer = await getDealer(req);
  if (!dealer) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  // Verify ownership
  const { data: listing } = await supabaseAdmin
    .from("hazaral_listings")
    .select("id, dealer_id")
    .eq("id", params.id)
    .single();

  if (!listing || listing.dealer_id !== dealer.id) {
    return NextResponse.json({ error: "İlan bulunamadı." }, { status: 404 });
  }

  const body = await req.json();

  // Only allow specific fields to be updated
  const allowed = [
    "title", "brand", "model", "year", "fuel_type", "transmission",
    "km", "color", "city", "district",
    "damage_type", "damage_grade", "damage_description", "description",
    "has_tramer", "tramer_amount",
    "asking_price", "is_price_negotiable",
    "images", "primary_image",
    "status",
  ];

  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  // If re-submitting for review, reset status
  if (updates.status === "pending_review" && listing) {
    updates.status = "pending_review";
  }

  const { data, error } = await supabaseAdmin
    .from("hazaral_listings")
    .update(updates)
    .eq("id", params.id)
    .select("id, slug")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ listing: data });
}

// DELETE /api/dealer/listings/[id] — delete listing (owner only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const dealer = await getDealer(req);
  if (!dealer) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { data: listing } = await supabaseAdmin
    .from("hazaral_listings")
    .select("id, dealer_id")
    .eq("id", params.id)
    .single();

  if (!listing || listing.dealer_id !== dealer.id) {
    return NextResponse.json({ error: "İlan bulunamadı." }, { status: 404 });
  }

  const { error } = await supabaseAdmin
    .from("hazaral_listings")
    .delete()
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

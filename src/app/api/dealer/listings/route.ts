import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { generateListingSlug, autoTitle, canAddListing } from "@/lib/dealer-utils";
import { emailAdmin, adminNewListingEmail } from "@/lib/notifications";

// Authenticate request and return dealer
async function getDealer(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return null;

  const { data: dealer } = await supabaseAdmin
    .from("hazaral_dealers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return dealer;
}

// GET /api/dealer/listings — fetch dealer's own listings
export async function GET(req: NextRequest) {
  const dealer = await getDealer(req);
  if (!dealer) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("hazaral_listings")
    .select("*")
    .eq("dealer_id", dealer.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ listings: data || [] });
}

// POST /api/dealer/listings — create a new listing
export async function POST(req: NextRequest) {
  const dealer = await getDealer(req);
  if (!dealer) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { allowed, reason } = canAddListing(
    dealer.subscription_plan,
    dealer.total_listings,
    dealer.subscription_status
  );
  if (!allowed) return NextResponse.json({ error: reason }, { status: 403 });

  const body = await req.json();
  const {
    brand, model, year, fuel_type, transmission, km, color, city, district,
    damage_type, damage_grade, damage_description,
    has_tramer, tramer_amount,
    asking_price, is_price_negotiable,
    title: customTitle,
    images, primary_image,
    status = "pending_review",
  } = body;

  if (!brand || !model || !year || !city || !asking_price) {
    return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
  }

  const slug = generateListingSlug(year, brand, model);
  const title = customTitle || autoTitle(year, brand, model, damage_type || []);

  // Set expiration based on dealer plan
  const days = dealer.subscription_plan === "professional" ? 60 : dealer.subscription_plan === "premium" ? 90 : 30;
  const expires_at = new Date(Date.now() + days * 86400000).toISOString();

  const { data, error } = await supabaseAdmin
    .from("hazaral_listings")
    .insert({
      dealer_id: dealer.id,
      slug,
      status,
      title,
      brand,
      model,
      year: Number(year),
      fuel_type: fuel_type || null,
      transmission: transmission || null,
      km: km ? Number(km) : null,
      color: color || null,
      city,
      district: district || null,
      damage_type: damage_type || [],
      damage_grade: damage_grade || null,
      damage_description: damage_description || null,
      has_tramer: !!has_tramer,
      tramer_amount: tramer_amount ? Number(tramer_amount) : null,
      asking_price: Number(asking_price),
      is_price_negotiable: !!is_price_negotiable,
      images: images || [],
      primary_image: primary_image || null,
      expires_at,
      locale: "tr",
    })
    .select("id, slug")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify admin when listing enters review queue
  if (status === "pending_review" && data) {
    emailAdmin(
      `Yeni İlan İnceleme Bekliyor: ${title}`,
      adminNewListingEmail(title, dealer.company_name, city, Number(asking_price)),
    ).catch(() => {});
  }

  return NextResponse.json({ listing: data }, { status: 201 });
}

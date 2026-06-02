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
    .select("id, subscription_plan, subscription_status")
    .eq("user_id", user.id)
    .single();

  return data;
}

// POST /api/dealer/listings/:id/feature — dealer boosts their own listing
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const dealer = await getDealer(req);
  if (!dealer) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  if (dealer.subscription_status !== "active") {
    return NextResponse.json({ error: "Aktif bir aboneliğiniz yok." }, { status: 403 });
  }

  // Verify listing belongs to this dealer and is active
  const { data: listing, error: listingError } = await supabaseAdmin
    .from("hazaral_listings")
    .select("id, status, is_featured, featured_until")
    .eq("id", params.id)
    .eq("dealer_id", dealer.id)
    .single();

  if (listingError || !listing) {
    return NextResponse.json({ error: "İlan bulunamadı." }, { status: 404 });
  }

  if (listing.status !== "active") {
    return NextResponse.json({ error: "Sadece yayındaki ilanlar öne çıkarılabilir." }, { status: 400 });
  }

  // Fetch plan limits
  const { data: plan } = await supabaseAdmin
    .from("hazaral_subscription_plans")
    .select("can_feature_listings, featured_slots")
    .eq("slug", dealer.subscription_plan)
    .single();

  if (!plan?.can_feature_listings) {
    return NextResponse.json({
      error: "Planınız öne çıkarma özelliğini desteklemiyor. Professional veya Premium plana geçin.",
    }, { status: 403 });
  }

  const featuredSlots = plan.featured_slots ?? 0;

  // Count currently featured and still-valid listings for this dealer
  const { count: currentlyFeatured } = await supabaseAdmin
    .from("hazaral_listings")
    .select("id", { count: "exact", head: true })
    .eq("dealer_id", dealer.id)
    .eq("is_featured", true)
    .gt("featured_until", new Date().toISOString())
    .neq("id", params.id); // exclude the listing being featured (allow re-featuring)

  if ((currentlyFeatured ?? 0) >= featuredSlots) {
    return NextResponse.json({
      error: `Planınızda en fazla ${featuredSlots} öne çıkan ilan hakkınız var. Mevcut öne çıkan ilanlarınızın süresi dolduğunda yeniden kullanabilirsiniz.`,
    }, { status: 403 });
  }

  const featuredUntil = new Date(Date.now() + 7 * 86400000).toISOString();

  const { data: updated, error: updateError } = await supabaseAdmin
    .from("hazaral_listings")
    .update({ is_featured: true, featured_until: featuredUntil })
    .eq("id", params.id)
    .select("id, is_featured, featured_until")
    .single();

  if (updateError) {
    return NextResponse.json({ error: "Güncelleme başarısız." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    listing: updated,
    slotsUsed: (currentlyFeatured ?? 0) + 1,
    slotsTotal: featuredSlots,
  });
}

// DELETE /api/dealer/listings/:id/feature — remove feature boost
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const dealer = await getDealer(req);
  if (!dealer) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { error } = await supabaseAdmin
    .from("hazaral_listings")
    .update({ is_featured: false, featured_until: null })
    .eq("id", params.id)
    .eq("dealer_id", dealer.id);

  if (error) return NextResponse.json({ error: "Güncelleme başarısız." }, { status: 500 });

  return NextResponse.json({ ok: true });
}

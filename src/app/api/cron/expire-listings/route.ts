import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Called by Vercel cron (daily at 02:00 UTC) or manually from admin panel.
// Enforces expires_at on listings and subscription_end on dealers.
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // dev mode — no secret configured
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date().toISOString();
  const summary: Record<string, number> = {};

  // ── 1. Expire listings whose expires_at has passed ─────────────────────────
  const { data: expiredListings, error: listingExpireErr } = await supabaseAdmin
    .from("hazaral_listings")
    .update({ status: "expired" })
    .eq("status", "active")
    .not("expires_at", "is", null)
    .lt("expires_at", now)
    .select("id, dealer_id");

  if (listingExpireErr) console.error("[cron/expire-listings] listings:", listingExpireErr);
  summary.listingsExpired = expiredListings?.length ?? 0;

  // ── 2. Expire dealer subscriptions whose subscription_end has passed ────────
  const { data: expiredDealers, error: dealerExpireErr } = await supabaseAdmin
    .from("hazaral_dealers")
    .update({ subscription_status: "expired" })
    .eq("subscription_status", "active")
    .not("subscription_end", "is", null)
    .lt("subscription_end", now)
    .select("id, company_name, subscription_plan");

  if (dealerExpireErr) console.error("[cron/expire-listings] dealers:", dealerExpireErr);
  summary.dealersExpired = expiredDealers?.length ?? 0;

  // ── 3. When a dealer expires, deactivate all their active listings ──────────
  if (expiredDealers && expiredDealers.length > 0) {
    const dealerIds = expiredDealers.map((d) => d.id);

    const { data: dealerListingsExpired, error: dlErr } = await supabaseAdmin
      .from("hazaral_listings")
      .update({ status: "expired" })
      .in("dealer_id", dealerIds)
      .eq("status", "active")
      .select("id");

    if (dlErr) console.error("[cron/expire-listings] dealer-listings:", dlErr);
    summary.listingsExpiredByDealerExpiry = dealerListingsExpired?.length ?? 0;

    // Create in-app notification for each expired dealer
    const notifications = expiredDealers.map((d) => ({
      dealer_id: d.id,
      type: "subscription_expired" as const,
      title: "Aboneliğiniz Sona Erdi",
      body: `${d.subscription_plan ?? ""} aboneliğiniz sona erdi. İlanlarınız yayından kaldırıldı. Yenileme için bizimle iletişime geçin.`.trim(),
      is_read: false,
    }));

    if (notifications.length > 0) {
      const { error: notifErr } = await supabaseAdmin
        .from("hazaral_notifications")
        .insert(notifications);
      if (notifErr) console.error("[cron/expire-listings] notifications:", notifErr);
    }
  }

  // ── 4. Un-feature listings whose featured_until has passed ─────────────────
  const { data: unfeatured, error: unfeatureErr } = await supabaseAdmin
    .from("hazaral_listings")
    .update({ is_featured: false })
    .eq("is_featured", true)
    .not("featured_until", "is", null)
    .lt("featured_until", now)
    .select("id");

  if (unfeatureErr) console.error("[cron/expire-listings] unfeature:", unfeatureErr);
  summary.listingsUnfeatured = unfeatured?.length ?? 0;

  console.log(`[cron/expire-listings] done at ${now}`, summary);

  return NextResponse.json({ ok: true, timestamp: now, summary });
}

// Support POST for manual admin trigger from the browser
export async function POST(req: NextRequest) {
  return GET(req);
}

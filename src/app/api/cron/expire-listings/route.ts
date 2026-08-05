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

  // ── 2. Warn dealers about listings expiring within a week ──────────────────
  // Membership is free, so nothing is taken away for non-payment; the only
  // lifecycle event is the listing's own 90-day window, and it should never
  // expire silently.
  const weekOut = new Date(Date.now() + 7 * 86400000).toISOString();
  const { data: expiringSoon } = await supabaseAdmin
    .from("hazaral_listings")
    .select("id, dealer_id, title, expires_at")
    .eq("status", "active")
    .not("expires_at", "is", null)
    .gt("expires_at", now)
    .lt("expires_at", weekOut);

  summary.listingsExpiringSoon = expiringSoon?.length ?? 0;

  if (expiringSoon?.length) {
    // One notification per listing per day would be spam; the cron runs daily,
    // so only warn on the day the listing crosses the 7-day mark.
    const sixDaysOut = new Date(Date.now() + 6 * 86400000).toISOString();
    const toWarn = expiringSoon.filter((l) => l.expires_at! > sixDaysOut);
    if (toWarn.length) {
      const { error: warnErr } = await supabaseAdmin.from("hazaral_notifications").insert(
        toWarn.map((l) => ({
          dealer_id: l.dealer_id,
          type: "listing_expiring" as const,
          title: "İlanınızın Süresi Doluyor",
          body: `"${l.title}" ilanının yayın süresi 7 gün içinde doluyor. Panelden süreyi uzatabilirsiniz.`,
          listing_id: l.id,
          is_read: false,
        }))
      );
      if (warnErr) console.error("[cron/expire-listings] expiry-warning:", warnErr);
      summary.expiryWarningsSent = toWarn.length;
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

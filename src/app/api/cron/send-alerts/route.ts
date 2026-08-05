import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { emailUser, alertNewListingEmail } from "@/lib/notifications";

// Called by Vercel cron. Emails saved-search subscribers about listings that
// went active since the last time each alert was notified.
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // dev mode — no secret configured
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

type AlertRow = {
  id: string;
  email: string;
  filters: Record<string, string>;
  label: string | null;
  unsubscribe_token: string;
  last_notified_at: string | null;
  created_at: string;
};

type ListingRow = {
  id: string;
  title: string;
  slug: string;
  brand: string;
  city: string;
  damage_grade: string | null;
  damage_type: string[] | null;
  asking_price: number;
  primary_image: string | null;
  created_at: string;
};

function matches(listing: ListingRow, f: Record<string, string>): boolean {
  if (f.brand && listing.brand.toLowerCase() !== f.brand.toLowerCase()) return false;
  if (f.city && listing.city.toLowerCase() !== f.city.toLowerCase()) return false;
  if (f.grade && (listing.damage_grade ?? "").toUpperCase() !== f.grade.toUpperCase()) return false;
  if (f.damage) {
    const wanted = f.damage.toLowerCase();
    const types = (listing.damage_type ?? []).map((d) => d.toLowerCase());
    if (!types.some((d) => d.includes(wanted) || wanted.includes(d))) return false;
  }
  if (f.maxPrice && listing.asking_price > Number(f.maxPrice)) return false;
  if (f.minPrice && listing.asking_price < Number(f.minPrice)) return false;
  if (f.q) {
    const q = f.q.toLowerCase();
    if (!listing.title.toLowerCase().includes(q)) return false;
  }
  return true;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date().toISOString();
  const summary = { alerts: 0, emailsSent: 0, listingsConsidered: 0 };

  const { data: alerts } = await supabaseAdmin
    .from("hazaral_search_alerts")
    .select("id, email, filters, label, unsubscribe_token, last_notified_at, created_at")
    .eq("is_active", true);

  if (!alerts?.length) {
    return NextResponse.json({ ok: true, timestamp: now, summary });
  }
  summary.alerts = alerts.length;

  // Pull the recent active pool once, then match in memory — the inventory is
  // small and this keeps one query regardless of subscriber count.
  const since = new Date(Date.now() - 30 * 86400000).toISOString();
  const { data: listings } = await supabaseAdmin
    .from("hazaral_listings")
    .select("id, title, slug, brand, city, damage_grade, damage_type, asking_price, primary_image, created_at")
    .eq("status", "active")
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  summary.listingsConsidered = listings?.length ?? 0;
  if (!listings?.length) {
    return NextResponse.json({ ok: true, timestamp: now, summary });
  }

  for (const alert of alerts as AlertRow[]) {
    // Only listings newer than the last notification (or than the signup).
    const cutoff = alert.last_notified_at ?? alert.created_at;
    const fresh = listings.filter(
      (l) => l.created_at > cutoff && matches(l as ListingRow, alert.filters ?? {})
    );
    if (!fresh.length) continue;

    const sent = await emailUser(
      alert.email,
      `Aramanıza uygun ${fresh.length} yeni ilan — Otograde`,
      alertNewListingEmail(
        fresh.slice(0, 6).map((l) => ({
          title: l.title,
          slug: l.slug,
          asking_price: l.asking_price,
          city: l.city,
          primary_image: l.primary_image,
        })),
        alert.label ?? "Kayıtlı aramanız",
        alert.unsubscribe_token
      )
    );

    if (sent) {
      summary.emailsSent += 1;
      await supabaseAdmin
        .from("hazaral_search_alerts")
        .update({ last_notified_at: now, match_count: fresh.length })
        .eq("id", alert.id);
    }
  }

  console.log(`[cron/send-alerts] done at ${now}`, summary);
  return NextResponse.json({ ok: true, timestamp: now, summary });
}

export async function POST(req: NextRequest) {
  return GET(req);
}

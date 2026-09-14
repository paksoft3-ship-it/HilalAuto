import { notFound, redirect } from "next/navigation";
import { VEHICLE_TYPES } from "@/lib/constants";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

const DAMAGE_SLUG: Record<string, string> = Object.fromEntries(
  VEHICLE_TYPES.map((v) => [v.serviceSlug, v.slug]),
);

// Rendered per-request rather than statically generated: a redirect page has
// nothing to pre-render.
export const dynamic = "force-dynamic";

/**
 * Otograde is a marketplace, not a lead-gen seller funnel — these eight pages
 * used to run their own QuickQuoteForm/DarkCTAForm buying pitch, duplicating
 * ankarapert.com.tr and hasarliaracalan.com from inside the marketplace.
 * Nothing here crossed Search Console's traffic-freeze threshold (highest was
 * 3 clicks / 95 impressions), so all eight 301 straight to the equivalent
 * listing category — the closest real page to what the URL used to promise.
 *
 * Builds the target path directly (same locale-conditional pattern used in
 * ara/page.tsx's own canonical) rather than getPathname, to keep this on the
 * simplest, already-proven-live code path in this codebase.
 */
export default async function ServicePageRedirect({ params }: Props) {
  const { locale, slug } = await params;
  const damageSlug = DAMAGE_SLUG[slug];
  if (!damageSlug) notFound();

  const target =
    locale === "en" ? `/en/listings?damage_type=${damageSlug}` : `/ara?damage_type=${damageSlug}`;
  redirect(target);
}

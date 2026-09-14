import { supabaseAdmin } from "@/lib/supabase";
import { DAMAGE_FILTER_OPTIONS } from "@/lib/listing-filters";
import { CITIES_TR } from "@/data/cities";

/**
 * Shared threshold for "does this facet have enough real inventory to be
 * worth a search result" — a single source of truth for generateMetadata
 * (per-facet, at render time), the sitemap (which facets to list at all),
 * and the empty-state UI (which facets to suggest instead).
 */
export const MIN_INDEXABLE_LISTINGS = 3;

export interface IndexableFacet {
  slug: string;
  label: string;
  count: number;
}

/** Damage-type facets (/ara?damage_type=<slug>) currently holding >= MIN_INDEXABLE_LISTINGS active listings. */
export async function getIndexableDamageFacets(): Promise<IndexableFacet[]> {
  const results = await Promise.all(
    DAMAGE_FILTER_OPTIONS.map(async (opt) => {
      const { count } = await supabaseAdmin
        .from("hazaral_listings")
        .select("id", { count: "exact", head: true })
        .eq("status", "active")
        .overlaps("damage_type", opt.matchValues);
      return { slug: opt.slug, label: opt.label, count: count ?? 0 };
    }),
  );
  return results.filter((r) => r.count >= MIN_INDEXABLE_LISTINGS);
}

/** City pages (/sehir/<slug>) currently holding >= MIN_INDEXABLE_LISTINGS active listings. */
export async function getIndexableCityFacets(): Promise<IndexableFacet[]> {
  const { data } = await supabaseAdmin
    .from("hazaral_listings")
    .select("city")
    .eq("status", "active");

  const counts = new Map<string, number>();
  for (const row of (data ?? []) as { city: string | null }[]) {
    if (!row.city) continue;
    counts.set(row.city, (counts.get(row.city) ?? 0) + 1);
  }

  const bySlug = Object.values(CITIES_TR);
  return bySlug
    .map((city) => ({ slug: city.slug, label: city.name, count: counts.get(city.name) ?? 0 }))
    .filter((c) => c.count >= MIN_INDEXABLE_LISTINGS);
}

/** Live count for one damage_type facet — used by generateMetadata to decide indexability at render time. */
export async function countDamageFacetListings(matchValues: string[]): Promise<number> {
  const { count } = await supabaseAdmin
    .from("hazaral_listings")
    .select("id", { count: "exact", head: true })
    .eq("status", "active")
    .overlaps("damage_type", matchValues);
  return count ?? 0;
}

/** Live count for one city page — used by generateMetadata to decide indexability at render time. */
export async function countCityListings(cityName: string): Promise<number> {
  const { count } = await supabaseAdmin
    .from("hazaral_listings")
    .select("id", { count: "exact", head: true })
    .eq("status", "active")
    .eq("city", cityName);
  return count ?? 0;
}

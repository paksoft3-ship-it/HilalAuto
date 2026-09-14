import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { getIndexableCityFacets, getIndexableDamageFacets } from "@/lib/indexable-facets";

// TR = default locale, no prefix (e.g. https://otograde.com/teklif-al)
// EN = /en/ prefix with localised paths (e.g. https://otograde.com/en/get-a-quote)

function tr(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

function en(path: string): string {
  return `${SITE_URL}/en${path === "/" ? "" : path}`;
}

/**
 * No `priority`/`changeFrequency` — Google has said for years it ignores
 * both. `lastModified` is included only where a real date exists (blog
 * posts, listings, dealers all carry genuine updated_at/created_at); the
 * static and facet pages below have no per-page content date to report
 * honestly, so they omit it rather than default to the build timestamp.
 */
function pair(trPath: string, enPath: string, lastMod?: Date): MetadataRoute.Sitemap {
  const alternates = {
    languages: {
      tr: tr(trPath),
      en: en(enPath),
      "x-default": tr(trPath),
    },
  };
  return [
    { url: tr(trPath), ...(lastMod ? { lastModified: lastMod } : {}), alternates },
    { url: en(enPath), ...(lastMod ? { lastModified: lastMod } : {}), alternates },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static pages ────────────────────────────────────────────────────────────
  const statics: MetadataRoute.Sitemap = [
    ...pair("/", "/"),
    ...pair("/teklif-al", "/get-a-quote"),
    ...pair("/arac-turleri", "/vehicle-types"),
    ...pair("/sehir", "/cities"),
    ...pair("/nasil-calisir", "/how-it-works"),
    ...pair("/blog", "/blog"),
    ...pair("/ara", "/listings"),
    ...pair("/grade-sistemi", "/grade-system"),
    ...pair("/hakkimizda", "/about-us"),
    ...pair("/iletisim", "/contact"),
    ...pair("/bayiler", "/bayiler"),
    ...pair("/kvkk", "/kvkk"),
    ...pair("/gizlilik-politikasi", "/privacy-policy"),
    ...pair("/kullanim-kosullari", "/terms-of-use"),
    ...pair("/cerez-politikasi", "/cookie-policy"),
  ];

  // ── Damage-type facets — only ones currently holding real inventory ────────
  // /hizmet/*-arac-alimi (the old seller-funnel pages) are gone from here
  // entirely: they now 301 to these same URLs, and a redirect has no place
  // in a sitemap.
  let damageFacets: MetadataRoute.Sitemap = [];
  try {
    const indexable = await getIndexableDamageFacets();
    damageFacets = indexable.flatMap((f) =>
      pair(`/ara?damage_type=${f.slug}`, `/listings?damage_type=${f.slug}`),
    );
  } catch {
    // Supabase unavailable at build time
  }

  // ── City pages — same rule, only cities with >= MIN_INDEXABLE_LISTINGS ──────
  let cities: MetadataRoute.Sitemap = [];
  try {
    const indexable = await getIndexableCityFacets();
    cities = indexable.flatMap((c) => pair(`/sehir/${c.slug}`, `/cities/${c.slug}`));
  } catch {
    // Supabase unavailable at build time
  }

  // ── Blog posts (dynamic from Supabase) ───────────────────────────────────────
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const { data: posts } = await supabase
      .from("hazaral_blogs")
      .select("slug, locale, created_at, updated_at")
      .eq("status", "published");

    if (posts && posts.length > 0) {
      blogPosts = posts.map((post) => {
        const raw = (post as Record<string, unknown>).updated_at ?? post.created_at ?? new Date();
        const lastMod = new Date(raw as string);
        // Posts are single-locale — only emit the URL for the locale they exist in
        const url = post.locale === "en" ? en(`/blog/${post.slug}`) : tr(`/blog/${post.slug}`);
        return { url, lastModified: lastMod };
      });
    }
  } catch {
    // Supabase unavailable at build time — blog posts excluded from sitemap
  }

  // ── Active listings ──────────────────────────────────────────────────────────
  let marketplaceListings: MetadataRoute.Sitemap = [];
  try {
    // Sold listings stay in the sitemap — they render a "Satıldı" page and
    // keep their SEO value instead of 404ing.
    const { data: activeListing } = await supabase
      .from("hazaral_listings")
      .select("slug, created_at, updated_at")
      .in("status", ["active", "sold"]);

    if (activeListing && activeListing.length > 0) {
      marketplaceListings = activeListing.flatMap((l) => {
        const raw = (l as Record<string, unknown>).updated_at ?? l.created_at ?? new Date();
        const lastMod = new Date(raw as string);
        return pair(`/ara/${l.slug}`, `/listings/${l.slug}`, lastMod);
      });
    }
  } catch {
    // Supabase unavailable at build time
  }

  // ── Dealer profiles ──────────────────────────────────────────────────────────
  let dealerProfiles: MetadataRoute.Sitemap = [];
  try {
    const { data: dealers } = await supabase
      .from("hazaral_dealers")
      .select("slug, updated_at")
      .eq("is_approved", true)
      .not("slug", "is", null);

    if (dealers && dealers.length > 0) {
      dealerProfiles = dealers.flatMap((d) => {
        const lastMod = new Date((d.updated_at as string) ?? new Date());
        return pair(`/bayi/${d.slug}`, `/dealer/${d.slug}`, lastMod);
      });
    }
  } catch {
    // Supabase unavailable at build time
  }

  return [...statics, ...damageFacets, ...cities, ...blogPosts, ...marketplaceListings, ...dealerProfiles];
}

import type { MetadataRoute } from "next";
import { ALL_SERVICE_SLUGS } from "@/data/services";
import { ALL_CITY_SLUGS } from "@/data/cities";
import { SITE_URL } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { getPathname } from "@/i18n/routing";


// TR = default locale, no prefix (e.g. https://otograde.com/teklif-al)
// EN = /en/ prefix with localised paths (e.g. https://otograde.com/en/get-a-quote)

function tr(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

function en(path: string): string {
  return `${SITE_URL}/en${path === "/" ? "" : path}`;
}

type Entry = MetadataRoute.Sitemap[number];

function pair(
  trPath: string,
  enPath: string,
  opts: { freq?: Entry["changeFrequency"]; priority?: number; lastMod?: Date } = {}
): MetadataRoute.Sitemap {
  const lastModified = opts.lastMod ?? new Date();
  const freq = opts.freq ?? "monthly";
  const trPriority = opts.priority ?? 0.7;
  const enPriority = Math.max(trPriority - 0.05, 0.1);

  const alternates = {
    languages: {
      tr: tr(trPath),
      en: en(enPath),
      "x-default": tr(trPath),
    },
  };

  return [
    { url: tr(trPath), lastModified, changeFrequency: freq, priority: trPriority, alternates },
    { url: en(enPath), lastModified, changeFrequency: freq, priority: enPriority, alternates },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static pages ────────────────────────────────────────────────────────────
  const statics: MetadataRoute.Sitemap = [
    ...pair("/", "/",                                      { freq: "weekly",  priority: 1.00 }),
    ...pair("/teklif-al",          "/get-a-quote",         { freq: "monthly", priority: 0.90 }),
    ...pair("/arac-turleri",       "/vehicle-types",       { freq: "monthly", priority: 0.85 }),
    ...pair("/sehir",              "/cities",              { freq: "monthly", priority: 0.80 }),
    ...pair("/nasil-calisir",      "/how-it-works",        { freq: "monthly", priority: 0.75 }),
    ...pair("/blog",               "/blog",                { freq: "weekly",  priority: 0.70 }),
    ...pair("/ara",                "/listings",            { freq: "daily",   priority: 0.90 }),
    ...pair("/hakkimizda",         "/about-us",            { freq: "monthly", priority: 0.60 }),
    ...pair("/iletisim",           "/contact",             { freq: "monthly", priority: 0.60 }),
    ...pair("/bayiler",            "/bayiler",             { freq: "weekly",  priority: 0.60 }),
    ...pair("/kvkk",               "/kvkk",                { freq: "yearly",  priority: 0.30 }),
    ...pair("/gizlilik-politikasi","/privacy-policy",      { freq: "yearly",  priority: 0.30 }),
    ...pair("/kullanim-kosullari", "/terms-of-use",        { freq: "yearly",  priority: 0.30 }),
    ...pair("/cerez-politikasi",   "/cookie-policy",       { freq: "yearly",  priority: 0.30 }),
  ];

  // ── Service pages — TR slug kept canonical, EN uses translated slug ─────────
  const services: MetadataRoute.Sitemap = ALL_SERVICE_SLUGS.flatMap((slug) => {
    const trUrl = `${SITE_URL}${getPathname({ locale: "tr", href: `/hizmet/${slug}` as never })}`;
    const enUrl = `${SITE_URL}${getPathname({ locale: "en", href: `/hizmet/${slug}` as never })}`;
    const alternates = { languages: { tr: trUrl, en: enUrl, "x-default": trUrl } };
    return [
      { url: trUrl, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.85, alternates },
      { url: enUrl, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.80, alternates },
    ];
  });

  // ── City pages ───────────────────────────────────────────────────────────────
  const cities: MetadataRoute.Sitemap = ALL_CITY_SLUGS.flatMap((slug) =>
    pair(`/sehir/${slug}`, `/cities/${slug}`, { priority: 0.80 })
  );

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
        return {
          url,
          lastModified: lastMod,
          changeFrequency: "monthly" as const,
          priority: 0.65,
        };
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
        return pair(`/ara/${l.slug}`, `/listings/${l.slug}`, {
          freq: "weekly",
          priority: 0.80,
          lastMod,
        });
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
        return pair(`/bayi/${d.slug}`, `/dealer/${d.slug}`, {
          freq: "weekly",
          priority: 0.60,
          lastMod,
        });
      });
    }
  } catch {
    // Supabase unavailable at build time
  }

  return [...statics, ...services, ...cities, ...blogPosts, ...marketplaceListings, ...dealerProfiles];
}

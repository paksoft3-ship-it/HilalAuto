import type { MetadataRoute } from "next";
import { ALL_SERVICE_SLUGS } from "@/data/services";
import { ALL_CITY_SLUGS } from "@/data/cities";
import { SITE_URL } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

// TR = default locale, no prefix (e.g. https://hazaral.com/teklif-al)
// EN = /en/ prefix with localised paths (e.g. https://hazaral.com/en/get-a-quote)

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
    ...pair("/satilik-araclar",    "/vehicles-for-sale",   { freq: "weekly",  priority: 0.70 }),
    ...pair("/hakkimizda",         "/about-us",            { freq: "monthly", priority: 0.60 }),
    ...pair("/iletisim",           "/contact",             { freq: "monthly", priority: 0.60 }),
    ...pair("/kvkk",               "/kvkk",                { freq: "yearly",  priority: 0.30 }),
    ...pair("/gizlilik-politikasi","/privacy-policy",      { freq: "yearly",  priority: 0.30 }),
    ...pair("/kullanim-kosullari", "/terms-of-use",        { freq: "yearly",  priority: 0.30 }),
  ];

  // ── Service pages ────────────────────────────────────────────────────────────
  const services: MetadataRoute.Sitemap = ALL_SERVICE_SLUGS.flatMap((slug) =>
    pair(`/hizmet/${slug}`, `/service/${slug}`, { priority: 0.85 })
  );

  // ── City pages ───────────────────────────────────────────────────────────────
  const cities: MetadataRoute.Sitemap = ALL_CITY_SLUGS.flatMap((slug) =>
    pair(`/sehir/${slug}`, `/cities/${slug}`, { priority: 0.80 })
  );

  // ── Blog posts (dynamic from Supabase) ───────────────────────────────────────
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const { data: posts } = await supabase
      .from("hazaral_blogs")
      .select("slug, created_at");

    if (posts && posts.length > 0) {
      blogPosts = posts.flatMap((post) => {
        const lastMod = new Date(post.created_at ?? new Date());
        return pair(`/blog/${post.slug}`, `/blog/${post.slug}`, {
          freq: "monthly",
          priority: 0.65,
          lastMod,
        });
      });
    }
  } catch {
    // Supabase unavailable at build time — blog posts excluded from sitemap
  }

  return [...statics, ...services, ...cities, ...blogPosts];
}

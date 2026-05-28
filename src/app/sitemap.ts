import type { MetadataRoute } from "next";
import { ALL_SERVICE_SLUGS } from "@/data/services";
import { ALL_CITY_SLUGS } from "@/data/cities";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const locale = "tr";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/${locale}`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/${locale}/teklif-al`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/${locale}/nasil-calisir`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/${locale}/hakkimizda`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/${locale}/iletisim`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/${locale}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/${locale}/arac-turleri`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const servicePages: MetadataRoute.Sitemap = ALL_SERVICE_SLUGS.map((slug) => ({
    url: `${SITE_URL}/${locale}/hizmet/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const cityPages: MetadataRoute.Sitemap = ALL_CITY_SLUGS.map((slug) => ({
    url: `${SITE_URL}/${locale}/sehir/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...servicePages, ...cityPages];
}

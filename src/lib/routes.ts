/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { VEHICLE_TYPES } from "@/lib/constants";

// The old /hizmet/*-arac-alimi seller-funnel pages now 301 to their matching
// /ara?damage_type=<slug> listing category — this maps the long "-arac-alimi"
// slug straight to the short damage_type slug so every internal link points
// at the final destination instead of through the redirect.
const SERVICE_TO_DAMAGE_SLUG: Record<string, string> = Object.fromEntries(
  VEHICLE_TYPES.map((v) => [v.serviceSlug, v.slug]),
);

export const routes = {
  home: () => `/` as any,
  quote: () => `/teklif-al` as any,
  howItWorks: () => `/nasil-calisir` as any,
  about: () => `/hakkimizda` as any,
  vehicleTypes: () => `/arac-turleri` as any,
  cities: () => `/sehir` as any,
  contact: () => `/iletisim` as any,
  blog: () => `/blog` as any,
  blogPost: (slug: string) => `/blog/${slug}` as any,
  guide: () => `/rehber` as any,
  guidePost: (slug: string) => `/rehber/${slug}` as any,
  gradeSystem: () => `/grade-sistemi` as any,
  service: (slug: string) => `/ara?damage_type=${SERVICE_TO_DAMAGE_SLUG[slug] ?? slug}` as any,
  damageFilter: (slug: string) => `/ara?damage_type=${slug}` as any,
  city: (slug: string) => `/sehir/${slug}` as any,
  thankYou: () => `/tesekkurler` as any,
  marketplace: () => `/ara` as any,
  listing: (slug: string) => `/ara/${slug}` as any,
  dealer: (slug: string) => `/bayi/${slug}` as any,
  dealers: () => `/bayiler` as any,
  becomeDealer: () => `/bayi-ol` as any,
  dealerPanel: () => `/bayi-paneli` as any,
  kvkk: () => `/kvkk` as any,
  privacy: () => `/gizlilik-politikasi` as any,
  terms: () => `/kullanim-kosullari` as any,
} as const;

export const externalRoutes = {
  whatsapp: (number: string, message?: string) =>
    `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`,
  phone: (number: string) => `tel:${number}`,
} as const;

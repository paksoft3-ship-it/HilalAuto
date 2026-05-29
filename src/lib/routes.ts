/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
export const routes = {
  home: () => `/` as any,
  quote: () => `/teklif-al` as any,
  howItWorks: () => `/nasil-calisir` as any,
  about: () => `/hakkimizda` as any,
  vehicleTypes: () => `/arac-turleri` as any,
  contact: () => `/iletisim` as any,
  blog: () => `/blog` as any,
  blogPost: (slug: string) => `/blog/${slug}` as any,
  service: (slug: string) => `/hizmet/${slug}` as any,
  city: (slug: string) => `/sehir/${slug}` as any,
  thankYou: () => `/tesekkurler` as any,
  kvkk: () => `/kvkk` as any,
  privacy: () => `/gizlilik-politikasi` as any,
  terms: () => `/kullanim-kosullari` as any,
} as const;

export const externalRoutes = {
  whatsapp: (number: string, message?: string) =>
    `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`,
  phone: (number: string) => `tel:${number}`,
} as const;

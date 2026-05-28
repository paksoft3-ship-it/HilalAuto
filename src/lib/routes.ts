export const routes = {
  home: (locale: string) => `/${locale}`,
  quote: (locale: string) => `/${locale}/teklif-al`,
  howItWorks: (locale: string) => `/${locale}/nasil-calisir`,
  about: (locale: string) => `/${locale}/hakkimizda`,
  vehicleTypes: (locale: string) => `/${locale}/arac-turleri`,
  contact: (locale: string) => `/${locale}/iletisim`,
  blog: (locale: string) => `/${locale}/blog`,
  blogPost: (locale: string, slug: string) => `/${locale}/blog/${slug}`,
  service: (locale: string, slug: string) => `/${locale}/hizmet/${slug}`,
  city: (locale: string, slug: string) => `/${locale}/sehir/${slug}`,
  thankYou: (locale: string) => `/${locale}/tesekkurler`,
  kvkk: (locale: string) => `/${locale}/kvkk`,
  privacy: (locale: string) => `/${locale}/gizlilik-politikasi`,
  terms: (locale: string) => `/${locale}/kullanim-kosullari`,
} as const;

export const externalRoutes = {
  whatsapp: (number: string, message?: string) =>
    `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`,
  phone: (number: string) => `tel:${number}`,
} as const;

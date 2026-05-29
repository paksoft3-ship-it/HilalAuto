import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/nasil-calisir": {
      tr: "/nasil-calisir",
      en: "/how-it-works"
    },
    "/teklif-al": {
      tr: "/teklif-al",
      en: "/get-a-quote"
    },
    "/tesekkurler": {
      tr: "/tesekkurler",
      en: "/thank-you"
    },
    "/hakkimizda": {
      tr: "/hakkimizda",
      en: "/about-us"
    },
    "/sehir": {
      tr: "/sehir",
      en: "/cities"
    },
    "/sehir/[slug]": {
      tr: "/sehir/[slug]",
      en: "/cities/[slug]"
    },
    "/hizmet/[slug]": {
      tr: "/hizmet/[slug]",
      en: "/service/[slug]"
    },
    "/iletisim": {
      tr: "/iletisim",
      en: "/contact"
    },
    "/arac-turleri": {
      tr: "/arac-turleri",
      en: "/vehicle-types"
    },
    "/blog": {
      tr: "/blog",
      en: "/blog"
    },
    "/blog/[slug]": {
      tr: "/blog/[slug]",
      en: "/blog/[slug]"
    },
    "/kvkk": {
      tr: "/kvkk",
      en: "/kvkk"
    },
    "/gizlilik-politikasi": {
      tr: "/gizlilik-politikasi",
      en: "/privacy-policy"
    },
    "/kullanim-kosullari": {
      tr: "/kullanim-kosullari",
      en: "/terms-of-use"
    },
    "/satilik-araclar": {
      tr: "/satilik-araclar",
      en: "/vehicles-for-sale"
    },
    "/satilik-araclar/[id]": {
      tr: "/satilik-araclar/[id]",
      en: "/vehicles-for-sale/[id]"
    },
    "/admin": "/admin",
    "/admin/cars": "/admin/cars",
    "/admin/blogs": "/admin/blogs",
    "/admin/leads": "/admin/leads",
    "/admin/login": "/admin/login"
  }
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/nasil-calisir": { tr: "/nasil-calisir", en: "/how-it-works" },
    "/teklif-al":     { tr: "/teklif-al",     en: "/get-a-quote" },
    "/tesekkurler":   { tr: "/tesekkurler",   en: "/thank-you" },
    "/hakkimizda":    { tr: "/hakkimizda",    en: "/about-us" },
    "/sehir":         { tr: "/sehir",         en: "/cities" },
    "/sehir/[slug]":  { tr: "/sehir/[slug]",  en: "/cities/[slug]" },
    "/iletisim":      { tr: "/iletisim",      en: "/contact" },
    "/arac-turleri":  { tr: "/arac-turleri",  en: "/vehicle-types" },
    "/blog":          { tr: "/blog",          en: "/blog" },
    "/blog/[slug]":   { tr: "/blog/[slug]",   en: "/blog/[slug]" },
    "/kvkk":              "/kvkk",
    "/gizlilik-politikasi": { tr: "/gizlilik-politikasi", en: "/privacy-policy" },
    "/kullanim-kosullari":  { tr: "/kullanim-kosullari",  en: "/terms-of-use" },
    "/satilik-araclar":      { tr: "/satilik-araclar",     en: "/vehicles-for-sale" },
    "/satilik-araclar/[id]": { tr: "/satilik-araclar/[id]",en: "/vehicles-for-sale/[id]" },

    // Service pages — specific paths so the slug itself is translated in English URLs
    // TR: /hizmet/<tr-slug>  →  EN: /en/service/<en-slug>
    "/hizmet/kazali-arac-alimi":        { tr: "/hizmet/kazali-arac-alimi",        en: "/service/accident-damaged-vehicles" },
    "/hizmet/pert-arac-alimi":          { tr: "/hizmet/pert-arac-alimi",          en: "/service/written-off-vehicles" },
    "/hizmet/yanmis-arac-alimi":        { tr: "/hizmet/yanmis-arac-alimi",        en: "/service/fire-damaged-vehicles" },
    "/hizmet/sel-hasarli-arac-alimi":   { tr: "/hizmet/sel-hasarli-arac-alimi",   en: "/service/flood-damaged-vehicles" },
    "/hizmet/hurda-arac-alimi":         { tr: "/hizmet/hurda-arac-alimi",         en: "/service/scrap-vehicles" },
    "/hizmet/motor-arizali-arac-alimi": { tr: "/hizmet/motor-arizali-arac-alimi", en: "/service/engine-fault-vehicles" },
    "/hizmet/cekme-belgeli-arac-alimi": { tr: "/hizmet/cekme-belgeli-arac-alimi", en: "/service/tow-certificate-vehicles" },
    "/hizmet/agir-hasarli-arac-alimi":  { tr: "/hizmet/agir-hasarli-arac-alimi",  en: "/service/heavily-damaged-vehicles" },

    "/ara":              { tr: "/ara",          en: "/listings" },
    "/ara/[slug]":       { tr: "/ara/[slug]",   en: "/listings/[slug]" },
    "/bayi/[slug]":      { tr: "/bayi/[slug]",  en: "/dealer/[slug]" },
    "/bayi-ol":                        { tr: "/bayi-ol",       en: "/become-a-dealer" },
    "/bayi-paneli":                    "/bayi-paneli",
    "/bayi-paneli/giris":              "/bayi-paneli/giris",
    "/bayi-paneli/ilanlarim":          "/bayi-paneli/ilanlarim",
    "/bayi-paneli/ilan-ekle":          "/bayi-paneli/ilan-ekle",
    "/bayi-paneli/ilan-duzenle/[id]":  "/bayi-paneli/ilan-duzenle/[id]",
    "/bayi-paneli/mesajlar":           "/bayi-paneli/mesajlar",
    "/bayi-paneli/analitik":           "/bayi-paneli/analitik",
    "/bayi-paneli/bildirimler":        "/bayi-paneli/bildirimler",

    "/admin":                    "/admin",
    "/admin/cars":               "/admin/cars",
    "/admin/blogs":              "/admin/blogs",
    "/admin/leads":              "/admin/leads",
    "/admin/login":              "/admin/login",
    "/admin/bayiler":            "/admin/bayiler",
    "/admin/ilanlar":            "/admin/ilanlar",
    "/admin/abonelikler":        "/admin/abonelikler",
    "/admin/platform-analitik":  "/admin/platform-analitik",
  },
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

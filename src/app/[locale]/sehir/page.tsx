import { getPathname } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { MapPin, ArrowRight } from "lucide-react";
import { FaWhatsapp } from 'react-icons/fa';
import { Navbar } from "@/components/layout/Navbar";
import { GroupSiteBacklink } from "@/components/seo/GroupSiteBacklink";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { DarkCTAForm } from "@/components/sections/DarkCTAForm";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { getCities } from "@/data/cities";
import { routes, externalRoutes } from "@/lib/routes";
import { localeUrl } from "@/lib/locale-url";
import { SITE_URL, WHATSAPP_NUMBER } from "@/lib/constants";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t("citiesTitleMeta", { default: "Türkiye Geneli Hasarlı Araç Alanlar — Tüm Şehirler | Oto Grade" });
  const description = t("citiesDescMeta", { default: "Oto Grade olarak Türkiye'nin 15 büyük şehrinde kazalı, pert ve hurda araç alım hizmeti veriyoruz. Şehrinizi seçin, ücretsiz teklif alın." });
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `${SITE_URL}${getPathname({ locale, href: "/sehir" })}`,
      languages: {
        tr: `${SITE_URL}${getPathname({ locale: "tr", href: "/sehir" })}`,
        en: `${SITE_URL}${getPathname({ locale: "en", href: "/sehir" })}`,
        "x-default": `${SITE_URL}${getPathname({ locale: "tr", href: "/sehir" })}`,
      },
    },
    openGraph: {
      title,
      description,
      locale: locale === "en" ? "en_US" : "tr_TR",
      type: "website",
    },
  };
}

export default async function SehirlerPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "citiesIndex" });
  const CITIES_DATA = getCities(locale);

  const cities = Object.values(CITIES_DATA);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("home", { default: "Ana Sayfa" }), item: localeUrl(locale, "/") },
      { "@type": "ListItem", position: 2, name: t("cities", { default: "Şehirler" }), item: localeUrl(locale, "/sehir") },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("listName", { default: "Hizmet Verdiğimiz Şehirler" }),
    itemListElement: cities.map((city, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${city.name} ${t("citySuffix", { default: "Hasarlı Araç Alanlar" })}`,
      url: localeUrl(locale, `/sehir/${city.slug}`),
    })),
  };

  return (
    <>
      <Navbar />
      <main className="pb-[76px] md:pb-0">
        {/* Hero */}
        <section className="bg-bg-surface border-b border-[0.5px] border-border-default py-32 md:py-44">
          <Container>
            <div className="flex flex-col items-start gap-16 max-w-[640px] w-full">
              <Badge variant="accent">{t("badge", { default: "Şehirler" })}</Badge>
              <h1 className="text-section-title-mobile md:text-[40px] font-medium tracking-heading text-text-primary">
                {t("heroTitle", { default: "Türkiye'nin Her Yerinden Hasarlı Araç Alımı" })}
              </h1>
              <p className="text-[14px] text-text-muted leading-relaxed">
                {t("heroDesc", { default: "Nerede olursanız olun, kazalı veya arızalı aracınızı ücretsiz çekici hizmetimizle kapınızdan alıyor, ödemesini anında nakit yapıyoruz." })}
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-12 mt-8 w-full sm:w-auto">
                <Link
                  href={routes.quote()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-8 bg-primary text-white px-32 py-16 rounded-btn font-medium text-[14px] hover:opacity-90 transition-opacity"
                >
                  {t("ctaQuote", { default: "Ücretsiz Teklif Al" })}
                  <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
                </Link>
                <a
                  href={externalRoutes.whatsapp(WHATSAPP_NUMBER)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-8 bg-transparent border border-whatsapp-green text-whatsapp-green px-32 py-16 rounded-btn text-[14px] font-medium hover:bg-whatsapp-green hover:text-white transition-colors"
                  aria-label={t("ctaWhatsappAria", { default: "WhatsApp ile yazın" })}
                >
                  <FaWhatsapp size={16} aria-hidden />
                  {t("ctaWhatsapp", { default: "WhatsApp ile Yaz" })}
                </a>
              </div>
            </div>
          </Container>
        </section>
        <GroupSiteBacklink variant="cityIndex" locale={locale} />

        {/* City grid */}
        <section className="py-32 md:py-44">
          <Container>
            <SectionHeader
              title={t("sectionTitle", { default: "Hizmet Verdiğimiz Şehirler" })}
              subtitle={t("sectionSubtitle", { default: "Aşağıdan şehrinizi seçin, o şehre özel hasarlı araç alım sayfasına ulaşın." })}
              align="left"
              className="mb-24"
            />
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={routes.city(city.slug)}
                    className="group flex flex-col gap-12 p-24 bg-bg-surface border border-[0.5px] border-border-default rounded-card hover:border-accent-border hover:bg-accent-light transition-colors h-full"
                  >
                    <div className="flex items-center gap-8">
                      <MapPin
                        size={16}
                        strokeWidth={1.5}
                        className="text-accent shrink-0"
                        aria-hidden
                      />
                      <p className="text-[15px] font-medium text-text-primary">{city.name}</p>
                    </div>
                    <p className="text-[12px] text-text-muted leading-relaxed line-clamp-2">
                      {city.description}
                    </p>
                    <div className="flex flex-wrap gap-6 mt-auto pt-8">
                      {city.districts.slice(0, 3).map((d) => (
                        <span
                          key={d}
                          className="px-8 py-2 bg-white border border-[0.5px] border-border-default rounded-pill text-[11px] text-text-soft"
                        >
                          {d}
                        </span>
                      ))}
                      {city.districts.length > 3 && (
                        <span className="px-8 py-2 text-[11px] text-text-soft">
                          +{city.districts.length - 3} {t("districts", { default: "ilçe" })}
                        </span>
                      )}
                    </div>
                    <span className="text-[12px] text-accent font-medium flex items-center gap-4 mt-4 group-hover:gap-8 transition-all">
                      {t("getQuote", { default: "Teklif Al" })} <ArrowRight size={12} strokeWidth={1.5} aria-hidden />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <DarkCTAForm />
        <FinalCTA />
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <MobileStickyCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </>
  );
}

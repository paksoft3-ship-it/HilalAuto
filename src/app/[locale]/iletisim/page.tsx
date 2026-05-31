/* eslint-disable @typescript-eslint/no-unused-vars */
import { getPathname } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ContactForm } from "@/components/forms/ContactForm";
import { PHONE_NUMBER, WHATSAPP_NUMBER, SITE_URL, CITIES } from "@/lib/constants";
import { localeUrl } from "@/lib/locale-url";
import { externalRoutes, routes } from "@/lib/routes";
import { Link } from "@/i18n/routing";
import { FaWhatsapp } from 'react-icons/fa';

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t("contactTitle", { default: "İletişim — Oto Grade" });
  const description = t("contactDescription", { default: "Oto Grade ile iletişime geçin. Telefon, WhatsApp veya form üzerinden bize ulaşın." });
  const canonical = `${SITE_URL}${getPathname({ locale, href: "/iletisim" })}`;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        tr: `${SITE_URL}${getPathname({ locale: "tr", href: "/iletisim" })}`,
        en: `${SITE_URL}${getPathname({ locale: "en", href: "/iletisim" })}`,
        "x-default": `${SITE_URL}${getPathname({ locale: "tr", href: "/iletisim" })}`,
      },
    },
    openGraph: { title, description, url: canonical, locale: locale === "en" ? "en_US" : "tr_TR", type: "website" },
  };
}

export default async function IletisimPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: t("title", { default: "Bize Ulaşın" }),
    url: localeUrl(locale, locale === "en" ? "/contact" : "/iletisim"),
    mainEntity: {
      "@type": "LocalBusiness",
      name: "Oto Grade",
      url: SITE_URL,
      telephone: PHONE_NUMBER,
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: PHONE_NUMBER,
          contactType: "customer service",
          contactOption: "TollFree",
          availableLanguage: ["Turkish", "English"],
        },
      ],
    },
  };

  return (
    <>
      <Navbar />
      <main className="pb-[76px] md:pb-0">
        {/* Hero */}
        <section className="relative py-32 md:py-44 overflow-hidden border-b border-[0.5px] border-border-default">
          {/* <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/sections/contact_hero_bg.png')" }}
          /> */}
          <div className="absolute inset-0 z-0 bg-black/60" />
          <Container className="relative z-10 flex flex-col items-center text-center gap-16">
            <Badge variant="accent">{t("badge", { default: "İletişim" })}</Badge>
            <h1 className="text-section-title-mobile md:text-[40px] font-medium tracking-heading text-white w-full">
              {t("title", { default: "Bize Ulaşın" })}
            </h1>
            <p className="text-[14px] text-white/80 leading-relaxed">
              {t("subtitle", { default: "Sorularınız için arayın, yazın veya formu doldurun. Hızlıca dönüş yapıyoruz." })}
            </p>
          </Container>
        </section>

        {/* Contact options */}
        <section className="py-32 md:py-44">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-32">
              {/* Contact cards + form */}
              <div className="lg:col-span-7 flex flex-col gap-16">
                {/* Phone */}
                <a href={externalRoutes.phone(PHONE_NUMBER)} className="flex items-center gap-16 p-24 bg-white border border-[0.5px] border-border-default rounded-card hover:border-accent-border transition-colors group">
                  <div className="flex items-center justify-center w-[44px] h-[44px] bg-accent-light border border-[0.5px] border-accent-border rounded-full shrink-0">
                    <Phone size={20} strokeWidth={1.5} className="text-accent" aria-hidden />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-text-primary group-hover:text-accent transition-colors">{t("phoneCta", { default: "Telefonla Ara" })}</p>
                    <p className="text-[13px] text-text-muted mt-4">{PHONE_NUMBER.replace("+90", "0")}</p>
                  </div>
                </a>

                {/* WhatsApp */}
                <a href={externalRoutes.whatsapp(WHATSAPP_NUMBER)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-16 p-24 bg-white border border-[0.5px] border-border-default rounded-card hover:border-whatsapp transition-colors group">
                  <div className="flex items-center justify-center w-[44px] h-[44px] bg-green-50 border border-[0.5px] border-green-200 rounded-full shrink-0">
                    <FaWhatsapp size={20} strokeWidth={1.5} className="text-whatsapp" aria-hidden />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-text-primary group-hover:text-whatsapp transition-colors">{t("whatsappCta", { default: "WhatsApp ile Yaz" })}</p>
                    <p className="text-[13px] text-text-muted mt-4">{t("whatsappSub", { default: "7 gün yanıt veriyoruz" })}</p>
                  </div>
                </a>

                {/* Contact form */}
                <div className="p-24 bg-white border border-[0.5px] border-border-default rounded-card mt-8">
                  <h2 className="text-[16px] font-medium text-text-primary mb-24">{t("formTitle", { default: "İletişim Formu" })}</h2>
                  <ContactForm />
                </div>
              </div>

              {/* Sidebar: cities */}
              <aside className="lg:col-span-5" aria-label={t("citiesAria", { default: "Hizmet verilen şehirler" })}>
                <div className="bg-bg-surface border border-[0.5px] border-border-default rounded-card p-24">
                  <h2 className="text-[15px] font-medium text-text-primary mb-16">{t("citiesTitle", { default: "Hizmet Verdiğimiz Şehirler" })}</h2>
                  <ul className="flex flex-wrap gap-8">
                    {Object.entries(CITIES).map(([slug, name]) => (
                      <li key={slug}>
                        <Link href={routes.city(slug)} className="px-12 py-4 bg-white border border-[0.5px] border-border-default rounded-pill text-[12px] text-text-muted hover:border-accent hover:text-accent transition-colors">
                          {name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[12px] text-text-soft mt-16">{t("citiesSub", { default: "ve Türkiye'nin tüm illeri" })}</p>
                </div>
              </aside>
            </div>
          </Container>
        </section>

        <FAQSection />
        <FinalCTA />
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <MobileStickyCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }} />
    </>
  );
}

import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { VehicleTypeCards } from "@/components/sections/VehicleTypeCards";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SocialProof } from "@/components/sections/SocialProof";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { DarkCTAForm } from "@/components/sections/DarkCTAForm";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { OG_IMAGE_URL, PHONE_NUMBER, SITE_URL } from "@/lib/constants";
import { localeUrl } from "@/lib/locale-url";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t("homeTitle");
  const description = t("homeDescription");
  const url = localeUrl(locale, "/");
  const isEn = locale === "en";

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        tr: localeUrl("tr", "/"),
        en: localeUrl("en", "/"),
        "x-default": localeUrl("tr", "/"),
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Oto Grade",
      locale: isEn ? "en_US" : "tr_TR",
      type: "website",
      images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const faqT = await getTranslations({ locale, namespace: "faq" });

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Oto Grade",
    url: SITE_URL,
    logo: OG_IMAGE_URL,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE_NUMBER,
      contactType: "customer service",
      availableLanguage: "Turkish",
    },
    sameAs: [],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "Oto Grade — Hasarlı Araç Alım",
    description: t("homeDescription", { default: "Türkiye genelinde kazalı, pert, yanmış, sel hasarlı ve hurda araç alım hizmeti. Ücretsiz teklif, yerinden teslim." }),
    url: SITE_URL,
    telephone: PHONE_NUMBER,
    priceRange: t("priceRange", { default: "Ücretsiz Teklif" }),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "20:00",
    },
    areaServed: {
      "@type": "Country",
      name: "TR",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Hasarlı Araç Alım Hizmetleri",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Kazalı Araç Alımı" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Pert Araç Alımı" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hurda Araç Alımı" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Yanmış Araç Alımı" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sel Hasarlı Araç Alımı" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Motor Arızalı Araç Alımı" } },
      ],
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Oto Grade",
    url: SITE_URL,
    description: t("websiteDescription", { default: "Türkiye genelinde hasarlı araç alım hizmeti" }),
    inLanguage: locale === "en" ? "en-US" : "tr-TR",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: Array.from({ length: 8 }).map((_, i) => ({
      "@type": "Question",
      name: faqT(`q${i + 1}` as never),
      acceptedAnswer: {
        "@type": "Answer",
        text: faqT(`a${i + 1}` as never),
      },
    })),
  };

  return (
    <>
      <Navbar />
      <main className="pb-[76px] md:pb-0">
        <Hero />
        <TrustBar />
        <VehicleTypeCards />
        <HowItWorks />
        <SocialProof />
        <WhyChooseUs />
        <DarkCTAForm />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <MobileStickyCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}

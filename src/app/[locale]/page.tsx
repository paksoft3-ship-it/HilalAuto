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
import { SITE_URL, OG_IMAGE_URL } from "@/lib/constants";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  const title = "HazarAl — Hasarlı Araç Alım";
  const description = t("description");
  const url = `${SITE_URL}/${locale}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        tr: `${SITE_URL}/tr`,
        "tr-TR": `${SITE_URL}/tr`,
        en: `${SITE_URL}/en`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "HazarAl",
      locale: locale === "tr" ? "tr_TR" : "en_US",
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
    </>
  );
}

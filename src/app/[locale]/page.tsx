import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { MarketplaceHero, type HeroStats } from "@/components/sections/MarketplaceHero";
import { FeaturedListings } from "@/components/sections/FeaturedListings";
import { MarketplaceHowItWorks } from "@/components/sections/MarketplaceHowItWorks";
import { GradeExplainer } from "@/components/sections/GradeExplainer";
import { DirectBuyingCTA } from "@/components/sections/DirectBuyingCTA";
import { RecentListings } from "@/components/sections/RecentListings";
import { VehicleTypeCards } from "@/components/sections/VehicleTypeCards";
import { TrustBar } from "@/components/sections/TrustBar";
import { SocialProof } from "@/components/sections/SocialProof";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { supabaseAdmin } from "@/lib/supabase";
import { type CardListing } from "@/components/marketplace/HomepageListingCard";
import { OG_IMAGE_URL, PHONE_NUMBER, SITE_URL } from "@/lib/constants";
import { localeUrl } from "@/lib/locale-url";

export const revalidate = 3600;

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
    title: { absolute: title },
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
      siteName: "Otograde",
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

// ── Server-side data fetching ──────────────────────────────────────────────────

async function fetchHomeData() {
  try {
    const [
      { count: listingCount },
      { count: dealerCount },
      { data: cityRows },
      { data: featuredRows },
      { data: recentRows },
    ] = await Promise.all([
      supabaseAdmin
        .from("hazaral_listings")
        .select("id", { count: "exact", head: true })
        .eq("status", "active"),
      supabaseAdmin
        .from("hazaral_dealers")
        .select("id", { count: "exact", head: true })
        .eq("subscription_status", "active")
        .eq("is_approved", true),
      supabaseAdmin
        .from("hazaral_listings")
        .select("city")
        .eq("status", "active")
        .limit(500),
      supabaseAdmin
        .from("hazaral_listings")
        .select("id, slug, title, brand, model, year, km, fuel_type, city, damage_grade, damage_type, asking_price, is_featured, primary_image, images, view_count, dealer:hazaral_dealers(company_name, is_verified)")
        .eq("status", "active")
        .eq("is_featured", true)
        .order("featured_until", { ascending: false })
        .limit(6),
      supabaseAdmin
        .from("hazaral_listings")
        .select("id, slug, title, brand, model, year, km, fuel_type, city, damage_grade, damage_type, asking_price, is_featured, primary_image, images, view_count, dealer:hazaral_dealers(company_name, is_verified)")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    const cityCount = new Set((cityRows || []).map((r: { city: string }) => r.city)).size;

    // Fill featured up to 6 with recent if not enough
    let featured = ((featuredRows || []) as unknown) as CardListing[];
    if (featured.length < 6) {
      const featuredIds = featured.map((l) => l.id);
      const fillQuery = supabaseAdmin
        .from("hazaral_listings")
        .select("id, slug, title, brand, model, year, km, fuel_type, city, damage_grade, damage_type, asking_price, is_featured, primary_image, images, view_count, dealer:hazaral_dealers(company_name, is_verified)")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(6 - featured.length);

      if (featuredIds.length > 0) {
        fillQuery.not("id", "in", `(${featuredIds.join(",")})`);
      }

      const { data: fillRows } = await fillQuery;
      featured = [...featured, ...(((fillRows || []) as unknown) as CardListing[])];
    }

    const stats: HeroStats = {
      listingCount: listingCount ?? 0,
      dealerCount: dealerCount ?? 0,
      cityCount,
    };

    return {
      stats,
      featuredListings: featured.slice(0, 6),
      recentListings: ((recentRows || []) as unknown) as CardListing[],
    };
  } catch {
    return {
      stats: { listingCount: 0, dealerCount: 0, cityCount: 0 },
      featuredListings: [] as CardListing[],
      recentListings: [] as CardListing[],
    };
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const [faqT, { stats, featuredListings, recentListings }] = await Promise.all([
    getTranslations({ locale, namespace: "faq" }),
    fetchHomeData(),
  ]);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Otograde",
    description: locale === "en"
      ? "Turkey's damaged vehicle marketplace. Buy and sell accident-damaged, written-off, scrap vehicles with transparent A-E grade system and verified dealers."
      : "Otograde, Türkiye'nin hasarlı araç pazaryeri. Kazalı, pert, hurda araçlar için A'dan E'ye grade sistemiyle şeffaf değerleme platformu.",
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: OG_IMAGE_URL, width: 1200, height: 630 },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE_NUMBER,
      contactType: "customer service",
      availableLanguage: ["Turkish", "English"],
      areaServed: "TR",
    },
    sameAs: [],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Otograde",
    url: SITE_URL,
    description: locale === "en"
      ? "Turkey's damaged vehicle marketplace"
      : "Türkiye'nin hasarlı araç pazaryeri",
    inLanguage: locale === "en" ? "en-US" : "tr-TR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/ara?brand={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
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
        {/* Hero — white background, marketplace search */}
        <MarketplaceHero stats={stats} />

        {/* Featured listings from DB */}
        <FeaturedListings listings={featuredListings} />

        {/* How it works — two-column buyer/seller */}
        <MarketplaceHowItWorks />

        {/* Grade explainer */}
        <GradeExplainer />

        {/* Direct buying — red CTA band (secondary action) */}
        <DirectBuyingCTA />

        {/* Recent listings from DB */}
        <RecentListings listings={recentListings} />

        {/* SEO sections — kept below fold */}
        <VehicleTypeCards />
        <TrustBar />
        <SocialProof />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <MobileStickyCTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

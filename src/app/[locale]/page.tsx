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
import { ServiceCategories } from "@/components/sections/ServiceCategories";
import { CityHub } from "@/components/sections/CityHub";
import { HomeFAQ } from "@/components/sections/HomeFAQ";
import { FinalCTABand } from "@/components/sections/FinalCTABand";
import { GroupSiteBacklink } from "@/components/seo/GroupSiteBacklink";
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
    twitter: { card: "summary_large_image", title, description },
  };
}

// ── Data fetching ──────────────────────────────────────────────────────────────

const LISTING_FIELDS =
  "id, slug, title, brand, model, year, km, fuel_type, city, damage_grade, damage_type, asking_price, is_featured, primary_image, images, view_count, created_at, dealer:hazaral_dealers(company_name, is_verified)";

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
        .select(LISTING_FIELDS)
        .eq("status", "active")
        .eq("is_featured", true)
        .order("featured_until", { ascending: false })
        .limit(6),
      supabaseAdmin
        .from("hazaral_listings")
        .select(LISTING_FIELDS)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    const cityCount = new Set((cityRows || []).map((r: { city: string }) => r.city)).size;

    // Only genuinely featured listings — no backfill, so the section hides
    // itself instead of duplicating the "recent" grid when inventory is small.
    const featured = ((featuredRows || []) as unknown) as CardListing[];

    return {
      stats: { listingCount: listingCount ?? 0, dealerCount: dealerCount ?? 0, cityCount } as HeroStats,
      featuredListings: featured.slice(0, 6),
      recentListings: ((recentRows || []) as unknown) as CardListing[],
    };
  } catch {
    return {
      stats: { listingCount: 0, dealerCount: 0, cityCount: 0 } as HeroStats,
      featuredListings: [] as CardListing[],
      recentListings: [] as CardListing[],
    };
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const [{ stats, featuredListings, recentListings }] = await Promise.all([
    fetchHomeData(),
  ]);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Otograde",
    description:
      locale === "en"
        ? "Turkey's damaged vehicle marketplace. Transparent A-E grade system, verified dealers."
        : "Otograde, Türkiye'nin hasarlı araç pazaryeri. A'dan E'ye grade sistemiyle şeffaf değerleme.",
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: OG_IMAGE_URL, width: 1200, height: 630 },
    sameAs: ["https://hasarliaracalan.com/"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE_NUMBER,
      contactType: "customer service",
      availableLanguage: ["Turkish", "English"],
      areaServed: "TR",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Otograde",
    url: SITE_URL,
    inLanguage: locale === "en" ? "en-US" : "tr-TR",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/ara?brand={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Navbar />
      <main className="pb-[60px] md:pb-0">
        {/* 1 — Hero + stats bar */}
        <MarketplaceHero stats={stats} />
        <GroupSiteBacklink variant="home" locale={locale} />

        {/* 2 — Featured listings */}
        <FeaturedListings listings={featuredListings} />

        {/* 3 — How it works (with Alıcılar/Bayiler tabs) */}
        <MarketplaceHowItWorks />

        {/* 4 — Grade system explainer */}
        <GradeExplainer />

        {/* 5 — Dark CTA with quick offer form */}
        <DirectBuyingCTA />

        {/* 6 — Recently listed */}
        <RecentListings listings={recentListings} />

        {/* 7 — Service categories */}
        <ServiceCategories />

        {/* 8 — City hub (server component, fetches DB) */}
        <CityHub />

        {/* 9 — FAQ */}
        <HomeFAQ />

        {/* 10 — Final CTA band */}
        <FinalCTABand />
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <MobileStickyCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
    </>
  );
}

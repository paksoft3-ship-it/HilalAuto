import type { Metadata } from "next";
import { Suspense } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import { Listing, LISTINGS_PER_PAGE } from "@/types/marketplace";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { ListingsClient } from "./ListingsClient";
import { getDamageMatchValues, parseDamageFilters, type ParsedDamageFilter } from "@/lib/listing-filters";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { getTranslations } from "next-intl/server";
import { DAMAGE_FILTER_OPTIONS } from "@/lib/listing-filters";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function readParam(sp: Record<string, string | string[] | undefined>, key: string): string {
  const v = sp[key];
  return typeof v === "string" ? v : Array.isArray(v) ? (v[0] ?? "") : "";
}

const LISTING_SELECT = "*, dealer:hazaral_dealers(id, company_name, city, is_verified, logo_url, slug)";
const DAMAGE_SLUGS = new Set(DAMAGE_FILTER_OPTIONS.map((option) => option.slug));
type TranslationFn = (key: string, values?: Record<string, string | number>) => string;

function parseIntParam(value: string): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function translatedDamageTitle(filters: ParsedDamageFilter[], t: TranslationFn): string {
  if (filters.length === 0) return "";
  if (filters.length === 1) {
    return DAMAGE_SLUGS.has(filters[0].slug) ? t(`damage.${filters[0].slug}.title`) : filters[0].title;
  }
  return t("multipleDamageTitle", { types: translatedDamageLabel(filters, t) });
}

function translatedDamageLabel(filters: ParsedDamageFilter[], t: TranslationFn): string {
  if (filters.length === 0) return "";
  if (filters.length === 1) {
    return DAMAGE_SLUGS.has(filters[0].slug) ? t(`damage.${filters[0].slug}.label`) : filters[0].label;
  }
  return filters.map((filter) => (
    DAMAGE_SLUGS.has(filter.slug) ? t(`damage.${filter.slug}.label`) : filter.label
  )).join(", ");
}

function buildTitle(brand: string, city: string, damageFilters: ParsedDamageFilter[], grade: string, t: TranslationFn): string {
  const damage = translatedDamageLabel(damageFilters, t);
  const title = translatedDamageTitle(damageFilters, t);
  if (brand && city) return t("metaBrandCityTitle", { brand, city, siteName: SITE_NAME });
  if (brand && damage) return t("metaBrandDamageTitle", { brand, damage, siteName: SITE_NAME });
  if (brand) return t("metaBrandTitle", { brand, siteName: SITE_NAME });
  if (city && damage) return t("metaCityDamageTitle", { city, damage, siteName: SITE_NAME });
  if (city) return t("metaCityTitle", { city, siteName: SITE_NAME });
  if (title) return t("metaDamageTitle", { title, siteName: SITE_NAME });
  if (grade) return t("metaGradeTitle", { grade: grade.toUpperCase(), siteName: SITE_NAME });
  return t("metaDefaultTitle", { siteName: SITE_NAME });
}

function buildDescription(brand: string, city: string, damageFilters: ParsedDamageFilter[], t: TranslationFn): string {
  const damage = translatedDamageLabel(damageFilters, t);
  if (brand && city) {
    return t("metaBrandCityDescription", { city, brand });
  }
  if (brand) {
    return t("metaBrandDescription", { brand });
  }
  if (city) {
    return t("metaCityDescription", { city });
  }
  if (damageFilters.length === 1) {
    return DAMAGE_SLUGS.has(damageFilters[0].slug)
      ? t(`damage.${damageFilters[0].slug}.description`)
      : damageFilters[0].description;
  }
  if (damage) {
    return t("metaDamageDescription", { damage });
  }
  return t("metaDefaultDescription");
}

// ── generateMetadata ──────────────────────────────────────────────────────────

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: "listingsPage" });

  const brand     = readParam(sp, "brand");
  const city      = readParam(sp, "city");
  const damageType = readParam(sp, "damage_type");
  const damageFilters = parseDamageFilters(damageType);
  const grade     = readParam(sp, "grade");
  const fuelType = readParam(sp, "fuel_type");
  const transmission = readParam(sp, "transmission");
  const priceMin = readParam(sp, "price_min");
  const priceMax = readParam(sp, "price_max");
  const yearMin = readParam(sp, "year_min");
  const yearMax = readParam(sp, "year_max");
  const sort = readParam(sp, "sort");
  const page = readParam(sp, "page");

  const hasFilter = !!(brand || city || damageType || grade || fuelType || transmission || priceMin || priceMax || yearMin || yearMax || sort || page);
  const isIndexableDamagePage =
    damageFilters.length === 1 &&
    !brand &&
    !city &&
    !grade &&
    !fuelType &&
    !transmission &&
    !priceMin &&
    !priceMax &&
    !yearMin &&
    !yearMax &&
    (!sort || sort === "newest") &&
    (!page || page === "1");

  const title       = buildTitle(brand, city, damageFilters, grade, t);
  const description = buildDescription(brand, city, damageFilters, t);

  const listingPath = `${SITE_URL}${locale === "tr" ? "/ara" : "/en/listings"}`;
  const canonical = isIndexableDamagePage
    ? `${listingPath}?damage_type=${damageFilters[0].slug}`
    : listingPath;

  return {
    title: { absolute: title },
    description,
    robots: hasFilter && !isIndexableDamagePage
      ? { index: false, follow: true }
      : { index: true, follow: true },
    alternates: {
      canonical,
      languages: {
        tr: isIndexableDamagePage ? `${SITE_URL}/ara?damage_type=${damageFilters[0].slug}` : `${SITE_URL}/ara`,
        en: isIndexableDamagePage ? `${SITE_URL}/en/listings?damage_type=${damageFilters[0].slug}` : `${SITE_URL}/en/listings`,
        "x-default": isIndexableDamagePage ? `${SITE_URL}/ara?damage_type=${damageFilters[0].slug}` : `${SITE_URL}/ara`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: locale === "en" ? "en_US" : "tr_TR",
      type: "website",
    },
  };
}

// ── Data fetchers ─────────────────────────────────────────────────────────────

async function fetchInitialListings(sp: Record<string, string | string[] | undefined>): Promise<{ listings: Listing[]; total: number }> {
  try {
    const brand = readParam(sp, "brand");
    const city = readParam(sp, "city");
    const grade = readParam(sp, "grade");
    const damageType = readParam(sp, "damage_type");
    const fuelType = readParam(sp, "fuel_type");
    const transmission = readParam(sp, "transmission");
    const priceMin = parseIntParam(readParam(sp, "price_min"));
    const priceMax = parseIntParam(readParam(sp, "price_max"));
    const yearMin = parseIntParam(readParam(sp, "year_min"));
    const yearMax = parseIntParam(readParam(sp, "year_max"));
    const sort = readParam(sp, "sort") || "newest";
    const page = Math.max(parseIntParam(readParam(sp, "page")) ?? 1, 1);
    const damageMatchValues = getDamageMatchValues(damageType);

    let query = supabaseAdmin
      .from("hazaral_listings")
      .select(LISTING_SELECT, { count: "exact" })
      .eq("status", "active");

    if (brand) query = query.eq("brand", brand);
    if (city) query = query.eq("city", city);
    if (fuelType) query = query.eq("fuel_type", fuelType);
    if (transmission) query = query.eq("transmission", transmission);
    if (priceMin !== null) query = query.gte("asking_price", priceMin);
    if (priceMax !== null) query = query.lte("asking_price", priceMax);
    if (yearMin !== null) query = query.gte("year", yearMin);
    if (yearMax !== null) query = query.lte("year", yearMax);
    if (grade) query = query.in("damage_grade", grade.split(",").filter(Boolean));
    if (damageMatchValues.length > 0) query = query.overlaps("damage_type", damageMatchValues);

    switch (sort) {
      case "price_asc":
        query = query.order("asking_price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("asking_price", { ascending: false });
        break;
      case "views_desc":
        query = query.order("view_count", { ascending: false });
        break;
      default:
        query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false });
    }

    const from = (page - 1) * LISTINGS_PER_PAGE;
    const { data, count } = await query.range(from, from + LISTINGS_PER_PAGE - 1);
    const listings = (data as Listing[]) || [];

    return { listings, total: count ?? listings.length };
  } catch {
    return { listings: [], total: 0 };
  }
}

async function fetchDistinctBrands(): Promise<string[]> {
  try {
    const { data } = await supabaseAdmin
      .from("hazaral_listings")
      .select("brand")
      .eq("status", "active");

    const seen = new Set<string>();
    const brands: string[] = [];
    for (const r of data || []) {
      const b = (r as { brand: string }).brand;
      if (!seen.has(b)) { seen.add(b); brands.push(b); }
    }
    brands.sort();
    return brands;
  } catch {
    return [];
  }
}

// ── ItemList JSON-LD ──────────────────────────────────────────────────────────

function buildItemListSchema(listings: Listing[], locale: string, t: TranslationFn) {
  const listingIndex = `${SITE_URL}${locale === "en" ? "/en/listings" : "/ara"}`;
  const listingBase = `${SITE_URL}${locale === "en" ? "/en/listings" : "/ara"}`;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": t("schemaName"),
    "description": t("schemaDescription"),
    "url": listingIndex,
    "numberOfItems": listings.length,
    "itemListElement": listings.slice(0, 10).map((l, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `${listingBase}/${l.slug}`,
      "name": l.title,
      ...(l.primary_image || l.images?.[0]
        ? { "image": l.primary_image || l.images[0] }
        : {}),
    })),
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AraPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: "listingsPage" });

  const [{ listings: initialListings, total: initialTotal }, dbBrands] = await Promise.all([
    fetchInitialListings(sp),
    fetchDistinctBrands(),
  ]);

  const itemListSchema = buildItemListSchema(initialListings, locale, t);

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <main className="pb-[76px] md:pb-0">
        <Suspense fallback={null}>
          <ListingsClient
            initialListings={initialListings}
            initialTotal={initialTotal}
            availableBrands={dbBrands}
          />
        </Suspense>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <MobileStickyCTA />
    </>
  );
}

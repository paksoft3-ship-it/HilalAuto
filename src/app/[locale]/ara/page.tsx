import type { Metadata } from "next";
import { Suspense } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import { Listing, LISTINGS_PER_PAGE } from "@/types/marketplace";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { ListingsClient } from "./ListingsClient";
import { findDamageFilterOption, getDamageMatchValues, parseDamageFilters, type ParsedDamageFilter } from "@/lib/listing-filters";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { getTranslations } from "next-intl/server";
import { DAMAGE_FILTER_OPTIONS } from "@/lib/listing-filters";
import {
  EMPTY_MARKETPLACE_FILTER_OPTIONS,
  type FilterCountOption,
  type MarketplaceFilterOptions,
} from "@/lib/marketplace-filter-options";

// Search results must always reflect the live inventory — never serve a
// build-time snapshot from the full route cache.
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function readParam(sp: Record<string, string | string[] | undefined>, key: string): string {
  const v = sp[key];
  return typeof v === "string" ? v : Array.isArray(v) ? (v[0] ?? "") : "";
}

const DEALER_SELECT = "id, company_name, city, is_verified, logo_url, slug";
const LISTING_SELECT = `*, dealer:hazaral_dealers(${DEALER_SELECT})`;
const LISTING_SELECT_VERIFIED_DEALER = `*, dealer:hazaral_dealers!inner(${DEALER_SELECT})`;
const DAMAGE_SLUGS = new Set(DAMAGE_FILTER_OPTIONS.map((option) => option.slug));
type TranslationFn = (key: string, values?: Record<string, string | number>) => string;

function parseIntParam(value: string): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function isEnabledParam(value: string): boolean {
  return value === "1" || value === "true";
}

function countValue(map: Map<string, number>, value: string | null | undefined) {
  const key = value?.trim();
  if (!key) return;
  map.set(key, (map.get(key) ?? 0) + 1);
}

function mapToOptions(map: Map<string, number>): FilterCountOption[] {
  return Array.from(map.entries())
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((a, b) => a.label.localeCompare(b.label, "tr"));
}

function pushNumberRange(current: { min: number | null; max: number | null }, value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) return;
  current.min = current.min === null ? value : Math.min(current.min, value);
  current.max = current.max === null ? value : Math.max(current.max, value);
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
  const model = readParam(sp, "model");
  const city      = readParam(sp, "city");
  const district = readParam(sp, "district");
  const damageType = readParam(sp, "damage_type");
  const damageFilters = parseDamageFilters(damageType);
  const grade     = readParam(sp, "grade");
  const fuelType = readParam(sp, "fuel_type");
  const transmission = readParam(sp, "transmission");
  const priceMin = readParam(sp, "price_min");
  const priceMax = readParam(sp, "price_max");
  const yearMin = readParam(sp, "year_min");
  const yearMax = readParam(sp, "year_max");
  const kmMin = readParam(sp, "km_min");
  const kmMax = readParam(sp, "km_max");
  const hasTramer = readParam(sp, "has_tramer");
  const negotiable = readParam(sp, "negotiable");
  const verifiedDealer = readParam(sp, "verified_dealer");
  const featured = readParam(sp, "featured");
  const hasPhotos = readParam(sp, "has_photos");
  const hasDamageNote = readParam(sp, "has_damage_note");
  const sort = readParam(sp, "sort");
  const page = readParam(sp, "page");

  const hasFilter = !!(
    brand || model || city || district || damageType || grade || fuelType || transmission ||
    priceMin || priceMax || yearMin || yearMax || kmMin || kmMax || hasTramer ||
    negotiable || verifiedDealer || featured || hasPhotos || hasDamageNote || sort || page
  );
  const isIndexableDamagePage =
    damageFilters.length === 1 &&
    !brand &&
    !model &&
    !city &&
    !district &&
    !grade &&
    !fuelType &&
    !transmission &&
    !priceMin &&
    !priceMax &&
    !yearMin &&
    !yearMax &&
    !kmMin &&
    !kmMax &&
    !hasTramer &&
    !negotiable &&
    !verifiedDealer &&
    !featured &&
    !hasPhotos &&
    !hasDamageNote &&
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
    const model = readParam(sp, "model");
    const city = readParam(sp, "city");
    const district = readParam(sp, "district");
    const grade = readParam(sp, "grade");
    const damageType = readParam(sp, "damage_type");
    const fuelType = readParam(sp, "fuel_type");
    const transmission = readParam(sp, "transmission");
    const priceMin = parseIntParam(readParam(sp, "price_min"));
    const priceMax = parseIntParam(readParam(sp, "price_max"));
    const yearMin = parseIntParam(readParam(sp, "year_min"));
    const yearMax = parseIntParam(readParam(sp, "year_max"));
    const kmMin = parseIntParam(readParam(sp, "km_min"));
    const kmMax = parseIntParam(readParam(sp, "km_max"));
    const hasTramer = readParam(sp, "has_tramer");
    const negotiable = isEnabledParam(readParam(sp, "negotiable"));
    const verifiedDealer = isEnabledParam(readParam(sp, "verified_dealer"));
    const featured = isEnabledParam(readParam(sp, "featured"));
    const hasPhotos = isEnabledParam(readParam(sp, "has_photos"));
    const hasDamageNote = isEnabledParam(readParam(sp, "has_damage_note"));
    const sort = readParam(sp, "sort") || "newest";
    const page = Math.max(parseIntParam(readParam(sp, "page")) ?? 1, 1);
    const damageMatchValues = getDamageMatchValues(damageType);

    let query = supabaseAdmin
      .from("hazaral_listings")
      .select(verifiedDealer ? LISTING_SELECT_VERIFIED_DEALER : LISTING_SELECT, { count: "exact" })
      .eq("status", "active");

    if (brand) query = query.eq("brand", brand);
    if (model) query = query.eq("model", model);
    if (city) query = query.eq("city", city);
    if (district) query = query.eq("district", district);
    if (fuelType) query = query.eq("fuel_type", fuelType);
    if (transmission) query = query.eq("transmission", transmission);
    if (priceMin !== null) query = query.gte("asking_price", priceMin);
    if (priceMax !== null) query = query.lte("asking_price", priceMax);
    if (yearMin !== null) query = query.gte("year", yearMin);
    if (yearMax !== null) query = query.lte("year", yearMax);
    if (kmMin !== null) query = query.gte("km", kmMin);
    if (kmMax !== null) query = query.lte("km", kmMax);
    if (grade) query = query.in("damage_grade", grade.split(",").filter(Boolean));
    if (damageMatchValues.length > 0) query = query.overlaps("damage_type", damageMatchValues);
    if (hasTramer === "yes") query = query.eq("has_tramer", true);
    if (hasTramer === "no") query = query.eq("has_tramer", false);
    if (negotiable) query = query.eq("is_price_negotiable", true);
    if (featured) query = query.eq("is_featured", true);
    if (hasPhotos) query = query.not("primary_image", "is", null);
    if (hasDamageNote) query = query.not("damage_description", "is", null);
    if (verifiedDealer) query = query.eq("dealer.is_verified", true);

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
      case "km_asc":
        query = query.order("km", { ascending: true }).order("created_at", { ascending: false });
        break;
      case "year_desc":
        query = query.order("year", { ascending: false }).order("created_at", { ascending: false });
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

type FilterSourceRow = {
  brand: string | null;
  model: string | null;
  city: string | null;
  district: string | null;
  damage_type: string[] | null;
  damage_grade: string | null;
  fuel_type: string | null;
  transmission: string | null;
  has_tramer: boolean | null;
  is_price_negotiable: boolean | null;
  is_featured: boolean | null;
  images: string[] | null;
  primary_image: string | null;
  damage_description: string | null;
  asking_price: number | null;
  year: number | null;
  km: number | null;
  dealer?: { is_verified: boolean | null } | Array<{ is_verified: boolean | null }> | null;
};

async function fetchFilterOptions(): Promise<MarketplaceFilterOptions> {
  try {
    const { data } = await supabaseAdmin
      .from("hazaral_listings")
      .select(`
        brand,
        model,
        city,
        district,
        damage_type,
        damage_grade,
        fuel_type,
        transmission,
        has_tramer,
        is_price_negotiable,
        is_featured,
        images,
        primary_image,
        damage_description,
        asking_price,
        year,
        km,
        dealer:hazaral_dealers(is_verified)
      `)
      .eq("status", "active");

    const rows = (data || []) as unknown as FilterSourceRow[];
    const brandCounts = new Map<string, number>();
    const cityCounts = new Map<string, number>();
    const damageCounts = new Map<string, number>();
    const gradeCounts = new Map<string, number>();
    const fuelCounts = new Map<string, number>();
    const transmissionCounts = new Map<string, number>();
    const modelCountsByBrand = new Map<string, Map<string, number>>();
    const districtCountsByCity = new Map<string, Map<string, number>>();
    const priceRange = { min: null as number | null, max: null as number | null };
    const yearRange = { min: null as number | null, max: null as number | null };
    const kmRange = { min: null as number | null, max: null as number | null };

    let tramerYes = 0;
    let tramerNo = 0;
    let negotiable = 0;
    let verifiedDealers = 0;
    let featured = 0;
    let photos = 0;
    let damageNotes = 0;

    for (const row of rows) {
      const brand = row.brand?.trim();
      const model = row.model?.trim();
      const city = row.city?.trim();
      const district = row.district?.trim();

      countValue(brandCounts, brand);
      countValue(cityCounts, city);
      countValue(gradeCounts, row.damage_grade);
      countValue(fuelCounts, row.fuel_type);
      countValue(transmissionCounts, row.transmission);

      if (brand && model) {
        const modelCounts = modelCountsByBrand.get(brand) ?? new Map<string, number>();
        countValue(modelCounts, model);
        modelCountsByBrand.set(brand, modelCounts);
      }

      if (city && district) {
        const districtCounts = districtCountsByCity.get(city) ?? new Map<string, number>();
        countValue(districtCounts, district);
        districtCountsByCity.set(city, districtCounts);
      }

      for (const rawDamage of row.damage_type || []) {
        const option = findDamageFilterOption(rawDamage);
        countValue(damageCounts, option?.slug ?? rawDamage);
      }

      if (row.has_tramer) tramerYes += 1;
      else tramerNo += 1;
      if (row.is_price_negotiable) negotiable += 1;
      if (row.is_featured) featured += 1;
      const dealer = Array.isArray(row.dealer) ? row.dealer[0] : row.dealer;
      if (dealer?.is_verified) verifiedDealers += 1;
      if (row.primary_image || (row.images?.length ?? 0) > 0) photos += 1;
      if (row.damage_description?.trim()) damageNotes += 1;

      pushNumberRange(priceRange, row.asking_price);
      pushNumberRange(yearRange, row.year);
      pushNumberRange(kmRange, row.km);
    }

    const modelsByBrand: Record<string, FilterCountOption[]> = {};
    for (const [brand, counts] of Array.from(modelCountsByBrand.entries())) {
      modelsByBrand[brand] = mapToOptions(counts);
    }

    const districtsByCity: Record<string, FilterCountOption[]> = {};
    for (const [city, counts] of Array.from(districtCountsByCity.entries())) {
      districtsByCity[city] = mapToOptions(counts);
    }

    return {
      brands: mapToOptions(brandCounts),
      modelsByBrand,
      cities: mapToOptions(cityCounts),
      districtsByCity,
      damageCounts: Object.fromEntries(damageCounts.entries()),
      gradeCounts: Object.fromEntries(gradeCounts.entries()),
      fuelCounts: Object.fromEntries(fuelCounts.entries()),
      transmissionCounts: Object.fromEntries(transmissionCounts.entries()),
      tramerYes,
      tramerNo,
      negotiable,
      verifiedDealers,
      featured,
      photos,
      damageNotes,
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      yearMin: yearRange.min,
      yearMax: yearRange.max,
      kmMin: kmRange.min,
      kmMax: kmRange.max,
    };
  } catch {
    return EMPTY_MARKETPLACE_FILTER_OPTIONS;
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

  const [{ listings: initialListings, total: initialTotal }, filterOptions] = await Promise.all([
    fetchInitialListings(sp),
    fetchFilterOptions(),
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
            filterOptions={filterOptions}
          />
        </Suspense>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <MobileStickyCTA />
    </>
  );
}

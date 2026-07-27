"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useTransition, useMemo } from "react";
import type { ReactNode } from "react";
import { useRouter, usePathname, Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { GradeBadge } from "@/components/marketplace/GradeBadge";
import { Listing, DamageGrade, LISTINGS_PER_PAGE } from "@/types/marketplace";
import { supabase } from "@/lib/supabase";
import { CITIES, CAR_BRANDS } from "@/lib/constants";
import {
  BadgeCheck,
  BookmarkPlus,
  Camera,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Fuel,
  Gauge,
  GitCompareArrows,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DAMAGE_FILTER_OPTIONS, parseDamageFilters } from "@/lib/listing-filters";
import type { FilterCountOption, MarketplaceFilterOptions } from "@/lib/marketplace-filter-options";

interface ListingsClientProps {
  initialListings: Listing[];
  initialTotal: number;
  filterOptions: MarketplaceFilterOptions;
}

type SortValue = "newest" | "price_asc" | "price_desc" | "views_desc" | "km_asc" | "year_desc";
type SavedSearch = {
  id: string;
  href: string;
  title: string;
  total: number;
  createdAt: string;
};
type CompareItem = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  km: number | null;
  city: string;
  asking_price: number;
  damage_grade: DamageGrade | null;
  damage_type: string[];
  primary_image: string | null;
};
type RecentListing = Pick<CompareItem, "id" | "slug" | "title" | "asking_price" | "city" | "primary_image"> & {
  viewedAt: string;
};

const GRADES: DamageGrade[] = ["A", "B", "C", "D", "E"];
const FUEL_TYPES = ["benzin", "dizel", "lpg", "elektrik", "hibrit"] as const;
const TRANSMISSIONS = ["manuel", "otomatik"] as const;
const DAMAGE_SLUGS = new Set(DAMAGE_FILTER_OPTIONS.map((option) => option.slug));
const COMPARE_STORAGE_KEY = "og_compare_listings";
const SAVED_SEARCH_STORAGE_KEY = "og_saved_searches";
const RECENT_STORAGE_KEY = "og_recently_viewed";
const DEALER_SELECT = "id, company_name, city, is_verified, logo_url, slug";

function formatPrice(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

function formatKm(km: number | null) {
  return typeof km === "number" ? new Intl.NumberFormat("tr-TR").format(km) + " km" : "-";
}

function parseStoredArray<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function storeArray<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function toCompareItem(listing: Listing): CompareItem {
  return {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    brand: listing.brand,
    model: listing.model,
    year: listing.year,
    km: listing.km,
    city: listing.city,
    asking_price: listing.asking_price,
    damage_grade: listing.damage_grade,
    damage_type: listing.damage_type,
    primary_image: listing.primary_image || listing.images?.[0] || null,
  };
}

function optionLabel(option: FilterCountOption): string {
  return option.count > 0 ? `${option.label} (${option.count})` : option.label;
}

function fallbackOptions(values: readonly string[]): FilterCountOption[] {
  return values.map((value) => ({ value, label: value, count: 0 }));
}

export function ListingsClient({ initialListings, initialTotal, filterOptions }: ListingsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("listingsPage");
  const [, startTransition] = useTransition();

  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [recentListings, setRecentListings] = useState<RecentListing[]>([]);

  const getParam = (key: string) => searchParams.get(key) || "";
  const brand = getParam("brand");
  const model = getParam("model");
  const city = getParam("city");
  const district = getParam("district");
  const grade = getParam("grade");
  const damageType = getParam("damage_type");
  const fuelType = getParam("fuel_type");
  const transmission = getParam("transmission");
  const priceMin = getParam("price_min");
  const priceMax = getParam("price_max");
  const yearMin = getParam("year_min");
  const yearMax = getParam("year_max");
  const kmMin = getParam("km_min");
  const kmMax = getParam("km_max");
  const hasTramer = getParam("has_tramer");
  const negotiable = getParam("negotiable");
  const verifiedDealer = getParam("verified_dealer");
  const featured = getParam("featured");
  const hasPhotos = getParam("has_photos");
  const hasDamageNote = getParam("has_damage_note");
  const sort = (getParam("sort") || "newest") as SortValue;
  const page = Math.max(parseInt(getParam("page") || "1", 10), 1);

  const damageFilters = useMemo(() => parseDamageFilters(damageType), [damageType]);
  const damageSlugArr = useMemo(() => damageFilters.map((filter) => filter.slug), [damageFilters]);
  const damageMatchValues = useMemo(
    () => Array.from(new Set(damageFilters.flatMap((filter) => filter.matchValues))),
    [damageFilters]
  );
  const gradeArr = useMemo(() => grade ? grade.split(",").filter(Boolean) as DamageGrade[] : [], [grade]);

  const damageLabel = useCallback((slug: string, fallback?: string) => (
    DAMAGE_SLUGS.has(slug) ? t(`damage.${slug}.label`) : fallback ?? slug
  ), [t]);
  const damageTitle = useCallback((slug: string, fallback: string) => (
    DAMAGE_SLUGS.has(slug) ? t(`damage.${slug}.title`) : fallback
  ), [t]);
  const damageDescription = useCallback((slug: string, fallback: string) => (
    DAMAGE_SLUGS.has(slug) ? t(`damage.${slug}.description`) : fallback
  ), [t]);
  const fuelLabel = useCallback((value: string) => (
    FUEL_TYPES.includes(value as typeof FUEL_TYPES[number]) ? t(`fuel.${value}`) : value
  ), [t]);
  const transmissionLabel = useCallback((value: string) => (
    TRANSMISSIONS.includes(value as typeof TRANSMISSIONS[number]) ? t(`transmissionTypes.${value}`) : value
  ), [t]);

  const text = useMemo(() => ({
    baseTitle: t("baseTitle"),
    baseDescription: t("baseDescription"),
    multipleDamageDescription: t("multipleDamageDescription"),
    brandPlaceholder: t("brandPlaceholder"),
    cityPlaceholder: t("cityPlaceholder"),
    filters: t("filters"),
    clear: t("clear"),
    make: t("make"),
    allMakes: t("allMakes"),
    model: t("model"),
    allModels: t("allModels"),
    chooseMakeFirst: t("chooseMakeFirst"),
    city: t("city"),
    allCities: t("allCities"),
    district: t("district"),
    allDistricts: t("allDistricts"),
    chooseCityFirst: t("chooseCityFirst"),
    grade: t("grade"),
    damageType: t("damageType"),
    priceRange: t("priceRange"),
    yearRange: t("yearRange"),
    kmRange: t("kmRange"),
    fuelType: t("fuelType"),
    transmission: t("transmission"),
    loading: t("loading"),
    vehicleFound: (count: number) => t("vehicleFound", { count }),
    vehicleCount: (count: number) => t("vehicleCount", { count }),
    showResults: (count: number) => t("showResults", { count }),
    filterButton: t("filterButton"),
    emptyTitle: t("emptyTitle"),
    emptyDescription: t("emptyDescription"),
    clearFilters: t("clearFilters"),
    min: t("min"),
    max: t("max"),
    minPriceChip: (price: string) => t("minPriceChip", { price }),
    maxPriceChip: (price: string) => t("maxPriceChip", { price }),
    newest: t("newest"),
    priceAsc: t("priceAsc"),
    priceDesc: t("priceDesc"),
    viewsDesc: t("viewsDesc"),
    kmAsc: t("kmAsc"),
    yearDesc: t("yearDesc"),
    popularDamageTypes: t("popularDamageTypes"),
    vehicleGroup: t("vehicleGroup"),
    damageGroup: t("damageGroup"),
    priceGroup: t("priceGroup"),
    locationGroup: t("locationGroup"),
    sellerGroup: t("sellerGroup"),
    tramerStatus: t("tramerStatus"),
    allTramer: t("allTramer"),
    tramerOnly: t("tramerOnly"),
    noTramer: t("noTramer"),
    negotiableOnly: t("negotiableOnly"),
    verifiedDealerOnly: t("verifiedDealerOnly"),
    featuredOnly: t("featuredOnly"),
    withPhotosOnly: t("withPhotosOnly"),
    withDamageNoteOnly: t("withDamageNoteOnly"),
    pricePresets: t("pricePresets"),
    priceUnder250: t("priceUnder250"),
    price250500: t("price250500"),
    price5001000: t("price5001000"),
    priceOver1000: t("priceOver1000"),
    saveSearch: t("saveSearch"),
    savedSearch: t("savedSearch"),
    savedSearches: t("savedSearches"),
    noSavedSearches: t("noSavedSearches"),
    compare: t("compare"),
    inCompare: t("inCompare"),
    compareSelected: (count: number) => t("compareSelected", { count }),
    compareTitle: t("compareTitle"),
    compareHint: t("compareHint"),
    clearCompare: t("clearCompare"),
    openCompare: t("openCompare"),
    recentViewed: t("recentViewed"),
    noRecentViewed: t("noRecentViewed"),
    remove: t("remove"),
    photos: t("photos"),
    yes: t("yes"),
    no: t("no"),
    multipleDamageTitle: (types: string) => t("multipleDamageTitle", { types }),
    gradeChip: (g: string) => t("gradeChip", { grade: g }),
  }), [t]);

  const sortOptions = useMemo(() => [
    { value: "newest", label: text.newest },
    { value: "price_asc", label: text.priceAsc },
    { value: "price_desc", label: text.priceDesc },
    { value: "year_desc", label: text.yearDesc },
    { value: "km_asc", label: text.kmAsc },
    { value: "views_desc", label: text.viewsDesc },
  ] as const, [text]);

  const brandOptions = useMemo(
    () => filterOptions.brands.length > 0 ? filterOptions.brands : fallbackOptions(CAR_BRANDS),
    [filterOptions.brands]
  );
  const cityOptions = useMemo(
    () => filterOptions.cities.length > 0 ? filterOptions.cities : fallbackOptions(Object.values(CITIES)),
    [filterOptions.cities]
  );
  const modelOptions = useMemo(() => brand ? filterOptions.modelsByBrand[brand] ?? [] : [], [brand, filterOptions.modelsByBrand]);
  const districtOptions = useMemo(() => city ? filterOptions.districtsByCity[city] ?? [] : [], [city, filterOptions.districtsByCity]);

  const heroCopy = useMemo(() => {
    if (damageFilters.length === 1) {
      return {
        title: damageTitle(damageFilters[0].slug, damageFilters[0].title),
        description: damageDescription(damageFilters[0].slug, damageFilters[0].description),
      };
    }

    if (damageFilters.length > 1) {
      const types = damageFilters.map((filter) => damageLabel(filter.slug, filter.label)).join(", ");
      return {
        title: text.multipleDamageTitle(types),
        description: text.multipleDamageDescription,
      };
    }

    return {
      title: text.baseTitle,
      description: text.baseDescription,
    };
  }, [damageDescription, damageFilters, damageLabel, damageTitle, text]);

  const activeFiltersCount =
    [
      brand,
      model,
      city,
      district,
      fuelType,
      transmission,
      priceMin,
      priceMax,
      yearMin,
      yearMax,
      kmMin,
      kmMax,
      hasTramer,
      negotiable,
      verifiedDealer,
      featured,
      hasPhotos,
      hasDamageNote,
    ].filter(Boolean).length + gradeArr.length + damageFilters.length;

  const currentHref = useMemo(() => {
    const query = searchParams.toString();
    return `${pathname as string}${query ? `?${query}` : ""}`;
  }, [pathname, searchParams]);
  const isCurrentSearchSaved = savedSearches.some((search) => search.href === currentHref);

  useEffect(() => {
    setCompareItems(parseStoredArray<CompareItem>(COMPARE_STORAGE_KEY).slice(0, 4));
    setSavedSearches(parseStoredArray<SavedSearch>(SAVED_SEARCH_STORAGE_KEY).slice(0, 6));
    setRecentListings(parseStoredArray<RecentListing>(RECENT_STORAGE_KEY).slice(0, 5));
  }, []);

  function buildParams(overrides: Record<string, string>) {
    const current = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(overrides)) {
      if (value) current.set(key, value);
      else current.delete(key);
    }
    if (overrides.page === undefined) current.set("page", "1");
    return current.toString();
  }

  function replaceWithParams(overrides: Record<string, string>) {
    const q = buildParams(overrides);
    startTransition(() => {
      router.replace((q ? `${pathname as string}?${q}` : pathname) as never);
    });
  }

  function updateFilter(key: string, value: string) {
    replaceWithParams({ [key]: value });
  }

  function updateFilters(overrides: Record<string, string>) {
    replaceWithParams(overrides);
  }

  function clearAllFilters() {
    startTransition(() => router.replace(pathname as never));
  }

  function toggleMulti(key: string, value: string, current: string) {
    const arr = current ? current.split(",").filter(Boolean) : [];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    updateFilter(key, next.join(","));
  }

  function toggleDamageType(slug: string) {
    const next = damageSlugArr.includes(slug)
      ? damageSlugArr.filter((value) => value !== slug)
      : [...damageSlugArr, slug];
    updateFilter("damage_type", next.join(","));
  }

  function selectDamageType(slug: string) {
    const next = damageSlugArr.length === 1 && damageSlugArr[0] === slug ? "" : slug;
    updateFilter("damage_type", next);
  }

  function toggleFlag(key: string, enabled: boolean) {
    updateFilter(key, enabled ? "" : "1");
  }

  function saveCurrentSearch() {
    const titleParts = [
      brand,
      model,
      city,
      district,
      ...damageFilters.map((filter) => damageLabel(filter.slug, filter.label)),
      ...gradeArr.map((g) => text.gradeChip(g)),
    ].filter(Boolean);
    const savedSearch: SavedSearch = {
      id: currentHref,
      href: currentHref,
      title: titleParts.length > 0 ? titleParts.join(" / ") : heroCopy.title,
      total,
      createdAt: new Date().toISOString(),
    };
    const next = [savedSearch, ...savedSearches.filter((search) => search.href !== currentHref)].slice(0, 6);
    setSavedSearches(next);
    storeArray(SAVED_SEARCH_STORAGE_KEY, next);
  }

  function removeSavedSearch(id: string) {
    const next = savedSearches.filter((search) => search.id !== id);
    setSavedSearches(next);
    storeArray(SAVED_SEARCH_STORAGE_KEY, next);
  }

  function toggleCompare(listing: Listing) {
    const exists = compareItems.some((item) => item.id === listing.id);
    const next = exists
      ? compareItems.filter((item) => item.id !== listing.id)
      : compareItems.length >= 4
        ? compareItems
        : [...compareItems, toCompareItem(listing)];
    setCompareItems(next);
    storeArray(COMPARE_STORAGE_KEY, next);
  }

  function removeCompareItem(id: string) {
    const next = compareItems.filter((item) => item.id !== id);
    setCompareItems(next);
    storeArray(COMPARE_STORAGE_KEY, next);
  }

  function clearCompare() {
    setCompareItems([]);
    storeArray(COMPARE_STORAGE_KEY, []);
    setCompareOpen(false);
  }

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const select = verifiedDealer
        ? `*, dealer:hazaral_dealers!inner(${DEALER_SELECT})`
        : `*, dealer:hazaral_dealers(${DEALER_SELECT})`;
      let query = supabase
        .from("hazaral_listings")
        .select(select, { count: "exact" })
        .eq("status", "active");

      if (brand) query = query.eq("brand", brand);
      if (model) query = query.eq("model", model);
      if (city) query = query.eq("city", city);
      if (district) query = query.eq("district", district);
      if (fuelType) query = query.eq("fuel_type", fuelType);
      if (transmission) query = query.eq("transmission", transmission);
      if (priceMin) query = query.gte("asking_price", parseInt(priceMin, 10));
      if (priceMax) query = query.lte("asking_price", parseInt(priceMax, 10));
      if (yearMin) query = query.gte("year", parseInt(yearMin, 10));
      if (yearMax) query = query.lte("year", parseInt(yearMax, 10));
      if (kmMin) query = query.gte("km", parseInt(kmMin, 10));
      if (kmMax) query = query.lte("km", parseInt(kmMax, 10));
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
      const result = (data as Listing[]) || [];
      setListings(result);
      setTotal(count ?? result.length);
    } catch {
      setListings([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [
    brand,
    city,
    damageMatchValues,
    district,
    featured,
    fuelType,
    grade,
    hasDamageNote,
    hasPhotos,
    hasTramer,
    kmMax,
    kmMin,
    model,
    negotiable,
    page,
    priceMax,
    priceMin,
    sort,
    transmission,
    verifiedDealer,
    yearMax,
    yearMin,
  ]);

  useEffect(() => {
    const hasFilters =
      activeFiltersCount > 0 ||
      sort !== "newest" ||
      page > 1;
    if (hasFilters) {
      fetchListings();
    }
  }, [activeFiltersCount, fetchListings, page, sort]);

  const totalPages = total > 0 ? Math.ceil(total / LISTINGS_PER_PAGE) : 1;

  const FilterPanel = () => (
    <div className="flex flex-col gap-14">
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-on-surface">{text.filters}</h2>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-[12px] text-primary flex items-center gap-4 hover:underline"
          >
            <X size={12} /> {text.clear} ({activeFiltersCount})
          </button>
        )}
      </div>

      <FilterSection title={text.vehicleGroup} icon={<Car size={14} />} defaultOpen>
        <SelectControl label={text.make} value={brand} onChange={(value) => updateFilters({ brand: value, model: "" })}>
          <option value="">{text.allMakes}</option>
          {brandOptions.map((option) => <option key={option.value} value={option.value}>{optionLabel(option)}</option>)}
        </SelectControl>

        <SelectControl
          label={text.model}
          value={model}
          disabled={!brand || modelOptions.length === 0}
          onChange={(value) => updateFilter("model", value)}
        >
          <option value="">{brand ? text.allModels : text.chooseMakeFirst}</option>
          {modelOptions.map((option) => <option key={option.value} value={option.value}>{optionLabel(option)}</option>)}
        </SelectControl>

        <RangeInputs
          label={text.yearRange}
          minValue={yearMin}
          maxValue={yearMax}
          minPlaceholder={filterOptions.yearMin ? String(filterOptions.yearMin) : "2000"}
          maxPlaceholder={filterOptions.yearMax ? String(filterOptions.yearMax) : "2026"}
          onMin={(value) => updateFilter("year_min", value)}
          onMax={(value) => updateFilter("year_max", value)}
        />

        <RangeInputs
          label={text.kmRange}
          minValue={kmMin}
          maxValue={kmMax}
          minPlaceholder={text.min}
          maxPlaceholder={filterOptions.kmMax ? String(filterOptions.kmMax) : text.max}
          onMin={(value) => updateFilter("km_min", value)}
          onMax={(value) => updateFilter("km_max", value)}
        />

        <div className="flex flex-col gap-8">
          <ControlLabel>{text.fuelType}</ControlLabel>
          <div className="grid grid-cols-1 gap-6">
            {FUEL_TYPES.map((fuel) => (
              <RadioRow
                key={fuel}
                label={fuelLabel(fuel)}
                count={filterOptions.fuelCounts[fuel] ?? 0}
                checked={fuelType === fuel}
                onChange={() => updateFilter("fuel_type", fuelType === fuel ? "" : fuel)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <ControlLabel>{text.transmission}</ControlLabel>
          <div className="grid grid-cols-2 gap-8">
            {TRANSMISSIONS.map((item) => (
              <button
                key={item}
                onClick={() => updateFilter("transmission", transmission === item ? "" : item)}
                className={cn(
                  "min-w-0 rounded-btn border py-8 text-[12px] font-medium transition-colors",
                  transmission === item
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border-default text-muted-text hover:border-primary"
                )}
              >
                {transmissionLabel(item)}
                {(filterOptions.transmissionCounts[item] ?? 0) > 0 && (
                  <span className="ml-4 text-[10px] opacity-70">{filterOptions.transmissionCounts[item]}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      <FilterSection title={text.damageGroup} icon={<ShieldCheck size={14} />} defaultOpen>
        <div className="flex flex-col gap-8">
          <ControlLabel>{text.grade}</ControlLabel>
          <div className="flex flex-wrap gap-6">
            {GRADES.map((g) => (
              <button
                key={g}
                onClick={() => toggleMulti("grade", g, grade)}
                className={cn(
                  "flex items-center gap-4 rounded-full border px-10 py-[6px] text-[12px] font-medium transition-colors",
                  gradeArr.includes(g)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border-default text-muted-text hover:border-primary"
                )}
              >
                <GradeBadge grade={g} size="sm" /> {g}
                {(filterOptions.gradeCounts[g] ?? 0) > 0 && (
                  <span className="text-[10px] opacity-70">{filterOptions.gradeCounts[g]}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <ControlLabel>{text.damageType}</ControlLabel>
          <div className="flex flex-col gap-7">
            {DAMAGE_FILTER_OPTIONS.map((option) => (
              <CheckboxRow
                key={option.slug}
                checked={damageSlugArr.includes(option.slug)}
                label={damageLabel(option.slug, option.label)}
                count={filterOptions.damageCounts[option.slug] ?? 0}
                onChange={() => toggleDamageType(option.slug)}
              />
            ))}
          </div>
        </div>

        <SelectControl label={text.tramerStatus} value={hasTramer} onChange={(value) => updateFilter("has_tramer", value)}>
          <option value="">{text.allTramer}</option>
          <option value="yes">{text.tramerOnly} ({filterOptions.tramerYes})</option>
          <option value="no">{text.noTramer} ({filterOptions.tramerNo})</option>
        </SelectControl>
      </FilterSection>

      <FilterSection title={text.priceGroup} icon={<Gauge size={14} />} defaultOpen>
        <div className="flex flex-col gap-8">
          <ControlLabel>{text.pricePresets}</ControlLabel>
          <div className="grid grid-cols-2 gap-8">
            <PresetButton active={!priceMin && priceMax === "250000"} onClick={() => updateFilters({ price_min: "", price_max: "250000" })}>{text.priceUnder250}</PresetButton>
            <PresetButton active={priceMin === "250000" && priceMax === "500000"} onClick={() => updateFilters({ price_min: "250000", price_max: "500000" })}>{text.price250500}</PresetButton>
            <PresetButton active={priceMin === "500000" && priceMax === "1000000"} onClick={() => updateFilters({ price_min: "500000", price_max: "1000000" })}>{text.price5001000}</PresetButton>
            <PresetButton active={priceMin === "1000000" && !priceMax} onClick={() => updateFilters({ price_min: "1000000", price_max: "" })}>{text.priceOver1000}</PresetButton>
          </div>
        </div>

        <RangeInputs
          label={text.priceRange}
          minValue={priceMin}
          maxValue={priceMax}
          minPlaceholder={filterOptions.priceMin ? String(filterOptions.priceMin) : text.min}
          maxPlaceholder={filterOptions.priceMax ? String(filterOptions.priceMax) : text.max}
          onMin={(value) => updateFilter("price_min", value)}
          onMax={(value) => updateFilter("price_max", value)}
        />
      </FilterSection>

      <FilterSection title={text.locationGroup} icon={<MapPin size={14} />} defaultOpen>
        <SelectControl label={text.city} value={city} onChange={(value) => updateFilters({ city: value, district: "" })}>
          <option value="">{text.allCities}</option>
          {cityOptions.map((option) => <option key={option.value} value={option.value}>{optionLabel(option)}</option>)}
        </SelectControl>

        <SelectControl
          label={text.district}
          value={district}
          disabled={!city || districtOptions.length === 0}
          onChange={(value) => updateFilter("district", value)}
        >
          <option value="">{city ? text.allDistricts : text.chooseCityFirst}</option>
          {districtOptions.map((option) => <option key={option.value} value={option.value}>{optionLabel(option)}</option>)}
        </SelectControl>
      </FilterSection>

      <FilterSection title={text.sellerGroup} icon={<BadgeCheck size={14} />} defaultOpen>
        <QualityToggle icon={<Fuel size={13} />} label={text.negotiableOnly} count={filterOptions.negotiable} active={!!negotiable} onClick={() => toggleFlag("negotiable", !!negotiable)} />
        <QualityToggle icon={<ShieldCheck size={13} />} label={text.verifiedDealerOnly} count={filterOptions.verifiedDealers} active={!!verifiedDealer} onClick={() => toggleFlag("verified_dealer", !!verifiedDealer)} />
        <QualityToggle icon={<Star size={13} />} label={text.featuredOnly} count={filterOptions.featured} active={!!featured} onClick={() => toggleFlag("featured", !!featured)} />
        <QualityToggle icon={<Camera size={13} />} label={text.withPhotosOnly} count={filterOptions.photos} active={!!hasPhotos} onClick={() => toggleFlag("has_photos", !!hasPhotos)} />
        <QualityToggle icon={<FileText size={13} />} label={text.withDamageNoteOnly} count={filterOptions.damageNotes} active={!!hasDamageNote} onClick={() => toggleFlag("has_damage_note", !!hasDamageNote)} />
      </FilterSection>

      <SavedSearchesPanel
        savedSearches={savedSearches}
        text={text}
        onOpen={(href) => startTransition(() => router.replace(href as never))}
        onRemove={removeSavedSearch}
      />
    </div>
  );

  return (
    <div className="bg-surface min-h-screen pb-80">
      <div className="bg-surface-container-lowest border-b border-[0.5px] border-border-default pt-32 pb-24">
        <Container>
          <h1 className="text-[28px] md:text-[36px] font-bold text-on-surface tracking-[-1px] mb-4">
            {heroCopy.title}
          </h1>
          <p className="text-[14px] text-muted-text mb-24">
            {heroCopy.description}
          </p>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_200px_200px]">
            <div className="relative min-w-0">
              <Search className="absolute left-16 top-1/2 -translate-y-1/2 text-muted-text" size={16} />
              <select
                value={brand}
                onChange={(event) => updateFilters({ brand: event.target.value, model: "" })}
                className="w-full min-w-0 appearance-none pl-44 pr-16 py-12 bg-white border border-[0.5px] border-border-default rounded-input text-[14px] text-on-surface outline-none focus:border-primary shadow-sm"
              >
                <option value="">{text.brandPlaceholder}</option>
                {brandOptions.map((option) => <option key={option.value} value={option.value}>{optionLabel(option)}</option>)}
              </select>
            </div>

            <div className="relative min-w-0">
              <select
                value={model}
                disabled={!brand || modelOptions.length === 0}
                onChange={(event) => updateFilter("model", event.target.value)}
                className="w-full min-w-0 appearance-none px-16 py-12 bg-white border border-[0.5px] border-border-default rounded-input text-[14px] text-on-surface outline-none focus:border-primary shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">{brand ? text.allModels : text.chooseMakeFirst}</option>
                {modelOptions.map((option) => <option key={option.value} value={option.value}>{optionLabel(option)}</option>)}
              </select>
            </div>

            <div className="relative min-w-0">
              <select
                value={city}
                onChange={(event) => updateFilters({ city: event.target.value, district: "" })}
                className="w-full min-w-0 appearance-none px-16 py-12 bg-white border border-[0.5px] border-border-default rounded-input text-[14px] text-on-surface outline-none focus:border-primary shadow-sm"
              >
                <option value="">{text.cityPlaceholder}</option>
                {cityOptions.map((option) => <option key={option.value} value={option.value}>{optionLabel(option)}</option>)}
              </select>
            </div>

            <div className="relative min-w-0">
              <select
                value={sort}
                onChange={(event) => updateFilter("sort", event.target.value)}
                className="w-full min-w-0 appearance-none px-16 py-12 bg-white border border-[0.5px] border-border-default rounded-input text-[14px] text-on-surface outline-none focus:border-primary shadow-sm"
              >
                {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-8">
            <span className="text-[12px] font-medium text-muted-text">
              {text.popularDamageTypes}
            </span>
            {DAMAGE_FILTER_OPTIONS.map((option) => {
              const active = damageSlugArr.includes(option.slug);
              const count = filterOptions.damageCounts[option.slug] ?? 0;
              return (
                <button
                  key={option.slug}
                  type="button"
                  onClick={() => selectDamageType(option.slug)}
                  className={cn(
                    "inline-flex h-[30px] items-center rounded-full border px-12 text-[12px] font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-border-default bg-white text-on-surface hover:border-primary hover:text-primary"
                  )}
                >
                  {damageLabel(option.slug, option.label)}
                  {count > 0 && <span className="ml-5 text-[10px] opacity-75">{count}</span>}
                </button>
              );
            })}
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-6 mt-12">
              {brand && <Chip label={brand} onRemove={() => updateFilters({ brand: "", model: "" })} />}
              {model && <Chip label={model} onRemove={() => updateFilter("model", "")} />}
              {city && <Chip label={city} onRemove={() => updateFilters({ city: "", district: "" })} />}
              {district && <Chip label={district} onRemove={() => updateFilter("district", "")} />}
              {gradeArr.map((g) => <Chip key={g} label={text.gradeChip(g)} onRemove={() => toggleMulti("grade", g, grade)} />)}
              {damageFilters.map((filter) => <Chip key={filter.slug} label={damageLabel(filter.slug, filter.label)} onRemove={() => toggleDamageType(filter.slug)} />)}
              {priceMin && <Chip label={text.minPriceChip(formatPrice(parseInt(priceMin, 10)))} onRemove={() => updateFilter("price_min", "")} />}
              {priceMax && <Chip label={text.maxPriceChip(formatPrice(parseInt(priceMax, 10)))} onRemove={() => updateFilter("price_max", "")} />}
              {yearMin && <Chip label={`${yearMin}+`} onRemove={() => updateFilter("year_min", "")} />}
              {yearMax && <Chip label={`-${yearMax}`} onRemove={() => updateFilter("year_max", "")} />}
              {kmMax && <Chip label={`-${formatKm(parseInt(kmMax, 10))}`} onRemove={() => updateFilter("km_max", "")} />}
              {fuelType && <Chip label={fuelLabel(fuelType)} onRemove={() => updateFilter("fuel_type", "")} />}
              {transmission && <Chip label={transmissionLabel(transmission)} onRemove={() => updateFilter("transmission", "")} />}
              {hasTramer && <Chip label={hasTramer === "yes" ? text.tramerOnly : text.noTramer} onRemove={() => updateFilter("has_tramer", "")} />}
              {negotiable && <Chip label={text.negotiableOnly} onRemove={() => updateFilter("negotiable", "")} />}
              {verifiedDealer && <Chip label={text.verifiedDealerOnly} onRemove={() => updateFilter("verified_dealer", "")} />}
              {featured && <Chip label={text.featuredOnly} onRemove={() => updateFilter("featured", "")} />}
              {hasPhotos && <Chip label={text.withPhotosOnly} onRemove={() => updateFilter("has_photos", "")} />}
              {hasDamageNote && <Chip label={text.withDamageNoteOnly} onRemove={() => updateFilter("has_damage_note", "")} />}
            </div>
          )}
        </Container>
      </div>

      <Container className="pt-24">
        <div className="flex gap-32">
          <aside className="hidden lg:block w-[276px] shrink-0">
            <div className="sticky top-[76px] max-h-[calc(100vh-100px)] overflow-y-auto rounded-card border border-[0.5px] border-border-default bg-surface-container-lowest p-16">
              <FilterPanel />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="mb-16 flex items-center justify-between gap-12">
              <p className="text-[13px] text-muted-text">
                {loading ? text.loading : total > 0 ? text.vehicleFound(total) : text.vehicleCount(listings.length)}
              </p>
              <div className="flex items-center gap-8">
                <button
                  type="button"
                  onClick={saveCurrentSearch}
                  disabled={isCurrentSearchSaved}
                  className={cn(
                    "hidden sm:inline-flex items-center gap-6 rounded-btn border px-12 py-8 text-[12px] font-medium transition-colors",
                    isCurrentSearchSaved
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border-default bg-surface-container-lowest text-on-surface hover:border-primary"
                  )}
                >
                  {isCurrentSearchSaved ? <Check size={14} /> : <BookmarkPlus size={14} />}
                  {isCurrentSearchSaved ? text.savedSearch : text.saveSearch}
                </button>
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="flex items-center gap-8 px-16 py-8 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-btn text-[13px] font-medium text-on-surface lg:hidden"
                >
                  <SlidersHorizontal size={14} />
                  {text.filterButton}
                  {activeFiltersCount > 0 && (
                    <span className="w-[18px] h-[18px] bg-primary text-white rounded-full text-[10px] flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card h-[340px]" />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-60 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card">
                <p className="text-[16px] font-medium text-on-surface mb-8">{text.emptyTitle}</p>
                <p className="text-[13px] text-muted-text mb-24">{text.emptyDescription}</p>
                <button
                  onClick={clearAllFilters}
                  className="px-24 py-12 bg-primary text-white rounded-btn text-[13px] font-medium hover:opacity-90"
                >
                  {text.clearFilters}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                {listings.map((listing) => {
                  const selected = compareItems.some((item) => item.id === listing.id);
                  return (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      compareSelected={selected}
                      compareDisabled={!selected && compareItems.length >= 4}
                      compareLabel={text.compare}
                      compareSelectedLabel={text.inCompare}
                      onCompareToggle={toggleCompare}
                    />
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-8 mt-32">
                <button
                  disabled={page <= 1}
                  onClick={() => updateFilter("page", String(page - 1))}
                  className="w-[36px] h-[36px] flex items-center justify-center rounded-btn border border-[0.5px] border-border-default text-on-surface disabled:opacity-40 hover:border-primary transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => updateFilter("page", String(p))}
                      className={cn(
                        "w-[36px] h-[36px] flex items-center justify-center rounded-btn border text-[13px] transition-colors",
                        p === page
                          ? "border-primary bg-primary text-white"
                          : "border-border-default text-on-surface hover:border-primary"
                      )}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  disabled={page >= totalPages}
                  onClick={() => updateFilter("page", String(page + 1))}
                  className="w-[36px] h-[36px] flex items-center justify-center rounded-btn border border-[0.5px] border-border-default text-on-surface disabled:opacity-40 hover:border-primary transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            <RecentViewedPanel recentListings={recentListings} text={text} />
          </div>
        </div>
      </Container>

      {filtersOpen && (
        <div className="fixed inset-0 z-[150] flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="relative ml-auto flex h-full w-full max-w-[390px] flex-col bg-surface-container-lowest shadow-xl">
            <div className="flex shrink-0 items-center justify-between border-b border-[0.5px] border-border-default px-16 py-14">
              <h2 className="text-[16px] font-semibold text-on-surface">{text.filters}</h2>
              <button onClick={() => setFiltersOpen(false)} className="text-muted-text hover:text-on-surface">
                <X size={22} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-16">
              <FilterPanel />
            </div>
            <div className="shrink-0 border-t border-[0.5px] border-border-default bg-surface-container-lowest p-16 pb-[calc(16px+env(safe-area-inset-bottom))]">
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-full bg-primary text-white py-12 rounded-btn text-[14px] font-semibold hover:opacity-90"
              >
                {loading ? text.loading : text.showResults(total)}
              </button>
            </div>
          </div>
        </div>
      )}

      {compareItems.length > 0 && (
        <div className="fixed inset-x-12 bottom-16 z-[120] mx-auto max-w-[720px] rounded-card border border-[0.5px] border-border-default bg-surface-container-lowest p-12 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-10">
            <div className="flex items-center gap-8 text-[13px] font-semibold text-on-surface">
              <GitCompareArrows size={16} className="text-primary" />
              {text.compareSelected(compareItems.length)}
            </div>
            <div className="flex items-center gap-8">
              <button
                type="button"
                onClick={clearCompare}
                className="inline-flex items-center gap-6 rounded-btn border border-border-default px-12 py-8 text-[12px] font-medium text-muted-text hover:text-on-surface"
              >
                <Trash2 size={13} /> {text.clearCompare}
              </button>
              <button
                type="button"
                onClick={() => setCompareOpen(true)}
                disabled={compareItems.length < 2}
                className="inline-flex items-center gap-6 rounded-btn bg-primary px-14 py-8 text-[12px] font-semibold text-white disabled:opacity-50"
              >
                {text.openCompare}
              </button>
            </div>
          </div>
        </div>
      )}

      {compareOpen && (
        <CompareModal
          items={compareItems}
          text={text}
          onClose={() => setCompareOpen(false)}
          onRemove={removeCompareItem}
        />
      )}
    </div>
  );
}

function FilterSection({ title, icon, children, defaultOpen = false }: { title: string; icon: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="rounded-card border border-[0.5px] border-border-default bg-surface p-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-8 px-12 py-10 text-left"
      >
        <span className="flex min-w-0 items-center gap-8 text-[12px] font-semibold uppercase tracking-wider text-muted-text">
          {icon}
          <span className="truncate">{title}</span>
        </span>
        <ChevronDown size={15} className={cn("shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="flex flex-col gap-14 border-t border-[0.5px] border-border-default px-12 py-12">{children}</div>}
    </section>
  );
}

function ControlLabel({ children }: { children: ReactNode }) {
  return (
    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-text">
      {children}
    </label>
  );
}

function SelectControl({
  label,
  value,
  children,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  children: ReactNode;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <ControlLabel>{label}</ControlLabel>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full min-w-0 px-12 py-8 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-input text-[13px] text-on-surface outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {children}
      </select>
    </div>
  );
}

function RangeInputs({
  label,
  minValue,
  maxValue,
  minPlaceholder,
  maxPlaceholder,
  onMin,
  onMax,
}: {
  label: string;
  minValue: string;
  maxValue: string;
  minPlaceholder: string;
  maxPlaceholder: string;
  onMin: (value: string) => void;
  onMax: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <ControlLabel>{label}</ControlLabel>
      <div className="grid grid-cols-2 gap-8">
        <input
          type="number"
          placeholder={minPlaceholder}
          value={minValue}
          onChange={(event) => onMin(event.target.value)}
          className="w-full min-w-0 px-12 py-8 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-input text-[13px] outline-none focus:border-primary"
        />
        <input
          type="number"
          placeholder={maxPlaceholder}
          value={maxValue}
          onChange={(event) => onMax(event.target.value)}
          className="w-full min-w-0 px-12 py-8 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-input text-[13px] outline-none focus:border-primary"
        />
      </div>
    </div>
  );
}

function RadioRow({ checked, label, count, onChange }: { checked: boolean; label: string; count: number; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-8 text-[13px] text-on-surface">
      <span className="flex min-w-0 items-center gap-8">
        <input type="radio" checked={checked} onChange={onChange} className="accent-primary" />
        <span className="truncate">{label}</span>
      </span>
      {count > 0 && <span className="text-[11px] text-muted-text">{count}</span>}
    </label>
  );
}

function CheckboxRow({ checked, label, count, onChange }: { checked: boolean; label: string; count: number; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-8 text-[13px] text-on-surface">
      <span className="flex min-w-0 items-center gap-8">
        <input type="checkbox" checked={checked} onChange={onChange} className="h-[14px] w-[14px] accent-primary" />
        <span className="truncate">{label}</span>
      </span>
      {count > 0 && <span className="text-[11px] text-muted-text">{count}</span>}
    </label>
  );
}

function QualityToggle({
  icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-8 rounded-btn border px-10 py-8 text-left text-[13px] transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border-default bg-surface-container-lowest text-on-surface hover:border-primary"
      )}
    >
      <span className="flex min-w-0 items-center gap-8">
        {icon}
        <span className="truncate">{label}</span>
      </span>
      <span className="shrink-0 text-[11px] opacity-70">{count}</span>
    </button>
  );
}

function PresetButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-w-0 rounded-btn border px-8 py-8 text-[12px] font-medium transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border-default bg-surface-container-lowest text-on-surface hover:border-primary"
      )}
    >
      {children}
    </button>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-4 px-12 py-4 bg-primary/10 text-primary rounded-full text-[12px] font-medium">
      {label}
      <button type="button" onClick={onRemove} className="hover:opacity-70" aria-label={label}>
        <X size={11} />
      </button>
    </span>
  );
}

function SavedSearchesPanel({
  savedSearches,
  text,
  onOpen,
  onRemove,
}: {
  savedSearches: SavedSearch[];
  text: {
    savedSearches: string;
    noSavedSearches: string;
    vehicleFound: (count: number) => string;
    remove: string;
  };
  onOpen: (href: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <section className="rounded-card border border-[0.5px] border-border-default bg-surface p-12">
      <div className="mb-10 flex items-center gap-8 text-[12px] font-semibold uppercase tracking-wider text-muted-text">
        <BookmarkPlus size={14} />
        {text.savedSearches}
      </div>
      {savedSearches.length === 0 ? (
        <p className="text-[12px] text-muted-text">{text.noSavedSearches}</p>
      ) : (
        <div className="flex flex-col gap-8">
          {savedSearches.map((search) => (
            <div key={search.id} className="flex items-start gap-8 rounded-card bg-surface-container-lowest p-8">
              <button type="button" onClick={() => onOpen(search.href)} className="min-w-0 flex-1 text-left">
                <div className="truncate text-[12px] font-semibold text-on-surface">{search.title}</div>
                <div className="mt-2 text-[11px] text-muted-text">{text.vehicleFound(search.total)}</div>
              </button>
              <button type="button" onClick={() => onRemove(search.id)} title={text.remove} className="text-muted-text hover:text-on-surface">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function RecentViewedPanel({
  recentListings,
  text,
}: {
  recentListings: RecentListing[];
  text: {
    recentViewed: string;
    noRecentViewed: string;
  };
}) {
  return (
    <section className="mt-32 rounded-card border border-[0.5px] border-border-default bg-surface-container-lowest p-16">
      <div className="mb-12 flex items-center gap-8 text-[13px] font-semibold text-on-surface">
        <Eye size={15} className="text-primary" />
        {text.recentViewed}
      </div>
      {recentListings.length === 0 ? (
        <p className="text-[12px] text-muted-text">{text.noRecentViewed}</p>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {recentListings.map((listing) => (
            <Link
              key={listing.id}
              href={{ pathname: "/ara/[slug]", params: { slug: listing.slug } } as never}
              className="flex min-w-0 items-center gap-10 rounded-card border border-[0.5px] border-border-default bg-surface p-8 transition-colors hover:border-primary"
            >
              <div className="h-44 w-56 shrink-0 overflow-hidden rounded bg-surface-container-low">
                {listing.primary_image ? (
                  <Image src={listing.primary_image} alt={listing.title} width={56} height={44} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0">
                <div className="truncate text-[12px] font-semibold text-on-surface">{listing.title}</div>
                <div className="mt-2 text-[11px] text-muted-text">{listing.city} · {formatPrice(listing.asking_price)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function CompareModal({
  items,
  text,
  onClose,
  onRemove,
}: {
  items: CompareItem[];
  text: {
    compareTitle: string;
    compareHint: string;
    remove: string;
    make: string;
    model: string;
    yearRange: string;
    kmRange: string;
    city: string;
    priceRange: string;
    grade: string;
    damageType: string;
  };
  onClose: () => void;
  onRemove: (id: string) => void;
}) {
  const rows = [
    { label: text.make, render: (item: CompareItem) => item.brand },
    { label: text.model, render: (item: CompareItem) => item.model },
    { label: text.yearRange, render: (item: CompareItem) => String(item.year) },
    { label: text.kmRange, render: (item: CompareItem) => formatKm(item.km) },
    { label: text.city, render: (item: CompareItem) => item.city },
    { label: text.priceRange, render: (item: CompareItem) => formatPrice(item.asking_price) },
    { label: text.grade, render: (item: CompareItem) => item.damage_grade ?? "-" },
    { label: text.damageType, render: (item: CompareItem) => item.damage_type.join(", ") || "-" },
  ];

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/45 p-16">
      <div className="max-h-[88vh] w-full max-w-[980px] overflow-hidden rounded-card bg-surface-container-lowest shadow-xl">
        <div className="flex items-start justify-between gap-12 border-b border-[0.5px] border-border-default p-16">
          <div>
            <h2 className="text-[18px] font-bold text-on-surface">{text.compareTitle}</h2>
            <p className="mt-3 text-[12px] text-muted-text">{text.compareHint}</p>
          </div>
          <button type="button" onClick={onClose} className="text-muted-text hover:text-on-surface">
            <X size={22} />
          </button>
        </div>
        <div className="overflow-auto p-16">
          <div className="min-w-[680px]">
            <div className="grid gap-8" style={{ gridTemplateColumns: `150px repeat(${items.length}, minmax(150px, 1fr))` }}>
              <div />
              {items.map((item) => (
                <div key={item.id} className="rounded-card border border-[0.5px] border-border-default bg-surface p-10">
                  <div className="mb-8 h-80 overflow-hidden rounded bg-surface-container-low">
                    {item.primary_image ? (
                      <Image src={item.primary_image} alt={item.title} width={150} height={80} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="line-clamp-2 text-[12px] font-semibold text-on-surface">{item.title}</div>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="mt-8 inline-flex items-center gap-4 text-[11px] text-muted-text hover:text-on-surface"
                  >
                    <X size={11} /> {text.remove}
                  </button>
                </div>
              ))}
              {rows.map((row) => (
                <div key={row.label} className="contents">
                  <div className="rounded-card bg-surface px-10 py-9 text-[12px] font-semibold text-muted-text">{row.label}</div>
                  {items.map((item) => (
                    <div key={`${row.label}-${item.id}`} className="rounded-card bg-surface px-10 py-9 text-[12px] text-on-surface">
                      {row.render(item)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

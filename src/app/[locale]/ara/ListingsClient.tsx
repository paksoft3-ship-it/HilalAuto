"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { GradeBadge } from "@/components/marketplace/GradeBadge";
import { Listing, DamageGrade, LISTINGS_PER_PAGE } from "@/types/marketplace";
import { supabase } from "@/lib/supabase";
import { CITIES, DAMAGE_TYPES } from "@/lib/constants";
import { CAR_BRANDS } from "@/lib/constants";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListingsClientProps {
  initialListings: Listing[];
  availableBrands: string[];
  initialParams?: Record<string, string>;
}

const GRADES: DamageGrade[] = ["A", "B", "C", "D", "E"];
const FUEL_TYPES = ["benzin", "dizel", "lpg", "elektrik", "hibrit"] as const;
const TRANSMISSIONS = ["manuel", "otomatik"] as const;

const SORT_OPTIONS = [
  { value: "newest", label: "En Yeni" },
  { value: "price_asc", label: "En Ucuz" },
  { value: "price_desc", label: "En Pahalı" },
  { value: "views_desc", label: "En Çok Görüntülenen" },
] as const;

function formatPrice(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

export function ListingsClient({ initialListings, availableBrands }: ListingsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [total, setTotal] = useState(initialListings.length >= LISTINGS_PER_PAGE ? -1 : initialListings.length);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter state from URL
  const getParam = (key: string) => searchParams.get(key) || "";
  const brand = getParam("brand");
  const city = getParam("city");
  const grade = getParam("grade"); // comma-separated
  const damageType = getParam("damage_type"); // comma-separated
  const fuelType = getParam("fuel_type");
  const transmission = getParam("transmission");
  const priceMin = getParam("price_min");
  const priceMax = getParam("price_max");
  const yearMin = getParam("year_min");
  const yearMax = getParam("year_max");
  const sort = (getParam("sort") || "newest") as "newest" | "price_asc" | "price_desc" | "views_desc";
  const page = parseInt(getParam("page") || "1", 10);

  const brands = availableBrands.length > 0 ? availableBrands : CAR_BRANDS;

  function buildParams(overrides: Record<string, string>) {
    const current = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(overrides)) {
      if (v) current.set(k, v);
      else current.delete(k);
    }
    if (overrides.page === undefined) current.set("page", "1"); // reset page on filter change
    return current.toString();
  }

  function updateFilter(key: string, value: string) {
    const q = buildParams({ [key]: value });
    startTransition(() => {
      router.replace(`${pathname as string}?${q}` as never);
    });
  }

  function toggleMulti(key: string, value: string, current: string) {
    const arr = current ? current.split(",") : [];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    updateFilter(key, next.join(","));
  }

  const activeFiltersCount = [brand, city, grade, damageType, fuelType, transmission, priceMin, priceMax, yearMin, yearMax]
    .filter(Boolean).length;

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("hazaral_listings")
        .select("*, dealer:hazaral_dealers(id, company_name, city, is_verified, logo_url, slug)", { count: "exact" })
        .eq("status", "active");

      if (brand) query = query.eq("brand", brand);
      if (city) query = query.eq("city", city);
      if (fuelType) query = query.eq("fuel_type", fuelType);
      if (transmission) query = query.eq("transmission", transmission);
      if (priceMin) query = query.gte("asking_price", parseInt(priceMin));
      if (priceMax) query = query.lte("asking_price", parseInt(priceMax));
      if (yearMin) query = query.gte("year", parseInt(yearMin));
      if (yearMax) query = query.lte("year", parseInt(yearMax));
      if (grade) query = query.in("damage_grade", grade.split(","));

      switch (sort) {
        case "price_asc":  query = query.order("asking_price", { ascending: true }); break;
        case "price_desc": query = query.order("asking_price", { ascending: false }); break;
        case "views_desc": query = query.order("view_count", { ascending: false }); break;
        default:
          query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false });
      }

      const from = (page - 1) * LISTINGS_PER_PAGE;
      query = query.range(from, from + LISTINGS_PER_PAGE - 1);

      const { data, count } = await query;

      let result = (data as Listing[]) || [];

      // Client-side filter for damage_type (array overlap)
      if (damageType) {
        const selected = damageType.split(",");
        result = result.filter((l) => l.damage_type.some((d) => selected.includes(d)));
      }

      setListings(result);
      setTotal(count ?? result.length);
    } catch {
      setListings([]);
    }
    setLoading(false);
  }, [brand, city, grade, damageType, fuelType, transmission, priceMin, priceMax, yearMin, yearMax, sort, page]);

  // Fetch on filter/page change (skip on first render if we have initial data)
  useEffect(() => {
    const hasFilters = brand || city || grade || damageType || fuelType || transmission || priceMin || priceMax || yearMin || yearMax || sort !== "newest" || page > 1;
    if (hasFilters) {
      fetchListings();
    }
  }, [fetchListings, brand, city, grade, damageType, fuelType, transmission, priceMin, priceMax, yearMin, yearMax, sort, page]);

  const totalPages = total > 0 ? Math.ceil(total / LISTINGS_PER_PAGE) : 1;

  const gradeArr = grade ? grade.split(",") as DamageGrade[] : [];
  const damageArr = damageType ? damageType.split(",") : [];

  const FilterPanel = () => (
    <div className="flex flex-col gap-20">
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-on-surface">Filtreler</h2>
        {activeFiltersCount > 0 && (
          <button
            onClick={() => startTransition(() => router.replace(pathname as never))}
            className="text-[12px] text-primary flex items-center gap-4 hover:underline"
          >
            <X size={12} /> Temizle ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Brand */}
      <div className="flex flex-col gap-8">
        <label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">Marka</label>
        <select
          value={brand}
          onChange={(e) => updateFilter("brand", e.target.value)}
          className="w-full px-12 py-10 bg-surface border border-[0.5px] border-border-default rounded-input text-[13px] text-on-surface outline-none focus:border-primary"
        >
          <option value="">Tüm Markalar</option>
          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* City */}
      <div className="flex flex-col gap-8">
        <label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">Şehir</label>
        <select
          value={city}
          onChange={(e) => updateFilter("city", e.target.value)}
          className="w-full px-12 py-10 bg-surface border border-[0.5px] border-border-default rounded-input text-[13px] text-on-surface outline-none focus:border-primary"
        >
          <option value="">Tüm Şehirler</option>
          {Object.entries(CITIES).map(([slug, label]) => (
            <option key={slug} value={label}>{label}</option>
          ))}
        </select>
      </div>

      {/* Grade */}
      <div className="flex flex-col gap-8">
        <label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">Otograde Derecesi</label>
        <div className="flex gap-6 flex-wrap">
          {GRADES.map((g) => (
            <button
              key={g}
              onClick={() => toggleMulti("grade", g, grade)}
              className={cn(
                "flex items-center gap-6 px-10 py-6 rounded-full border text-[12px] font-medium transition-colors",
                gradeArr.includes(g)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border-default text-muted-text hover:border-primary"
              )}
            >
              <GradeBadge grade={g} size="sm" /> {g}
            </button>
          ))}
        </div>
      </div>

      {/* Damage type */}
      <div className="flex flex-col gap-8">
        <label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">Hasar Türü</label>
        <div className="flex flex-col gap-6">
          {DAMAGE_TYPES.map((d) => (
            <label key={d} className="flex items-center gap-8 cursor-pointer">
              <input
                type="checkbox"
                checked={damageArr.includes(d)}
                onChange={() => toggleMulti("damage_type", d, damageType)}
                className="w-[14px] h-[14px] accent-primary"
              />
              <span className="text-[13px] text-on-surface">{d}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="flex flex-col gap-8">
        <label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">Fiyat Aralığı (TL)</label>
        <div className="flex gap-8">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => updateFilter("price_min", e.target.value)}
            className="flex-1 px-10 py-8 bg-surface border border-[0.5px] border-border-default rounded-input text-[13px] outline-none focus:border-primary"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => updateFilter("price_max", e.target.value)}
            className="flex-1 px-10 py-8 bg-surface border border-[0.5px] border-border-default rounded-input text-[13px] outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Year range */}
      <div className="flex flex-col gap-8">
        <label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">Yıl Aralığı</label>
        <div className="flex gap-8">
          <input
            type="number"
            placeholder="2000"
            min={1990}
            max={2026}
            value={yearMin}
            onChange={(e) => updateFilter("year_min", e.target.value)}
            className="flex-1 px-10 py-8 bg-surface border border-[0.5px] border-border-default rounded-input text-[13px] outline-none focus:border-primary"
          />
          <input
            type="number"
            placeholder="2025"
            min={1990}
            max={2026}
            value={yearMax}
            onChange={(e) => updateFilter("year_max", e.target.value)}
            className="flex-1 px-10 py-8 bg-surface border border-[0.5px] border-border-default rounded-input text-[13px] outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Fuel type */}
      <div className="flex flex-col gap-8">
        <label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">Yakıt Tipi</label>
        <div className="flex flex-col gap-6">
          {FUEL_TYPES.map((f) => (
            <label key={f} className="flex items-center gap-8 cursor-pointer">
              <input
                type="radio"
                name="fuel"
                checked={fuelType === f}
                onChange={() => updateFilter("fuel_type", fuelType === f ? "" : f)}
                className="accent-primary"
              />
              <span className="text-[13px] text-on-surface capitalize">{f}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div className="flex flex-col gap-8">
        <label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">Vites</label>
        <div className="flex gap-8">
          {TRANSMISSIONS.map((tr) => (
            <button
              key={tr}
              onClick={() => updateFilter("transmission", transmission === tr ? "" : tr)}
              className={cn(
                "flex-1 py-8 rounded-btn border text-[12px] font-medium transition-colors capitalize",
                transmission === tr
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border-default text-muted-text hover:border-primary"
              )}
            >
              {tr}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-surface min-h-screen pb-60">
      {/* Hero search bar */}
      <div className="bg-surface-container-lowest border-b border-[0.5px] border-border-default pt-32 pb-24">
        <Container>
          <h1 className="text-[28px] md:text-[36px] font-bold text-on-surface tracking-[-1px] mb-4">
            Hasarlı Araç İlanları
          </h1>
          <p className="text-[14px] text-muted-text mb-20">
            Kazalı, pert, hasarlı ve hurda araçlar — Otograde güvencesiyle.
          </p>
          <div className="flex flex-col md:flex-row gap-10">
            {/* Brand quick search */}
            <div className="relative flex-1">
              <Search className="absolute left-14 top-1/2 -translate-y-1/2 text-muted-text" size={16} />
              <select
                value={brand}
                onChange={(e) => updateFilter("brand", e.target.value)}
                className="w-full appearance-none pl-42 pr-16 py-14 bg-white border border-[0.5px] border-border-default rounded-input text-[14px] text-on-surface outline-none focus:border-primary shadow-sm"
              >
                <option value="">Marka seçin...</option>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* City quick search */}
            <div className="relative md:w-[200px]">
              <select
                value={city}
                onChange={(e) => updateFilter("city", e.target.value)}
                className="w-full appearance-none px-14 py-14 bg-white border border-[0.5px] border-border-default rounded-input text-[14px] text-on-surface outline-none focus:border-primary shadow-sm"
              >
                <option value="">Şehir seçin...</option>
                {Object.entries(CITIES).map(([slug, label]) => (
                  <option key={slug} value={label}>{label}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative md:w-[200px]">
              <select
                value={sort}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="w-full appearance-none px-14 py-14 bg-white border border-[0.5px] border-border-default rounded-input text-[14px] text-on-surface outline-none focus:border-primary shadow-sm"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-6 mt-12">
              {brand && <Chip label={brand} onRemove={() => updateFilter("brand", "")} />}
              {city && <Chip label={city} onRemove={() => updateFilter("city", "")} />}
              {gradeArr.map((g) => <Chip key={g} label={`Grade ${g}`} onRemove={() => toggleMulti("grade", g, grade)} />)}
              {damageArr.map((d) => <Chip key={d} label={d} onRemove={() => toggleMulti("damage_type", d, damageType)} />)}
              {priceMin && <Chip label={`Min ${formatPrice(parseInt(priceMin))}`} onRemove={() => updateFilter("price_min", "")} />}
              {priceMax && <Chip label={`Max ${formatPrice(parseInt(priceMax))}`} onRemove={() => updateFilter("price_max", "")} />}
              {yearMin && <Chip label={`${yearMin}+`} onRemove={() => updateFilter("year_min", "")} />}
              {fuelType && <Chip label={fuelType} onRemove={() => updateFilter("fuel_type", "")} />}
              {transmission && <Chip label={transmission} onRemove={() => updateFilter("transmission", "")} />}
            </div>
          )}
        </Container>
      </div>

      <Container className="pt-24">
        <div className="flex gap-32">
          {/* Filter sidebar — desktop */}
          <aside className="hidden lg:block w-[240px] shrink-0">
            <div className="sticky top-[76px] bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-20 overflow-y-auto max-h-[calc(100vh-100px)]">
              <FilterPanel />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter button */}
            <div className="flex items-center justify-between mb-16 lg:hidden">
              <p className="text-[13px] text-muted-text">
                {loading ? "Yükleniyor..." : total > 0 ? `${total} araç bulundu` : `${listings.length} araç`}
              </p>
              <button
                onClick={() => setFiltersOpen(true)}
                className="flex items-center gap-8 px-16 py-8 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-btn text-[13px] font-medium text-on-surface"
              >
                <SlidersHorizontal size={14} />
                Filtrele
                {activeFiltersCount > 0 && (
                  <span className="w-[18px] h-[18px] bg-primary text-white rounded-full text-[10px] flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Desktop result count */}
            <div className="hidden lg:flex items-center justify-between mb-16">
              <p className="text-[13px] text-muted-text">
                {loading ? "Yükleniyor..." : total > 0 ? `${total} araç bulundu` : `${listings.length} araç`}
              </p>
            </div>

            {/* Listings grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card h-[340px]" />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-60 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card">
                <p className="text-[16px] font-medium text-on-surface mb-8">Araç bulunamadı</p>
                <p className="text-[13px] text-muted-text mb-20">Filtreleri değiştirerek tekrar deneyin.</p>
                <button
                  onClick={() => startTransition(() => router.replace(pathname as never))}
                  className="px-20 py-10 bg-primary text-white rounded-btn text-[13px] font-medium hover:opacity-90"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                {listings.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            )}

            {/* Pagination */}
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
          </div>
        </div>
      </Container>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[150] flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="relative ml-auto w-[80vw] max-w-[340px] h-full bg-surface-container-lowest overflow-y-auto p-20 flex flex-col gap-0 shadow-xl">
            <div className="flex items-center justify-between mb-20">
              <h2 className="text-[16px] font-semibold text-on-surface">Filtreler</h2>
              <button onClick={() => setFiltersOpen(false)} className="text-muted-text hover:text-on-surface">
                <X size={22} />
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setFiltersOpen(false)}
              className="mt-20 w-full bg-primary text-white py-14 rounded-btn text-[14px] font-semibold hover:opacity-90"
            >
              Filtrele
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-6 px-10 py-4 bg-primary/10 text-primary rounded-full text-[12px] font-medium">
      {label}
      <button onClick={onRemove} className="hover:opacity-70">
        <X size={11} />
      </button>
    </span>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import { Listing } from "@/types/marketplace";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { ListingsClient } from "./ListingsClient";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function readParam(sp: Record<string, string | string[] | undefined>, key: string): string {
  const v = sp[key];
  return typeof v === "string" ? v : Array.isArray(v) ? (v[0] ?? "") : "";
}

function buildTitle(brand: string, city: string, damageType: string, grade: string): string {
  if (brand && city) return `${brand} ${city}'da Hasarlı Araç İlanları | ${SITE_NAME}`;
  if (brand && damageType) return `${brand} ${damageType} İlanları | ${SITE_NAME}`;
  if (brand) return `${brand} Hasarlı Araç İlanları | ${SITE_NAME}`;
  if (city && damageType) return `${city}'da ${damageType} İlanları | ${SITE_NAME}`;
  if (city) return `${city}'da Hasarlı Araç İlanları | ${SITE_NAME}`;
  if (damageType) return `${damageType} İlanları — Satılık Hasarlı Araçlar | ${SITE_NAME}`;
  if (grade) return `Grade ${grade.toUpperCase()} Hasarlı Araç İlanları | ${SITE_NAME}`;
  return `Hasarlı Araç İlanları — Kazalı, Pert, Hurda Araç Pazar Yeri | ${SITE_NAME}`;
}

function buildDescription(brand: string, city: string, damageType: string): string {
  if (brand && city) {
    return `${city}'da satılık ${brand} hasarlı araçlar. Otograde güvencesiyle kazalı, pert ve hasar kaydı olan ${brand} ilanları.`;
  }
  if (brand) {
    return `Satılık ${brand} hasarlı araçlar. Otograde güvencesiyle kazalı, pert ve hasar kaydı olan ${brand} ilanları. Türkiye geneli.`;
  }
  if (city) {
    return `${city}'da satılık hasarlı araçlar. Kazalı, pert ve hasar kaydı olan araçlar Otograde güvencesiyle. Onaylı bayiler.`;
  }
  if (damageType) {
    return `Satılık ${damageType} araç ilanları. Otograde güvencesiyle Türkiye genelinde onaylı bayilerden hasarlı araçlar.`;
  }
  return "Türkiye genelinde kazalı, pert, hasarlı ve hurda araç ilanları. Otograde dereceli, onaylı bayilerden güvenli alım.";
}

// ── generateMetadata ──────────────────────────────────────────────────────────

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;

  const brand     = readParam(sp, "brand");
  const city      = readParam(sp, "city");
  const damageType = readParam(sp, "damage_type");
  const grade     = readParam(sp, "grade");

  const hasFilter = !!(brand || city || damageType || grade);

  const title       = buildTitle(brand, city, damageType, grade);
  const description = buildDescription(brand, city, damageType);

  // Canonical always points at the base listing index (avoids filter-page duplication)
  const canonical = `${SITE_URL}${locale === "tr" ? "/ara" : "/en/listings"}`;

  return {
    title: { absolute: title },
    description,
    // Filtered search pages: follow links but don't index (avoids duplicate content)
    robots: hasFilter
      ? { index: false, follow: true }
      : { index: true, follow: true },
    alternates: {
      canonical,
      languages: {
        tr: `${SITE_URL}/ara`,
        en: `${SITE_URL}/en/listings`,
        "x-default": `${SITE_URL}/ara`,
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

async function fetchInitialListings(): Promise<Listing[]> {
  try {
    const { data } = await supabaseAdmin
      .from("hazaral_listings")
      .select("*, dealer:hazaral_dealers(id, company_name, city, is_verified, logo_url, slug)")
      .eq("status", "active")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .range(0, 19);
    return (data as Listing[]) || [];
  } catch {
    return [];
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

function buildItemListSchema(listings: Listing[], locale: string) {
  const base = `${SITE_URL}${locale === "tr" ? "" : "/en"}`;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Hasarlı Araç İlanları",
    "description": "Türkiye genelinde onaylı bayilerden satılık kazalı, pert ve hasarlı araçlar",
    "url": `${base}/ara`,
    "numberOfItems": listings.length,
    "itemListElement": listings.slice(0, 10).map((l, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `${base}/ara/${l.slug}`,
      "name": l.title,
      ...(l.primary_image || l.images?.[0]
        ? { "image": l.primary_image || l.images[0] }
        : {}),
    })),
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AraPage({ params }: Props) {
  const { locale } = await params;

  const [initialListings, dbBrands] = await Promise.all([
    fetchInitialListings(),
    fetchDistinctBrands(),
  ]);

  const itemListSchema = buildItemListSchema(initialListings, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Suspense fallback={null}>
        <ListingsClient
          initialListings={initialListings}
          availableBrands={dbBrands}
        />
      </Suspense>
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { Listing, GRADE_COLORS } from "@/types/marketplace";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { ListingDetailClient } from "./ListingDetailClient";
import { SimilarListings } from "@/components/marketplace/SimilarListings";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

async function getListing(slug: string): Promise<Listing | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("hazaral_listings")
      .select("*, dealer:hazaral_dealers(*)")
      .eq("slug", slug)
      .eq("status", "active")
      .single();

    if (error || !data) return null;
    return data as Listing;
  } catch {
    return null;
  }
}

function listingPath(locale: string, slug: string): string {
  return locale === "en" ? `/en/listings/${slug}` : `/ara/${slug}`;
}

function listingsPath(locale: string): string {
  return locale === "en" ? "/en/listings" : "/ara";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const listing = await getListing(slug);

  if (!listing) {
    return { title: "İlan Bulunamadı" };
  }

  const gradeLabel = listing.damage_grade ? GRADE_COLORS[listing.damage_grade].label : "";
  const title = `${listing.year} ${listing.brand} ${listing.model} — ${listing.damage_type.slice(0, 2).join(", ")} | Otograde`;
  const description = `${listing.city}${listing.district ? " / " + listing.district : ""} — ${listing.year} ${listing.brand} ${listing.model}. ${gradeLabel}. ${new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(listing.asking_price)} TL.`;
  const canonical = `${SITE_URL}${listingPath(locale, slug)}`;
  const ogImage = listing.primary_image || listing.images?.[0] || `${SITE_URL}/opengraph-image`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        tr: `${SITE_URL}/ara/${slug}`,
        en: `${SITE_URL}/en/listings/${slug}`,
        "x-default": `${SITE_URL}/ara/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: locale === "en" ? "en_US" : "tr_TR",
      type: "website",
    },
  };
}

function buildJsonLd(listing: Listing, locale: string) {
  const canonical = `${SITE_URL}${listingPath(locale, listing.slug)}`;
  const listingIndexUrl = `${SITE_URL}${listingsPath(locale)}`;

  // ── Product schema with vehicle-specific PropertyValue fields ─────────────
  const additionalProps = [
    ...(listing.damage_grade ? [{ "@type": "PropertyValue", name: "Otograde Derecesi", value: listing.damage_grade, description: "Otograde A–E hasar değerlendirme sistemi" }] : []),
    ...(listing.damage_type?.length ? [{ "@type": "PropertyValue", name: "Hasar Türü", value: listing.damage_type.join(", ") }] : []),
    { "@type": "PropertyValue", name: "Tramer", value: listing.has_tramer ? (listing.tramer_amount ? `${listing.tramer_amount.toLocaleString("tr-TR")} TL` : "Var") : "Yok" },
    ...(listing.color ? [{ "@type": "PropertyValue", name: "Renk", value: listing.color }] : []),
    ...(listing.district ? [{ "@type": "PropertyValue", name: "İlçe", value: listing.district }] : []),
  ];

  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.damage_description || `${listing.year} ${listing.brand} ${listing.model} — ${listing.damage_type?.join(", ")}`,
    image: listing.images?.length ? listing.images : undefined,
    url: canonical,
    sku: listing.id,
    category: "Hasarlı Araç",
    brand: { "@type": "Brand", name: listing.brand },
    model: listing.model,
    offers: {
      "@type": "Offer",
      price: listing.asking_price.toString(),
      priceCurrency: "TRY",
      priceValidUntil: listing.expires_at ? listing.expires_at.split("T")[0] : undefined,
      itemCondition: "https://schema.org/DamagedCondition",
      availability: listing.status === "active"
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      ...(listing.is_price_negotiable ? { priceSpecification: { "@type": "PriceSpecification", price: listing.asking_price, priceCurrency: "TRY", valueAddedTaxIncluded: false } } : {}),
      seller: listing.dealer ? {
        "@type": "AutoDealer",
        name: listing.dealer.company_name,
        ...(listing.dealer.is_verified ? { hasCredential: { "@type": "EducationalOccupationalCredential", credentialCategory: "Otograde Onaylı Bayi" } } : {}),
        address: { "@type": "PostalAddress", addressLocality: listing.dealer.city, addressCountry: "TR" },
        telephone: listing.dealer.phone,
        url: listing.dealer.slug ? `${SITE_URL}${locale === "en" ? "/en/dealer" : "/bayi"}/${listing.dealer.slug}` : undefined,
      } : undefined,
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Araç Tipi", value: "Hasarlı araç" },
      { "@type": "PropertyValue", name: "Model Yılı", value: String(listing.year) },
      ...(listing.km != null ? [{ "@type": "PropertyValue", name: "Kilometre", value: `${listing.km} km` }] : []),
      ...(listing.fuel_type ? [{ "@type": "PropertyValue", name: "Yakıt", value: listing.fuel_type }] : []),
      ...(listing.transmission ? [{ "@type": "PropertyValue", name: "Vites", value: listing.transmission }] : []),
      ...additionalProps,
    ],
  };

  // ── BreadcrumbList ────────────────────────────────────────────────────────
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: locale === "en" ? "Damaged Vehicle Listings" : "Hasarlı Araç İlanları", item: listingIndexUrl },
      { "@type": "ListItem", position: 3, name: listing.title, item: canonical },
    ],
  };

  // ── AutoDealer (standalone, for knowledge graph) ──────────────────────────
  const dealer = listing.dealer ? {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: listing.dealer.company_name,
    address: { "@type": "PostalAddress", addressLocality: listing.dealer.city, addressCountry: "TR" },
    telephone: listing.dealer.phone,
    ...(listing.dealer.slug ? { url: `${SITE_URL}${locale === "en" ? "/en/dealer" : "/bayi"}/${listing.dealer.slug}` } : {}),
  } : null;

  return [product, breadcrumb, ...(dealer ? [dealer] : [])];
}

export default async function ListingDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const listing = await getListing(slug);

  if (!listing) notFound();

  const schemas = buildJsonLd(listing, locale);

  return (
    <>
      <Navbar />
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <main>
        <ListingDetailClient listing={listing} dealer={listing.dealer!} locale={locale} />

        <div className="bg-surface pt-0 pb-60">
          <div className="mx-auto max-w-[1240px] px-16 md:px-24">
            <Suspense fallback={null}>
              <SimilarListings
                currentId={listing.id}
                brand={listing.brand}
                grade={listing.damage_grade}
                locale={locale}
              />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
    </>
  );
}

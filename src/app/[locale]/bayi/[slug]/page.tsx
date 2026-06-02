import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { Dealer, Listing } from "@/types/marketplace";
import { SITE_URL } from "@/lib/constants";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { Container } from "@/components/ui/Container";
import { ShieldCheck, MapPin, Phone, MessageCircle, Building2, Eye, Layers, Calendar } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { externalRoutes } from "@/lib/routes";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

async function getData(slug: string) {
  try {
    const { data: dealer, error } = await supabaseAdmin
      .from("hazaral_dealers")
      .select("*")
      .eq("slug", slug)
      .eq("is_approved", true)
      .single();

    if (error || !dealer) return null;

    const { data: listings } = await supabaseAdmin
      .from("hazaral_listings")
      .select("*, dealer:hazaral_dealers(id, company_name, city, is_verified, logo_url, slug)")
      .eq("dealer_id", dealer.id)
      .eq("status", "active")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(20);

    return { dealer: dealer as Dealer, listings: (listings as Listing[]) || [] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const result = await getData(slug);

  if (!result) return { title: "Bayi Bulunamadı" };

  const { dealer } = result;
  const title = `${dealer.company_name} — Hasarlı Araç Bayii | Otograde`;
  const description = `${dealer.company_name}, ${dealer.city} — ${dealer.total_listings} aktif ilan. Otograde onaylı hasarlı araç bayii.`;
  const canonical = `${SITE_URL}${locale === "tr" ? "" : "/en"}/bayi/${slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        tr: `${SITE_URL}/bayi/${slug}`,
        en: `${SITE_URL}/en/dealer/${slug}`,
        "x-default": `${SITE_URL}/bayi/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: locale === "en" ? "en_US" : "tr_TR",
      type: "website",
      images: dealer.logo_url ? [{ url: dealer.logo_url, width: 400, height: 400 }] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

function buildDealerJsonLd(dealer: Dealer, listings: Listing[], locale: string) {
  const canonical = `${SITE_URL}${locale === "tr" ? "" : "/en"}/bayi/${dealer.slug}`;
  const dealerSchema = {
    "@context": "https://schema.org",
    "@type": ["AutoDealer", "LocalBusiness"],
    "@id": `${canonical}#dealer`,
    name: dealer.company_name,
    description: dealer.description || `${dealer.city} hasarlı araç bayii`,
    url: canonical,
    image: dealer.logo_url || undefined,
    telephone: dealer.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: dealer.city,
      addressRegion: dealer.district || undefined,
      addressCountry: "TR",
    },
    areaServed: dealer.city,
    ...(dealer.is_verified ? {
      additionalProperty: [{
        "@type": "PropertyValue",
        name: "Otograde Doğrulama",
        value: "Onaylı Bayi",
      }],
    } : {}),
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${dealer.company_name} aktif ilanları`,
    itemListElement: listings.map((listing, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}${locale === "tr" ? "" : "/en"}/ara/${listing.slug}`,
      name: listing.title,
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Oto Grade", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Hasarlı Araç İlanları", item: `${SITE_URL}/ara` },
      { "@type": "ListItem", position: 3, name: dealer.company_name, item: canonical },
    ],
  };

  return [dealerSchema, itemList, breadcrumb];
}

export default async function DealerProfilePage({ params }: Props) {
  const { locale, slug } = await params;
  const result = await getData(slug);

  if (!result) notFound();

  const { dealer, listings } = result;
  const wa = dealer.whatsapp || dealer.phone.replace(/\D/g, "");
  const memberYear = new Date(dealer.created_at).getFullYear();
  const schemas = buildDealerJsonLd(dealer, listings, locale);

  return (
    <div className="bg-surface pb-60 pt-32">
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <Container>
        {/* Dealer header */}
        <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-24 mb-32">
          <div className="flex flex-col md:flex-row gap-20 items-start">
            {/* Logo */}
            <div className="shrink-0">
              {dealer.logo_url ? (
                <img
                  src={dealer.logo_url}
                  alt={dealer.company_name}
                  className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full object-cover border border-[0.5px] border-border-default"
                />
              ) : (
                <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[32px]">
                  {dealer.company_name[0]}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-10 mb-8">
                <h1 className="text-[24px] font-bold text-on-surface tracking-[-0.5px]">
                  {dealer.company_name}
                </h1>
                {dealer.is_verified && (
                  <span className="inline-flex items-center gap-4 bg-primary/10 text-primary text-[11px] font-semibold px-10 py-4 rounded-full">
                    <ShieldCheck size={12} /> Otograde Onaylı Bayi
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-16 text-[13px] text-muted-text mb-16">
                <span className="flex items-center gap-6">
                  <MapPin size={13} /> {dealer.city}{dealer.district ? `, ${dealer.district}` : ""}
                </span>
                <span className="flex items-center gap-6">
                  <Calendar size={13} /> {memberYear}&apos;den beri üye
                </span>
              </div>

              {dealer.description && (
                <p className="text-[13px] text-on-surface leading-relaxed max-w-[600px]">
                  {dealer.description}
                </p>
              )}
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-10 w-full md:w-[200px] shrink-0">
              <a
                href={externalRoutes.whatsapp(wa, `Merhaba, ${dealer.company_name} hakkında bilgi almak istiyorum.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-8 bg-[#25D366] text-white py-12 rounded-btn text-[13px] font-semibold hover:opacity-90 transition-opacity"
              >
                <FaWhatsapp size={16} /> WhatsApp
              </a>
              <a
                href={`tel:${dealer.phone}`}
                className="flex items-center justify-center gap-8 bg-surface-container-lowest border border-[0.5px] border-border-default text-on-surface py-12 rounded-btn text-[13px] font-medium hover:border-primary hover:text-primary transition-colors"
              >
                <Phone size={14} /> {dealer.phone}
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-16 mt-24 pt-24 border-t border-[0.5px] border-border-default">
            <StatBox icon={<Layers size={16} />} value={dealer.total_listings} label="Aktif İlan" />
            <StatBox icon={<Eye size={16} />} value={dealer.total_views} label="Toplam Görüntülenme" />
            <StatBox icon={<MessageCircle size={16} />} value={dealer.total_contacts} label="Toplam İletişim" />
          </div>
        </div>

        {/* Listings */}
        <div>
          <div className="flex items-center justify-between mb-20">
            <h2 className="text-[18px] font-semibold text-on-surface flex items-center gap-8">
              <Building2 size={18} className="text-primary" />
              Aktif İlanlar
              <span className="text-[14px] text-muted-text font-normal">({listings.length})</span>
            </h2>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-48 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card">
              <p className="text-[14px] text-muted-text">Bu bayiye ait aktif ilan bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
              {listings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

function StatBox({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="text-primary">{icon}</div>
      <div className="text-[22px] font-bold text-on-surface">{value.toLocaleString("tr-TR")}</div>
      <div className="text-[11px] text-muted-text">{label}</div>
    </div>
  );
}

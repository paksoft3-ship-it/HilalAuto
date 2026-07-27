import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { supabaseAdmin } from "@/lib/supabase";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { ShieldCheck, MapPin, List } from "lucide-react";

export const revalidate = 1800;

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn
    ? `Verified Dealers — ${SITE_NAME}`
    : `Onaylı Bayiler — ${SITE_NAME}`;
  const description = isEn
    ? "Browse verified damaged vehicle dealers on Otograde. All dealers are approved and sell grade-rated listings."
    : "Otograde'de onaylı hasarlı araç bayilerini inceleyin. Tüm bayiler incelenmiş ve grade sistemiyle ilan yayınlamaktadır.";

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: isEn ? `${SITE_URL}/en/bayiler` : `${SITE_URL}/bayiler`,
      languages: {
        tr: `${SITE_URL}/bayiler`,
        en: `${SITE_URL}/en/bayiler`,
        "x-default": `${SITE_URL}/bayiler`,
      },
    },
  };
}

type DealerRow = {
  id: string;
  company_name: string;
  city: string;
  district: string | null;
  logo_url: string | null;
  description: string | null;
  slug: string | null;
  is_verified: boolean;
  total_listings: number;
  total_views: number;
  created_at: string;
};

export default async function BayilerPage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === "en";

  const { data: dealers } = await supabaseAdmin
    .from("hazaral_dealers")
    .select("id, company_name, city, district, logo_url, description, slug, is_verified, total_listings, total_views, created_at")
    .eq("subscription_status", "active")
    .eq("is_approved", true)
    .order("is_verified", { ascending: false })
    .order("total_listings", { ascending: false })
    .limit(60);

  const rows = (dealers || []) as DealerRow[];

  return (
    <>
      <Navbar />
      <main className="pb-[76px] md:pb-0">
        {/* Header */}
        <div className="bg-white border-b" style={{ borderColor: "#E5E5E5" }}>
          <div className="mx-auto max-w-[1240px] px-16 md:px-24 py-32 md:py-40">
            <h1 className="text-[24px] md:text-[28px] font-medium mb-8" style={{ color: "#0D0D0D" }}>
              {isEn ? "Verified Dealers" : "Onaylı Bayiler"}
            </h1>
            <p className="text-[14px]" style={{ color: "#64748B" }}>
              {isEn
                ? `${rows.length} active dealers listing grade-rated damaged vehicles`
                : `${rows.length} aktif bayi, grade sistemiyle hasarlı araç ilanı yayınlıyor`}
            </p>
          </div>
        </div>

        {/* Dealer grid */}
        <div className="mx-auto max-w-[1240px] px-16 md:px-24 py-32 md:py-40">
          {rows.length === 0 ? (
            <div className="text-center py-48" style={{ color: "#64748B" }}>
              <p className="text-[16px]">{isEn ? "No dealers found." : "Henüz kayıtlı bayi yok."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
              {rows.map((dealer) => (
                <DealerCard key={dealer.id} dealer={dealer} isEn={isEn} />
              ))}
            </div>
          )}
        </div>

        {/* Become a dealer CTA */}
        <div className="border-t py-32 md:py-40" style={{ background: "#F8F8F8", borderColor: "#E5E5E5" }}>
          <div className="mx-auto max-w-[1240px] px-16 md:px-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-16">
            <div>
              <h2 className="text-[18px] font-medium mb-4" style={{ color: "#0D0D0D" }}>
                {isEn ? "Want to list your vehicles?" : "Araçlarınızı listelemek ister misiniz?"}
              </h2>
              <p className="text-[13px]" style={{ color: "#64748B" }}>
                {isEn
                  ? "Become a verified Otograde dealer and reach thousands of buyers."
                  : "Onaylı Otograde bayisi olun, binlerce alıcıya ulaşın."}
              </p>
            </div>
            <Link
              href="/bayi-ol"
              className="inline-flex items-center justify-center px-24 py-13 rounded-[10px] text-[13px] font-medium text-white hover:opacity-90 transition-opacity shrink-0"
              style={{ background: "#C0392B" }}
            >
              {isEn ? "Become a Dealer" : "Bayi Ol"}
            </Link>
          </div>
        </div>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
    </>
  );
}

function DealerCard({ dealer, isEn }: { dealer: DealerRow; isEn: boolean }) {
  const href = dealer.slug
    ? ({ pathname: "/bayi/[slug]", params: { slug: dealer.slug } } as never)
    : ("/ara" as never);

  return (
    <article
      className="bg-white rounded-[12px] overflow-hidden hover:shadow-md transition-all duration-200"
      style={{ border: "1px solid #E5E5E5" }}
    >
      <Link href={href} className="flex flex-col h-full p-20 gap-14">
        {/* Header */}
        <div className="flex items-center gap-12">
          {dealer.logo_url ? (
            <div className="relative w-[48px] h-[48px] rounded-full overflow-hidden shrink-0" style={{ border: "1px solid #E5E5E5" }}>
              <Image
                src={dealer.logo_url}
                alt={`${dealer.company_name} logo`}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className="w-[48px] h-[48px] rounded-full flex items-center justify-center text-[18px] font-bold text-white shrink-0"
              style={{ background: "#C0392B" }}
              aria-hidden
            >
              {dealer.company_name[0]?.toUpperCase() ?? "B"}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-6">
              <h3 className="text-[14px] font-medium truncate" style={{ color: "#0D0D0D" }}>
                {dealer.company_name}
              </h3>
              {dealer.is_verified && (
                <ShieldCheck size={14} className="text-green-500 shrink-0" aria-label="Onaylı bayi" />
              )}
            </div>
            <div className="flex items-center gap-4 mt-2" style={{ color: "#64748B" }}>
              <MapPin size={11} aria-hidden />
              <span className="text-[11px]">{dealer.city}{dealer.district ? `, ${dealer.district}` : ""}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {dealer.description && (
          <p className="text-[12px] leading-relaxed line-clamp-2" style={{ color: "#64748B" }}>
            {dealer.description}
          </p>
        )}

        {/* Stats footer */}
        <div className="flex items-center gap-16 pt-12 border-t mt-auto" style={{ borderColor: "#E5E5E5" }}>
          {dealer.is_verified && (
            <span
              className="inline-flex items-center gap-4 text-[11px] font-medium"
              style={{ color: "#27AE60" }}
            >
              <ShieldCheck size={11} aria-hidden />
              {isEn ? "Verified" : "Onaylı Bayi"}
            </span>
          )}
          <span className="flex items-center gap-4 text-[11px]" style={{ color: "#64748B" }}>
            <List size={11} aria-hidden />
            {dealer.total_listings} {isEn ? "listings" : "ilan"}
          </span>
        </div>
      </Link>
    </article>
  );
}

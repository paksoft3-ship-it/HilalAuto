import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Eye, ShieldCheck, User, Car } from "lucide-react";
import { GRADE_COLORS } from "@/lib/grades";
import { findDamageFilterOption } from "@/lib/listing-filters";
import type { DamageGrade } from "@/types/marketplace";

export type CardListing = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  km: number | null;
  fuel_type: string | null;
  city: string;
  damage_grade: DamageGrade | null;
  damage_type: string[];
  asking_price: number;
  is_featured: boolean;
  primary_image: string | null;
  images: string[];
  view_count: number;
  created_at?: string;
  dealer?: { company_name: string; is_verified: boolean } | null;
};

function normalize(value: string): string {
  return value
    .toLocaleLowerCase("tr")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

export function HomepageListingCard({
  listing,
  showTimeAgo = false,
}: {
  listing: CardListing;
  showTimeAgo?: boolean;
}) {
  const t = useTranslations("marketplaceHome");
  const tListing = useTranslations("listingCard");
  const tDamage = useTranslations("damageTypeLabels");
  const coverImg = listing.primary_image || listing.images?.[0] || null;
  const gradeColor = listing.damage_grade ? GRADE_COLORS[listing.damage_grade] : null;
  const timeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return t("minutesAgo", { count: mins || 1 });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t("hoursAgo", { count: hrs });
    return t("daysAgo", { count: Math.floor(hrs / 24) });
  };
  const fuelLabel = (value: string) => {
    const known = ["benzin", "dizel", "lpg", "elektrik", "hibrit"];
    return known.includes(value) ? tListing(`fuel.${value}`) : value;
  };
  const damageLabel = (value: string) => {
    const option = findDamageFilterOption(value);
    if (option) return tDamage(option.slug);

    const normalized = normalize(value);
    if (normalized.includes("on ") || normalized.includes("onden") || normalized.includes("front")) return tDamage("front");
    if (normalized.includes("arka") || normalized.includes("rear")) return tDamage("rear");
    if (normalized.includes("yan ") || normalized.includes("yandan") || normalized.includes("side")) return tDamage("side");
    if (normalized.includes("tramer")) return tDamage("tramer");
    return value;
  };

  return (
    <article className="group bg-white border-[0.5px] border-[#EEEEEE] rounded-xl overflow-hidden hover:border-primary transition-colors">
      <Link
        href={{ pathname: "/ara/[slug]", params: { slug: listing.slug } } as never}
        className="flex flex-col h-full"
      >
        {/* Image */}
        <div className="relative h-[200px] bg-[#F3F3F4] flex items-center justify-center overflow-hidden">
          {coverImg ? (
            <Image
              src={coverImg}
              alt={`${listing.year} ${listing.brand} ${listing.model}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            <Car size={48} className="text-[#AAAAAA]" aria-hidden />
          )}

          {/* Featured badge — top left */}
          {listing.is_featured && (
            <div className="absolute top-12 left-12 px-8 py-4 bg-[rgba(17,17,17,0.8)] text-white text-[10px] font-medium rounded uppercase">
              {t("cardFeatured")}
            </div>
          )}

          {/* Grade badge — top right */}
          {gradeColor && listing.damage_grade && (
            <div
              className="absolute top-12 right-12 w-[32px] h-[32px] rounded-full flex items-center justify-center text-white text-[14px] font-medium"
              style={{ backgroundColor: gradeColor }}
              aria-label={`Grade ${listing.damage_grade}`}
            >
              {listing.damage_grade}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-16 flex flex-col gap-0 flex-1">
          <h3 className="text-[16px] font-medium text-[#111111] mb-8 line-clamp-1">
            {listing.year} {listing.brand} {listing.model}
            {listing.damage_type[0] ? ` — ${damageLabel(listing.damage_type[0])}` : ""}
          </h3>

          <div className="flex flex-wrap gap-8 mb-12">
            {listing.km !== null && (
              <Tag>{new Intl.NumberFormat("tr-TR").format(listing.km)} KM</Tag>
            )}
            {listing.fuel_type && <Tag>{fuelLabel(listing.fuel_type)}</Tag>}
            <Tag>{listing.city}</Tag>
          </div>

          <div className="text-primary text-[18px] font-medium mb-12">
            {new Intl.NumberFormat("tr-TR").format(listing.asking_price)} TL
          </div>

          <div className="pt-12 border-t-[0.5px] border-[#EEEEEE] flex justify-between items-center mt-auto">
            <div className="flex items-center gap-4">
              {listing.dealer?.is_verified ? (
                <>
                  <ShieldCheck size={14} className="text-blue-500 shrink-0" aria-hidden />
                  <span className="text-[11px] font-medium text-[#555555]">{t("verifiedDealer")}</span>
                </>
              ) : (
                <>
                  <User size={14} className="text-[#AAAAAA] shrink-0" aria-hidden />
                  <span className="text-[11px] font-medium text-[#555555] truncate max-w-[100px]">
                    {listing.dealer?.company_name || t("dealerFallback")}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-4 text-[#AAAAAA]">
              {showTimeAgo && listing.created_at ? (
                <span className="text-[11px]">{timeAgo(listing.created_at)}</span>
              ) : (
                <>
                  <Eye size={14} aria-hidden />
                  <span className="text-[11px]">{listing.view_count}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`text-[12px] text-[#888888] bg-[#F9F9F9] px-8 py-2 rounded ${className ?? ""}`}>
      {children}
    </span>
  );
}

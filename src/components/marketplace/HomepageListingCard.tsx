import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Eye } from "lucide-react";
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
  dealer?: { company_name: string; is_verified: boolean } | null;
};

const GRADE_BADGE: Record<DamageGrade, string> = {
  A: "#27AE60",
  B: "#E67E22",
  C: "#C0392B",
  D: "#94A3B8",
  E: "#CBD5E1",
};

function formatPrice(n: number) {
  return new Intl.NumberFormat("tr-TR").format(n) + " ₺";
}

export function HomepageListingCard({ listing }: { listing: CardListing }) {
  const coverImg = listing.primary_image || listing.images?.[0] || null;
  const gradeBg = listing.damage_grade ? GRADE_BADGE[listing.damage_grade] : null;

  return (
    <article
      className="group bg-white rounded-[12px] overflow-hidden transition-all duration-200 hover:shadow-md"
      style={{ border: "1px solid #E5E5E5" }}
    >
      <Link
        href={{ pathname: "/ara/[slug]", params: { slug: listing.slug } } as never}
        className="flex flex-col h-full"
      >
        {/* Image */}
        <div className="relative h-[160px] overflow-hidden" style={{ background: "#F8F8F8" }}>
          {coverImg ? (
            <Image
              src={coverImg}
              alt={`${listing.year} ${listing.brand} ${listing.model}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" aria-hidden>
                <path d="M19 17H5M19 17a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2m14 0v2a1 1 0 01-1 1H6a1 1 0 01-1-1v-2" />
                <circle cx="7.5" cy="17" r="1.5" />
                <circle cx="16.5" cy="17" r="1.5" />
                <path d="M5 11l2-4h10l2 4" />
              </svg>
            </div>
          )}

          {/* Grade badge — top left */}
          {gradeBg && listing.damage_grade && (
            <div
              className="absolute top-8 left-8 w-[26px] h-[26px] rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-sm"
              style={{ backgroundColor: gradeBg }}
              aria-label={`Grade ${listing.damage_grade}`}
            >
              {listing.damage_grade}
            </div>
          )}

          {/* Featured badge — top right */}
          {listing.is_featured && (
            <div
              className="absolute top-8 right-8 px-8 py-[3px] rounded text-[10px] font-semibold"
              style={{ background: "#0D0D0D", color: "#C0392B" }}
            >
              Öne Çıkan
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-12 flex flex-col gap-8 flex-1">
          <h3 className="text-[13px] font-medium leading-snug line-clamp-2" style={{ color: "#0D0D0D" }}>
            {listing.year} {listing.brand} {listing.model}
            {listing.damage_type[0] ? ` — ${listing.damage_type[0]}` : ""}
          </h3>

          {/* Tags */}
          <div className="flex items-center flex-wrap gap-4">
            {listing.km !== null && (
              <Tag>{new Intl.NumberFormat("tr-TR").format(listing.km)} km</Tag>
            )}
            {listing.fuel_type && <Tag className="capitalize">{listing.fuel_type}</Tag>}
            <Tag>{listing.city}</Tag>
          </div>

          {/* Price */}
          <p className="text-[15px] font-medium mt-auto" style={{ color: "#C0392B" }}>
            {formatPrice(listing.asking_price)}
          </p>

          {/* Footer */}
          <div
            className="flex items-center justify-between mt-4 pt-8 border-t"
            style={{ borderColor: "#E5E5E5" }}
          >
            <div className="flex items-center gap-6 min-w-0">
              {listing.dealer?.is_verified ? (
                <>
                  <span className="w-[6px] h-[6px] rounded-full bg-green-500 shrink-0" aria-hidden />
                  <span className="text-[11px] truncate" style={{ color: "#64748B" }}>Onaylı Bayi</span>
                </>
              ) : (
                <span className="text-[11px] truncate max-w-[120px]" style={{ color: "#64748B" }}>
                  {listing.dealer?.company_name || ""}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 shrink-0" style={{ color: "#94A3B8" }}>
              <Eye size={12} aria-hidden />
              <span className="text-[11px]">{listing.view_count}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block px-8 py-[3px] rounded text-[11px] ${className ?? ""}`}
      style={{ background: "#F8F8F8", color: "#64748B" }}
    >
      {children}
    </span>
  );
}

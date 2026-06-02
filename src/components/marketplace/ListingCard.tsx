import { Link } from "@/i18n/routing";
import { Listing } from "@/types/marketplace";
import { GradeBadge } from "./GradeBadge";
import { DamageBadge } from "./DamageBadge";
import { MapPin, Eye, Fuel, Gauge, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  listing: Listing;
  className?: string;
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatKm(km: number): string {
  return new Intl.NumberFormat("tr-TR").format(km) + " km";
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

export function ListingCard({ listing, className }: ListingCardProps) {
  const coverImg = listing.primary_image || listing.images?.[0] || null;
  const days = daysSince(listing.created_at);

  return (
    <Link
      href={{ pathname: "/ara/[slug]", params: { slug: listing.slug } } as never}
      className={cn(
        "group bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card overflow-hidden hover:border-primary hover:shadow-sm transition-all duration-200 flex flex-col",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-surface overflow-hidden">
        {coverImg ? (
          <img
            src={coverImg}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-low">
            <span className="text-[12px] text-muted-text">Fotoğraf Yok</span>
          </div>
        )}

        {/* Overlays */}
        <div className="absolute top-8 left-8 flex flex-col gap-6">
          {listing.is_featured && (
            <span className="inline-flex items-center gap-4 bg-amber-500 text-white text-[10px] font-semibold px-8 py-3 rounded-full">
              <Zap size={9} /> ÖNE ÇIKAN
            </span>
          )}
        </div>

        <div className="absolute top-8 right-8">
          <GradeBadge grade={listing.damage_grade} size="sm" />
        </div>

        {/* Image count */}
        {listing.images.length > 1 && (
          <div className="absolute bottom-8 right-8 bg-black/60 text-white text-[10px] px-6 py-3 rounded">
            {listing.images.length} fotoğraf
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-14 flex flex-col flex-1 gap-8">
        {/* Title */}
        <h3 className="text-[14px] font-semibold text-on-surface line-clamp-2 leading-snug">
          {listing.title}
        </h3>

        {/* Specs row */}
        <div className="flex items-center gap-10 text-[11px] text-muted-text flex-wrap">
          {listing.km != null && (
            <span className="flex items-center gap-4">
              <Gauge size={11} /> {formatKm(listing.km)}
            </span>
          )}
          {listing.fuel_type && (
            <span className="flex items-center gap-4">
              <Fuel size={11} /> {listing.fuel_type}
            </span>
          )}
          <span className="flex items-center gap-4">
            <MapPin size={11} /> {listing.city}
          </span>
        </div>

        {/* Damage badges */}
        {listing.damage_type.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {listing.damage_type.slice(0, 2).map((d) => (
              <DamageBadge key={d} type={d} />
            ))}
            {listing.damage_type.length > 2 && (
              <span className="text-[10px] text-muted-text self-center">
                +{listing.damage_type.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-10 border-t border-[0.5px] border-border-default flex items-center justify-between">
          <div>
            <div className="text-[16px] font-bold text-primary">{formatPrice(listing.asking_price)}</div>
            {listing.is_price_negotiable && (
              <div className="text-[10px] text-muted-text">Pazarlık payı var</div>
            )}
          </div>
          <div className="flex flex-col items-end gap-4">
            {listing.dealer?.is_verified && (
              <span className="inline-flex items-center gap-4 text-[10px] font-medium text-primary">
                <Star size={9} fill="currentColor" /> Onaylı Bayi
              </span>
            )}
            <div className="flex items-center gap-4 text-[10px] text-muted-text">
              <Eye size={10} /> {listing.view_count}
              <span className="mx-4">·</span>
              {days === 0 ? "Bugün" : `${days}g önce`}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

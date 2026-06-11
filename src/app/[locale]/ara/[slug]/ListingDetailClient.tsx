"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Listing, Dealer } from "@/types/marketplace";
import { ImageGallery } from "@/components/marketplace/ImageGallery";
import { GradeBadge, GradeBar } from "@/components/marketplace/GradeBadge";
import { DamageBadge } from "@/components/marketplace/DamageBadge";
import { ContactCard } from "@/components/marketplace/ContactCard";
import { FavoriteButton } from "@/components/marketplace/FavoriteButton";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/routing";
import {
  trackListingView,
  trackScrollDepth,
  trackTimeOnPage,
  trackImageViewed,
  setupScrollTracking,
} from "@/lib/marketplace-tracker";
import { AlertTriangle, Gauge, Fuel, Settings, Calendar, Palette, MapPin, Shield, TrendingDown, Eye } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { externalRoutes } from "@/lib/routes";
import {
  trackWhatsAppClick,
} from "@/lib/marketplace-tracker";

interface ListingDetailClientProps {
  listing: Listing;
  dealer: Dealer;
  locale?: string;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("og_session_id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("og_session_id", id);
  }
  return id;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

function formatKm(km: number) {
  return new Intl.NumberFormat("tr-TR").format(km) + " km";
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

export function ListingDetailClient({ listing, dealer, locale = "tr" }: ListingDetailClientProps) {
  const sessionId = useRef(getSessionId());
  const timeRef = useRef(0);
  const wa = dealer.whatsapp || dealer.phone.replace(/\D/g, "");
  const t = useTranslations("listingDetail");
  const tListings = useTranslations("listingsPage");
  const tGrade = useTranslations("grade");
  const fuelLabel = (value: string) => {
    const known = ["benzin", "dizel", "lpg", "elektrik", "hibrit"];
    return known.includes(value) ? tListings(`fuel.${value}`) : value;
  };
  const transmissionLabel = (value: string) => {
    const known = ["manuel", "otomatik"];
    return known.includes(value) ? tListings(`transmissionTypes.${value}`) : value;
  };
  const text = {
    home: t("home"),
    listings: t("listings"),
    views: t("views"),
    addedToday: t("addedToday"),
    daysAgo: (days: number) => t("daysAgo", { days }),
    negotiable: t("negotiable"),
    vehicleInfo: t("vehicleInfo"),
    year: t("year"),
    km: t("km"),
    fuel: t("fuel"),
    transmission: t("transmission"),
    color: t("color"),
    location: t("location"),
    damageInfo: t("damageInfo"),
    grade: t("grade"),
    tramer: t("tramer"),
    exists: t("exists"),
    none: t("none"),
    noDamageNote: t("noDamageNote"),
    warningLabel: t("warningLabel"),
    warning: t("warning"),
    whatsapp: t("whatsapp"),
    call: t("call"),
  };
  const waMessage = t("whatsappMessage", { title: listing.title, slug: listing.slug });

  // Tracking setup
  useEffect(() => {
    // 1. Track page view
    trackListingView(listing.id, dealer.id);

    // 2. Scroll depth
    const cleanupScroll = setupScrollTracking(listing.id, (pct) => {
      trackScrollDepth(listing.id, pct);
    });

    // 3. Time on page — every 30 seconds
    const interval = setInterval(() => {
      timeRef.current += 30;
      trackTimeOnPage(listing.id, timeRef.current);
    }, 30000);

    // 4. Flush time on page when leaving
    function handleVisibility() {
      if (document.visibilityState === "hidden") {
        trackTimeOnPage(listing.id, timeRef.current);
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      cleanupScroll();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [listing.id, dealer.id]);

  const days = daysSince(listing.created_at);
  const summaryItems = [
    { key: "year", icon: <Calendar size={13} />, label: text.year, value: String(listing.year) },
    listing.km != null ? { key: "km", icon: <Gauge size={13} />, label: text.km, value: formatKm(listing.km) } : null,
    listing.fuel_type ? { key: "fuel", icon: <Fuel size={13} />, label: text.fuel, value: fuelLabel(listing.fuel_type) } : null,
    { key: "location", icon: <MapPin size={13} />, label: text.location, value: `${listing.city}${listing.district ? " / " + listing.district : ""}` },
  ].filter(Boolean) as Array<{ key: string; icon: React.ReactNode; label: string; value: string }>;

  return (
    <div className="bg-surface pb-32 pt-24">
      <Container>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-8 text-[12px] text-muted-text mb-24 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">{text.home}</Link>
          <span>/</span>
          <Link href="/ara" className="hover:text-primary transition-colors">{text.listings}</Link>
          <span>/</span>
          <span className="text-on-surface truncate">{listing.title}</span>
        </nav>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-32">

          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-24">

            {/* Image gallery */}
            <ImageGallery
              images={listing.images}
              title={listing.title}
              locale={locale}
              onImageViewed={(count) => trackImageViewed(listing.id, count)}
            />

            {/* Grade + Title + Price */}
            <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-24">
              <div className="flex items-start gap-12 mb-16">
                <GradeBadge grade={listing.damage_grade} size="lg" showTooltip />
                <div className="flex-1">
                  <h1 className="text-[22px] md:text-[26px] font-bold text-on-surface leading-tight tracking-[-0.5px]">
                    {listing.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-8 mt-6 text-[12px] text-muted-text">
                    <span className="flex items-center gap-4"><Eye size={12} /> {listing.view_count} {text.views}</span>
                    <span>·</span>
                    <span>{days === 0 ? text.addedToday : text.daysAgo(days)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-14 gap-y-12 mb-16">
                {summaryItems.map((item) => (
                  <QuickSpec key={item.key} icon={item.icon} label={item.label} value={item.value} />
                ))}
              </div>

              <div className="flex flex-wrap items-end justify-between gap-12 border-t border-[0.5px] border-border-default pt-16">
                <div>
                  <div className="text-[28px] font-bold text-primary">{formatPrice(listing.asking_price)}</div>
                  {listing.is_price_negotiable && (
                    <div className="text-[12px] text-muted-text flex items-center gap-4 mt-2">
                      <TrendingDown size={12} /> {text.negotiable}
                    </div>
                  )}
                </div>
                <FavoriteButton listingId={listing.id} size="lg" showText locale={locale} />
              </div>
            </div>

            {/* Key specs grid */}
            <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-24">
              <h2 className="text-[15px] font-semibold text-on-surface mb-16">{text.vehicleInfo}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-12">
                <SpecItem icon={<Calendar size={14} />} label={text.year} value={String(listing.year)} />
                {listing.km != null && (
                  <SpecItem icon={<Gauge size={14} />} label={text.km} value={formatKm(listing.km)} />
                )}
                {listing.fuel_type && (
                  <SpecItem icon={<Fuel size={14} />} label={text.fuel} value={fuelLabel(listing.fuel_type)} />
                )}
                {listing.transmission && (
                  <SpecItem icon={<Settings size={14} />} label={text.transmission} value={transmissionLabel(listing.transmission)} />
                )}
                {listing.color && (
                  <SpecItem icon={<Palette size={14} />} label={text.color} value={listing.color} />
                )}
                <SpecItem
                  icon={<MapPin size={14} />}
                  label={text.location}
                  value={`${listing.city}${listing.district ? " / " + listing.district : ""}`}
                />
              </div>
            </div>

            {/* Damage details */}
            <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-24">
              <h2 className="text-[15px] font-semibold text-on-surface mb-16">{text.damageInfo}</h2>

              {/* Grade bar */}
              {listing.damage_grade && (
                <div className="flex items-center gap-12 mb-16">
                  <span className="text-[12px] text-muted-text w-[100px]">{text.grade}</span>
                  <GradeBar activeGrade={listing.damage_grade} />
                  <span className="text-[12px] text-muted-text ml-4">
                    {listing.damage_grade ? tGrade(`${listing.damage_grade}.description`) : ""}
                  </span>
                </div>
              )}

              {/* Damage type badges */}
              {listing.damage_type.length > 0 && (
                <div className="flex flex-wrap gap-6 mb-16">
                  {listing.damage_type.map((d) => (
                    <DamageBadge key={d} type={d} />
                  ))}
                </div>
              )}

              {/* Tramer */}
              <div className="flex items-center gap-8 text-[13px] mb-12">
                <Shield size={14} className={listing.has_tramer ? "text-orange-500" : "text-green-600"} />
                <span className="text-muted-text">{text.tramer}:</span>
                <span className={`font-medium ${listing.has_tramer ? "text-orange-600" : "text-green-600"}`}>
                  {listing.has_tramer ? `${text.exists}${listing.tramer_amount ? ` — ${formatPrice(listing.tramer_amount)}` : ""}` : text.none}
                </span>
              </div>

              {/* Damage description */}
              <div className="mt-12 bg-surface rounded-lg p-16 border border-[0.5px] border-border-default">
                <p className="text-[13px] text-on-surface leading-relaxed whitespace-pre-wrap">
                  {listing.damage_description || text.noDamageNote}
                </p>
              </div>
            </div>

            {/* Safety notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-card p-16 flex gap-12">
              <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-1" />
              <p className="text-[12px] text-amber-700 leading-relaxed">
                <strong>{text.warningLabel}</strong> {text.warning}
              </p>
            </div>
          </div>

          {/* ── RIGHT COLUMN (sticky) ── */}
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="sticky top-[76px]">
              <ContactCard listing={listing} dealer={dealer} sessionId={sessionId.current} locale={locale} />
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile sticky CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden bg-surface-container-lowest border-t border-[0.5px] border-border-default px-16 py-12 flex gap-8 pb-[calc(12px+env(safe-area-inset-bottom))]">
        <button
          onClick={async () => {
            await trackWhatsAppClick(listing.id, dealer.id);
            window.open(externalRoutes.whatsapp(wa, waMessage), "_blank", "noopener");
          }}
          className="flex-1 flex items-center justify-center gap-8 bg-[#25D366] text-white py-12 rounded-btn text-[14px] font-semibold"
        >
          <FaWhatsapp size={18} /> {text.whatsapp}
        </button>
        <a
          href={`tel:${dealer.phone}`}
          className="flex-1 flex items-center justify-center gap-8 bg-surface-container-lowest border border-[0.5px] border-border-default text-on-surface py-12 rounded-btn text-[14px] font-medium"
        >
          {text.call}
        </a>
      </div>
      {/* Spacer for mobile CTA */}
      <div className="h-[72px] lg:hidden" />
    </div>
  );
}

function QuickSpec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-5 text-[11px] text-muted-text">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div className="mt-3 truncate text-[13px] font-semibold text-on-surface capitalize">
        {value}
      </div>
    </div>
  );
}

function SpecItem({
  icon,
  label,
  value,
  capitalize,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-6 text-[11px] text-muted-text">
        {icon} {label}
      </div>
      <div className={`text-[14px] font-semibold text-on-surface ${capitalize ? "capitalize" : ""}`}>
        {value}
      </div>
    </div>
  );
}

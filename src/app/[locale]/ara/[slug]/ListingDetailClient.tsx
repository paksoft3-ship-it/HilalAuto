"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Listing, Dealer, DamageGrade } from "@/types/marketplace";
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
import {
  AlertTriangle,
  Camera,
  Calendar,
  CheckCircle2,
  Eye,
  FileText,
  Fuel,
  Gauge,
  MapPin,
  Palette,
  Printer,
  Settings,
  Shield,
  TrendingDown,
  Wrench,
  XCircle,
  Clock,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { externalRoutes } from "@/lib/routes";
import { fireGoogleAdsConversion } from "@/lib/gtag";
import {
  trackWhatsAppClick,
} from "@/lib/marketplace-tracker";

interface ListingDetailClientProps {
  listing: Listing;
  dealer: Dealer;
  locale?: string;
}

const RECENT_STORAGE_KEY = "og_recently_viewed";

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

function saveRecentListing(listing: Listing) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(RECENT_STORAGE_KEY);
    const current = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(current) ? current : [];
    const item = {
      id: listing.id,
      slug: listing.slug,
      title: listing.title,
      asking_price: listing.asking_price,
      city: listing.city,
      primary_image: listing.primary_image || listing.images?.[0] || null,
      viewedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(
      RECENT_STORAGE_KEY,
      JSON.stringify([item, ...list.filter((entry: { id?: string }) => entry.id !== listing.id)].slice(0, 5))
    );
  } catch {
    // Ignore storage failures; listing tracking still runs through analytics.
  }
}

function getRepairPotential(
  grade: DamageGrade | null,
  t: (key: string) => string
): { title: string; description: string; className: string } {
  if (grade === "A" || grade === "B") {
    return {
      title: t("repairLowTitle"),
      description: t("repairLowDescription"),
      className: "border-green-200 bg-green-50 text-green-700",
    };
  }
  if (grade === "C") {
    return {
      title: t("repairMediumTitle"),
      description: t("repairMediumDescription"),
      className: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }
  return {
    title: t("repairHighTitle"),
    description: t("repairHighDescription"),
    className: "border-orange-200 bg-orange-50 text-orange-700",
  };
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
    damageType: t("damageType"),
    tramer: t("tramer"),
    exists: t("exists"),
    none: t("none"),
    noDamageNote: t("noDamageNote"),
    warningLabel: t("warningLabel"),
    warning: t("warning"),
    whatsapp: t("whatsapp"),
    call: t("call"),
    printReport: t("printReport"),
    damageChecklist: t("damageChecklist"),
    repairPotential: t("repairPotential"),
    photosAvailable: t("photosAvailable"),
    damageNoteAvailable: t("damageNoteAvailable"),
    negotiableStatus: t("negotiableStatus"),
    yes: t("yes"),
    no: t("no"),
  };
  const waMessage = t("whatsappMessage", { title: listing.title, slug: listing.slug });
  const repairPotential = getRepairPotential(listing.damage_grade, t);

  // Tracking setup
  useEffect(() => {
    // 1. Track page view
    trackListingView(listing.id, dealer.id);
    saveRecentListing(listing);

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
  }, [listing, dealer.id]);

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

        {/* Sold banner */}
        {listing.status === "sold" && (
          <div className="mb-24 flex flex-wrap items-center gap-12 rounded-card border border-red-200 bg-red-50 px-20 py-16">
            <XCircle size={20} className="text-red-600 shrink-0" />
            <div className="flex-1 min-w-[200px]">
              <div className="text-[15px] font-bold text-red-700">
                {locale === "en" ? "This vehicle has been sold" : "Bu araç satıldı"}
              </div>
              <div className="text-[13px] text-red-600">
                {locale === "en"
                  ? "Browse similar listings below or see all active listings."
                  : "Benzer ilanlara aşağıdan göz atabilir veya tüm aktif ilanları inceleyebilirsiniz."}
              </div>
            </div>
            <Link
              href="/ara"
              className="shrink-0 rounded-full bg-red-600 px-16 py-8 text-[13px] font-semibold text-white hover:bg-red-700 transition-colors"
            >
              {locale === "en" ? "Active listings" : "Aktif İlanlar"}
            </Link>
          </div>
        )}

        {/* Expired banner — page stays live so links and ranking survive */}
        {listing.status === "expired" && (
          <div className="mb-24 flex flex-wrap items-center gap-12 rounded-card border border-amber-200 bg-amber-50 px-20 py-16">
            <Clock size={20} className="text-amber-600 shrink-0" />
            <div className="flex-1 min-w-[200px]">
              <div className="text-[15px] font-bold text-amber-700">
                {locale === "en" ? "This listing has expired" : "Bu ilanın yayın süresi doldu"}
              </div>
              <div className="text-[13px] text-amber-700/80">
                {locale === "en"
                  ? "The vehicle may still be available — contact us, or browse active listings."
                  : "Araç hâlâ satılık olabilir — bize ulaşın veya aktif ilanlara göz atın."}
              </div>
            </div>
            <Link
              href="/ara"
              className="shrink-0 rounded-full bg-amber-600 px-16 py-8 text-[13px] font-semibold text-white hover:bg-amber-700 transition-colors"
            >
              {locale === "en" ? "Active listings" : "Aktif İlanlar"}
            </Link>
          </div>
        )}

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
                <div className="flex flex-wrap items-center gap-8">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center justify-center gap-8 rounded-btn border border-[0.5px] border-border-default bg-surface px-14 py-10 text-[13px] font-medium text-on-surface transition-colors hover:border-primary hover:text-primary"
                  >
                    <Printer size={14} /> {text.printReport}
                  </button>
                  <FavoriteButton listingId={listing.id} size="lg" showText locale={locale} />
                </div>
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

            {/* General description */}
            {listing.description && (
              <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-24">
                <h2 className="text-[15px] font-semibold text-on-surface mb-16">
                  {locale === "en" ? "Description" : "Açıklama"}
                </h2>
                <p className="text-[13px] text-on-surface leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>
            )}

            {/* Damage checklist */}
            <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-24">
              <h2 className="text-[15px] font-semibold text-on-surface mb-16">{text.damageChecklist}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <ChecklistItem
                  icon={<Shield size={14} />}
                  label={text.grade}
                  value={listing.damage_grade ? `${listing.damage_grade} - ${tGrade(`${listing.damage_grade}.description`)}` : "-"}
                  positive={!!listing.damage_grade}
                />
                <ChecklistItem
                  icon={<AlertTriangle size={14} />}
                  label={text.damageType}
                  value={listing.damage_type.length > 0 ? listing.damage_type.join(", ") : "-"}
                  positive={listing.damage_type.length > 0}
                />
                <ChecklistItem
                  icon={<Shield size={14} />}
                  label={text.tramer}
                  value={listing.has_tramer ? `${text.exists}${listing.tramer_amount ? ` - ${formatPrice(listing.tramer_amount)}` : ""}` : text.none}
                  positive={!listing.has_tramer}
                />
                <ChecklistItem
                  icon={<Camera size={14} />}
                  label={text.photosAvailable}
                  value={`${listing.images.length} ${text.photosAvailable}`}
                  positive={listing.images.length > 0}
                />
                <ChecklistItem
                  icon={<FileText size={14} />}
                  label={text.damageNoteAvailable}
                  value={listing.damage_description ? text.yes : text.no}
                  positive={!!listing.damage_description}
                />
                <ChecklistItem
                  icon={<TrendingDown size={14} />}
                  label={text.negotiableStatus}
                  value={listing.is_price_negotiable ? text.yes : text.no}
                  positive={listing.is_price_negotiable}
                />
              </div>
            </div>

            {/* Repair potential */}
            <div className={`rounded-card border p-16 ${repairPotential.className}`}>
              <div className="flex gap-12">
                <Wrench size={18} className="shrink-0 mt-1" />
                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-wider opacity-80">
                    {text.repairPotential}
                  </div>
                  <h2 className="mt-4 text-[16px] font-bold">{repairPotential.title}</h2>
                  <p className="mt-6 text-[13px] leading-relaxed">{repairPotential.description}</p>
                </div>
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
              {listing.status === "sold" ? (
                <div className="rounded-card border border-[0.5px] border-border-default bg-surface-container-lowest p-24 text-center">
                  <XCircle size={28} className="mx-auto mb-8 text-red-600" />
                  <div className="text-[15px] font-bold text-on-surface mb-4">
                    {locale === "en" ? "This vehicle has been sold" : "Bu araç satıldı"}
                  </div>
                  <p className="text-[13px] text-muted-text">
                    {locale === "en"
                      ? "Contact options are disabled for sold vehicles."
                      : "Satılan araçlar için iletişim seçenekleri kapalıdır."}
                  </p>
                </div>
              ) : (
                <ContactCard listing={listing} dealer={dealer} sessionId={sessionId.current} locale={locale} />
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile sticky CTA bar */}
      {listing.status !== "sold" && (
      <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden bg-surface-container-lowest border-t border-[0.5px] border-border-default px-16 py-12 flex gap-8 pb-[calc(12px+env(safe-area-inset-bottom))]">
        <button
          onClick={async () => {
            await trackWhatsAppClick(listing.id, dealer.id);
            fireGoogleAdsConversion();
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
      )}
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

function ChecklistItem({
  icon,
  label,
  value,
  positive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  positive: boolean;
}) {
  return (
    <div className="flex items-start gap-10 rounded-card border border-[0.5px] border-border-default bg-surface p-12">
      <div className="mt-1 text-muted-text">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-medium text-muted-text">{label}</div>
        <div className="mt-3 text-[13px] font-semibold text-on-surface">{value}</div>
      </div>
      {positive ? (
        <CheckCircle2 size={15} className="mt-1 shrink-0 text-green-600" />
      ) : (
        <XCircle size={15} className="mt-1 shrink-0 text-orange-500" />
      )}
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

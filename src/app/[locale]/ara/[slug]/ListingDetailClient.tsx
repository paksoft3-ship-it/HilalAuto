"use client";

import { useEffect, useRef } from "react";
import { Listing, Dealer, GRADE_COLORS, GRADE_DESCRIPTIONS } from "@/types/marketplace";
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

export function ListingDetailClient({ listing, dealer }: ListingDetailClientProps) {
  const sessionId = useRef(getSessionId());
  const timeRef = useRef(0);
  const wa = dealer.whatsapp || dealer.phone.replace(/\D/g, "");
  const waMessage = `Merhaba, ${listing.title} ilanınız hakkında bilgi almak istiyorum. (İlan: ${listing.slug})`;

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

  const gradeColor = listing.damage_grade ? GRADE_COLORS[listing.damage_grade] : null;
  const days = daysSince(listing.created_at);

  return (
    <div className="bg-surface pb-32 pt-24">
      <Container>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-8 text-[12px] text-muted-text mb-20 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/ara" className="hover:text-primary transition-colors">Hasarlı Araç İlanları</Link>
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
                    <span className="flex items-center gap-4"><Eye size={12} /> {listing.view_count} görüntülenme</span>
                    <span>·</span>
                    <span>{days === 0 ? "Bugün eklendi" : `${days} gün önce eklendi`}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-end justify-between gap-12 border-t border-[0.5px] border-border-default pt-16">
                <div>
                  <div className="text-[28px] font-bold text-primary">{formatPrice(listing.asking_price)}</div>
                  {listing.is_price_negotiable && (
                    <div className="text-[12px] text-muted-text flex items-center gap-4 mt-2">
                      <TrendingDown size={12} /> Pazarlık payı var
                    </div>
                  )}
                </div>
                <FavoriteButton listingId={listing.id} size="lg" showText />
              </div>
            </div>

            {/* Key specs grid */}
            <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-24">
              <h2 className="text-[15px] font-semibold text-on-surface mb-16">Araç Bilgileri</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-12">
                <SpecItem icon={<Calendar size={14} />} label="Yıl" value={String(listing.year)} />
                {listing.km != null && (
                  <SpecItem icon={<Gauge size={14} />} label="Kilometre" value={formatKm(listing.km)} />
                )}
                {listing.fuel_type && (
                  <SpecItem icon={<Fuel size={14} />} label="Yakıt" value={listing.fuel_type} capitalize />
                )}
                {listing.transmission && (
                  <SpecItem icon={<Settings size={14} />} label="Vites" value={listing.transmission} capitalize />
                )}
                {listing.color && (
                  <SpecItem icon={<Palette size={14} />} label="Renk" value={listing.color} />
                )}
                <SpecItem
                  icon={<MapPin size={14} />}
                  label="Konum"
                  value={`${listing.city}${listing.district ? " / " + listing.district : ""}`}
                />
              </div>
            </div>

            {/* Damage details */}
            <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-24">
              <h2 className="text-[15px] font-semibold text-on-surface mb-16">Hasar Bilgileri</h2>

              {/* Grade bar */}
              {listing.damage_grade && (
                <div className="flex items-center gap-12 mb-16">
                  <span className="text-[12px] text-muted-text w-[100px]">Otograde Derecesi</span>
                  <GradeBar activeGrade={listing.damage_grade} />
                  <span className="text-[12px] text-muted-text ml-4">
                    {gradeColor ? GRADE_DESCRIPTIONS[listing.damage_grade!] : ""}
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
                <span className="text-muted-text">Tramer kaydı:</span>
                <span className={`font-medium ${listing.has_tramer ? "text-orange-600" : "text-green-600"}`}>
                  {listing.has_tramer ? `Var${listing.tramer_amount ? ` — ${formatPrice(listing.tramer_amount)}` : ""}` : "Yok"}
                </span>
              </div>

              {/* Damage description */}
              {listing.damage_description && (
                <div className="mt-12 bg-surface rounded-lg p-16 border border-[0.5px] border-border-default">
                  <p className="text-[13px] text-on-surface leading-relaxed whitespace-pre-wrap">
                    {listing.damage_description}
                  </p>
                </div>
              )}
            </div>

            {/* Safety notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-card p-16 flex gap-12">
              <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-1" />
              <p className="text-[12px] text-amber-700 leading-relaxed">
                <strong>Uyarı:</strong> Araç satın almadan önce bağımsız ekspertiz yaptırmanızı tavsiye ederiz. Otograde, ilan içeriğinin doğruluğundan sorumlu tutulamaz.
              </p>
            </div>
          </div>

          {/* ── RIGHT COLUMN (sticky) ── */}
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="sticky top-[76px]">
              <ContactCard listing={listing} dealer={dealer} sessionId={sessionId.current} />
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
          <FaWhatsapp size={18} /> WhatsApp
        </button>
        <a
          href={`tel:${dealer.phone}`}
          className="flex-1 flex items-center justify-center gap-8 bg-surface-container-lowest border border-[0.5px] border-border-default text-on-surface py-12 rounded-btn text-[14px] font-medium"
        >
          Ara
        </a>
      </div>
      {/* Spacer for mobile CTA */}
      <div className="h-[72px] lg:hidden" />
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

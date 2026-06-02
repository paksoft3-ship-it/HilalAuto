/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X, Phone, ChevronDown, Heart } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { routes, externalRoutes } from "@/lib/routes";
import { PHONE_NUMBER, WHATSAPP_NUMBER, VEHICLE_TYPES } from "@/lib/constants";
import { FaWhatsapp } from "react-icons/fa";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

// Center nav — mirrors the user-specified order
const NAV_LINKS = [
  { labelKey: "marketplace",  href: (_: string) => routes.marketplace() },
  { labelKey: "howItWorks",   href: (_: string) => routes.howItWorks() },
  { labelKey: "vehicleTypes", href: (_: string) => routes.vehicleTypes() }, // gets dropdown
  { labelKey: "cities",       href: (locale: string) => `/${locale}/sehir` as any },
  { labelKey: "blog",         href: (_: string) => routes.blog() },
  { labelKey: "about",        href: (_: string) => routes.about() },
];

function useFavoriteCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sessionId = window.localStorage.getItem("og_session_id") || window.sessionStorage.getItem("og_session_id");
    if (!sessionId) return;

    fetch(`/api/favorites?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.count) setCount(Number(data.count));
      })
      .catch(() => undefined);
  }, []);

  return count;
}

export function Navbar() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "tr";
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);
  const [vehicleTypesOpen, setVehicleTypesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const favoriteCount = useFavoriteCount();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 10);
  });

  useEffect(() => {
    if (!menuOpen) setVehicleTypesOpen(false);
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <motion.nav
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] h-[60px] bg-surface-container-lowest border-b border-[0.5px] border-border-default transition-all duration-200",
        )}
        style={scrolled ? { boxShadow: "0 1px 8px rgba(0,0,0,0.06)" } : undefined}
        aria-label="Ana navigasyon"
      >
        <div className="mx-auto max-w-[1180px] px-16 md:px-32 h-full flex items-center justify-between">

          {/* Logo */}
          <Link
            href={routes.home()}
            className="flex items-center shrink-0"
            aria-label="Oto Grade - Ana Sayfa"
          >
            <Image
              src="/images/logo/otograde-light.svg"
              alt="Oto Grade Logo"
              width={140}
              height={36}
              className="h-[36px] w-auto"
              priority
            />
          </Link>

          {/* Desktop center links */}
          <div className="hidden lg:flex items-center gap-20 xl:gap-24 h-full">
            {NAV_LINKS.map((link) => {
              if (link.labelKey === "vehicleTypes") {
                return (
                  <div key={link.labelKey} className="relative group h-full flex items-center">
                    <Link
                      href={link.href(locale)}
                      className="text-[13px] text-muted-text hover:text-primary transition-colors flex items-center gap-4 py-20"
                    >
                      {t(link.labelKey as never)}
                      <ChevronDown size={13} className="group-hover:rotate-180 transition-transform duration-200" />
                    </Link>
                    {/* Dropdown */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[220px] bg-surface-container-lowest border border-[0.5px] border-border-default rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col py-8 z-50">
                      {VEHICLE_TYPES.map((type) => (
                        <Link
                          key={type.slug}
                          href={routes.service(type.serviceSlug)}
                          className="px-16 py-8 text-[13px] text-muted-text hover:bg-surface hover:text-primary transition-colors"
                        >
                          {locale === "en" ? type.labelEn : type.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.labelKey}
                  href={link.href(locale)}
                  className="text-[13px] text-muted-text hover:text-primary transition-colors"
                >
                  {t(link.labelKey as never)}
                </Link>
              );
            })}
          </div>

          {/* Desktop right actions */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Language */}
            <LanguageSwitcher />

            {/* Favorites heart */}
            <Link
              href={routes.marketplace().replace("/ara", "/favoriler") as any}
              className="relative flex items-center justify-center w-[36px] h-[36px] text-muted-text hover:text-primary transition-colors rounded-btn hover:bg-surface"
              aria-label={t("favoritesLabel")}
            >
              <Heart size={18} strokeWidth={1.5} aria-hidden />
              {favoriteCount > 0 && (
                <span className="absolute -top-[2px] -right-[2px] flex items-center justify-center w-[16px] h-[16px] rounded-full bg-primary text-white text-[9px] font-bold">
                  {favoriteCount > 9 ? "9+" : favoriteCount}
                </span>
              )}
            </Link>

            {/* Phone */}
            <a
              href={externalRoutes.phone(PHONE_NUMBER)}
              className="inline-flex items-center gap-8 bg-surface-container-lowest border border-[0.5px] border-border-default text-on-surface px-14 py-8 rounded-btn text-[13px] hover:border-primary hover:text-primary transition-colors"
              aria-label={t("call")}
            >
              <Phone size={14} strokeWidth={1.5} aria-hidden />
              <span className="hidden xl:inline">{PHONE_NUMBER.replace("+90", "0")}</span>
              <span className="xl:hidden">{t("call")}</span>
            </a>

            {/* WhatsApp */}
            <a
              href={externalRoutes.whatsapp(WHATSAPP_NUMBER)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-8 bg-transparent border border-whatsapp-green text-whatsapp-green px-14 py-8 rounded-btn text-[13px] font-medium hover:bg-whatsapp-green hover:text-white transition-colors"
              aria-label={t("whatsapp")}
            >
              <FaWhatsapp size={14} aria-hidden />
              <span className="hidden xl:inline">{t("whatsapp")}</span>
            </a>

            {/* Bayi Ol — ghost outline */}
            <Link
              href={routes.becomeDealer()}
              className="inline-flex items-center justify-center border border-[0.5px] border-border-default text-on-surface px-16 py-8 rounded-btn text-[13px] hover:border-primary hover:text-primary transition-colors"
            >
              {t("becomeDealer")}
            </Link>

            {/* Araç Sat — red filled */}
            <Link
              href={routes.quote()}
              className="inline-flex items-center justify-center bg-primary text-on-primary px-20 py-8 rounded-btn text-[13px] font-medium hover:opacity-90 transition-opacity"
            >
              {t("sellVehicle")}
            </Link>
          </div>

          {/* Mobile: language + hamburger */}
          <div className="flex lg:hidden items-center gap-8">
            <div className="block md:hidden">
              <LanguageSwitcher />
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center justify-center w-[40px] h-[40px] text-on-surface rounded-btn hover:bg-surface transition-colors ml-4 md:ml-0"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              {menuOpen
                ? <X size={22} strokeWidth={1.5} aria-hidden />
                : <Menu size={22} strokeWidth={1.5} aria-hidden />
              }
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          id="mobile-menu"
          role="navigation"
          aria-label="Mobil navigasyon"
          className="fixed top-[60px] left-0 right-0 bottom-0 z-[99] bg-surface-container-lowest flex flex-col lg:hidden overflow-hidden"
        >
          {/* Scrollable links */}
          <div className="flex-1 overflow-y-auto">
            {/* İlanlar */}
            <Link
              href={routes.marketplace()}
              onClick={closeMenu}
              className="flex items-center px-24 py-16 text-[15px] text-on-surface border-b border-[0.5px] border-border-default hover:bg-surface transition-colors"
            >
              {t("marketplace")}
            </Link>

            {/* Favoriler */}
            <Link
              href={"/favoriler" as any}
              onClick={closeMenu}
              className="flex items-center justify-between px-24 py-16 text-[15px] text-on-surface border-b border-[0.5px] border-border-default hover:bg-surface transition-colors"
            >
              <span>{t("favoritesLabel")}</span>
              {favoriteCount > 0 && (
                <span className="flex items-center justify-center w-[20px] h-[20px] rounded-full bg-primary text-white text-[10px] font-bold">
                  {favoriteCount > 9 ? "9+" : favoriteCount}
                </span>
              )}
            </Link>

            {/* Nasıl Çalışır */}
            <Link
              href={routes.howItWorks()}
              onClick={closeMenu}
              className="flex items-center px-24 py-16 text-[15px] text-on-surface border-b border-[0.5px] border-border-default hover:bg-surface transition-colors"
            >
              {t("howItWorks")}
            </Link>

            {/* Araç Türleri accordion */}
            <div className="border-b border-[0.5px] border-border-default">
              <button
                type="button"
                onClick={() => setVehicleTypesOpen((v) => !v)}
                className="w-full flex items-center justify-between px-24 py-16 text-[15px] font-medium text-on-surface hover:bg-surface transition-colors"
              >
                <span>{t("vehicleTypes")}</span>
                <ChevronDown
                  size={18}
                  strokeWidth={1.5}
                  className={cn(
                    "text-muted-text transition-transform duration-200 shrink-0",
                    vehicleTypesOpen && "rotate-180"
                  )}
                  aria-hidden
                />
              </button>
              {vehicleTypesOpen && (
                <div className="grid grid-cols-2 gap-8 px-16 pb-16 pt-4 bg-surface">
                  {VEHICLE_TYPES.map((type) => (
                    <Link
                      key={type.slug}
                      href={routes.service(type.serviceSlug)}
                      onClick={closeMenu}
                      className="flex items-center justify-center px-12 py-10 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card text-[13px] font-medium text-on-surface hover:border-primary hover:text-primary transition-colors text-center"
                    >
                      {locale === "en" ? type.labelEn : type.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Şehirler */}
            <Link
              href={`/${locale}/sehir` as any}
              onClick={closeMenu}
              className="flex items-center px-24 py-16 text-[15px] text-on-surface border-b border-[0.5px] border-border-default hover:bg-surface transition-colors"
            >
              {t("cities")}
            </Link>

            {/* Blog */}
            <Link
              href={routes.blog()}
              onClick={closeMenu}
              className="flex items-center px-24 py-16 text-[15px] text-on-surface border-b border-[0.5px] border-border-default hover:bg-surface transition-colors"
            >
              {t("blog")}
            </Link>

            {/* Hakkımızda */}
            <Link
              href={routes.about()}
              onClick={closeMenu}
              className="flex items-center px-24 py-16 text-[15px] text-on-surface border-b border-[0.5px] border-border-default hover:bg-surface transition-colors"
            >
              {t("about")}
            </Link>
          </div>

          {/* Fixed CTA bar */}
          <div className="shrink-0 px-16 py-16 pb-[max(16px,env(safe-area-inset-bottom))] bg-surface border-t border-[0.5px] border-border-default flex flex-col gap-10">
            <Link
              href={routes.becomeDealer()}
              onClick={closeMenu}
              className="flex items-center justify-center w-full border border-[0.5px] border-border-default text-on-surface py-[13px] rounded-btn text-[14px] font-medium hover:border-primary hover:text-primary transition-colors"
            >
              {t("becomeDealer")}
            </Link>
            <Link
              href={routes.quote()}
              onClick={closeMenu}
              className="flex items-center justify-center w-full bg-primary text-on-primary py-[13px] rounded-btn text-[14px] font-medium hover:opacity-90 transition-opacity"
            >
              {t("sellVehicle")}
            </Link>
            <div className="grid grid-cols-2 gap-10">
              <a
                href={externalRoutes.phone(PHONE_NUMBER)}
                className="flex items-center justify-center gap-8 bg-surface-container-lowest border border-[0.5px] border-border-default py-11 rounded-btn text-[13px] font-medium text-on-surface hover:border-primary hover:text-primary transition-colors"
                aria-label={t("call")}
              >
                <Phone size={15} strokeWidth={1.5} aria-hidden />
                {t("call")}
              </a>
              <a
                href={externalRoutes.whatsapp(WHATSAPP_NUMBER)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-8 bg-transparent border border-whatsapp-green text-whatsapp-green py-11 rounded-btn text-[13px] font-medium hover:bg-whatsapp-green hover:text-white transition-colors"
                aria-label={t("whatsapp")}
              >
                <FaWhatsapp size={15} aria-hidden />
                {t("whatsapp")}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-[60px]" aria-hidden />
    </>
  );
}

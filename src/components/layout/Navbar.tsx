/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X, Phone, ChevronDown, Heart, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { routes, externalRoutes } from "@/lib/routes";
import { PHONE_NUMBER, WHATSAPP_NUMBER, VEHICLE_TYPES } from "@/lib/constants";
import { FaWhatsapp } from "react-icons/fa";

// ── Logo ─────────────────────────────────────────────────────────────────────
function OtogradeLogo() {
  return (
    <Link href={routes.home()} className="flex items-center shrink-0" aria-label="Otograde Ana Sayfa">
      <Image
        src="/images/logo/otograde-navbar.svg"
        alt="Otograde"
        width={140}
        height={36}
        className="h-[36px] w-auto"
        priority
      />
    </Link>
  );
}


// ── Favorites count from session ─────────────────────────────────────────────
function useFavoriteCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id =
      window.localStorage.getItem("og_session_id") ||
      window.sessionStorage.getItem("og_session_id");
    if (!id) return;
    fetch(`/api/favorites?session_id=${encodeURIComponent(id)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.count) setCount(Number(d.count)); })
      .catch(() => undefined);
  }, []);
  return count;
}

// ── Navbar ───────────────────────────────────────────────────────────────────
export function Navbar() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "tr";
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);
  const [vehicleTypesOpen, setVehicleTypesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const favoriteCount = useFavoriteCount();

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 10); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) setVehicleTypesOpen(false);
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        className={cn(
          "bg-white fixed top-0 w-full z-[100] border-b-[0.5px] border-[#EEEEEE] h-[60px] transition-shadow duration-200",
          scrolled && "shadow-[0_1px_8px_rgba(0,0,0,0.06)]"
        )}
        aria-label="Ana navigasyon"
      >
        <div className="flex justify-between items-center h-full px-16 md:px-32 max-w-[1180px] mx-auto">

          {/* Logo + center links group */}
          <div className="flex items-center gap-32">
            <OtogradeLogo />

            {/* Desktop center links — hardcoded to avoid next-intl Link type edge cases */}
            <div className="hidden lg:flex items-center gap-24 h-full">
              <a href="/ara" className="text-[13px] font-medium text-[#111111] hover:text-primary transition-colors">
                İlanlar
              </a>
              <a href="/nasil-calisir" className="text-[13px] font-medium text-[#111111] hover:text-primary transition-colors">
                Nasıl Çalışır
              </a>

              {/* Araç Türleri with dropdown */}
              <div className="relative group h-full flex items-center">
                <a href="/arac-turleri" className="text-[13px] font-medium text-[#111111] hover:text-primary transition-colors flex items-center gap-4">
                  Araç Türleri
                  <ChevronDown size={13} className="group-hover:rotate-180 transition-transform duration-200" />
                </a>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[220px] bg-white border-[0.5px] border-[#EEEEEE] rounded-lg shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col py-8 z-50">
                  {VEHICLE_TYPES.map((type) => (
                    <a
                      key={type.slug}
                      href={`/hizmet/${type.serviceSlug}`}
                      className="px-16 py-8 text-[13px] text-[#555555] hover:bg-[#FAFAFA] hover:text-primary transition-colors"
                    >
                      {locale === "en" ? type.labelEn : type.label}
                    </a>
                  ))}
                </div>
              </div>

              <a href="/sehir" className="text-[13px] font-medium text-[#111111] hover:text-primary transition-colors">
                Şehirler
              </a>
              <a href="/blog" className="text-[13px] font-medium text-[#111111] hover:text-primary transition-colors">
                Blog
              </a>
            </div>
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-12">
            {/* Group 1: Language + Favorites */}
            <div className="flex items-center gap-8 border-r-[0.5px] border-[#EEEEEE] pr-12">
              <button className="flex items-center gap-4 text-[#888888] hover:text-[#111111] transition-colors">
                <Globe size={16} aria-hidden />
                <span className="text-[12px] font-medium uppercase">
                  {locale === "en" ? "EN" : "TR"}
                </span>
              </button>
              <Link
                href={"/favoriler" as any}
                className="relative text-[#888888] hover:text-primary transition-colors"
                aria-label="Favoriler"
              >
                <Heart size={18} strokeWidth={1.5} aria-hidden />
                {favoriteCount > 0 && (
                  <span className="absolute -top-[3px] -right-[3px] w-[14px] h-[14px] rounded-full bg-primary text-white text-[8px] font-bold flex items-center justify-center">
                    {favoriteCount > 9 ? "9+" : favoriteCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Group 2: Phone + WhatsApp */}
            <div className="flex items-center gap-8 border-r-[0.5px] border-[#EEEEEE] pr-12">
              <a
                href={externalRoutes.phone(PHONE_NUMBER)}
                className="text-[#111111] text-[13px] font-medium hover:text-primary transition-colors hidden xl:block"
                aria-label="Telefon"
              >
                {PHONE_NUMBER.replace("+90", "0")}
              </a>
              <a
                href={externalRoutes.whatsapp(WHATSAPP_NUMBER)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-whatsapp-green hover:opacity-80 transition-opacity"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={20} aria-hidden />
              </a>
            </div>

            {/* Group 3: Bayi Ol + Araç Sat */}
            <div className="flex items-center gap-8">
              <Link
                href={routes.becomeDealer()}
                className="bg-white border-[0.5px] border-[#EEEEEE] text-[#111111] px-16 rounded-lg text-[13px] font-medium h-[40px] flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                {t("becomeDealer")}
              </Link>
              <Link
                href={routes.quote()}
                className="bg-primary text-white px-20 rounded-lg font-medium text-[13px] hover:opacity-90 transition-opacity h-[40px] flex items-center justify-center"
              >
                {t("sellVehicle")}
              </Link>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-[40px] h-[40px] text-[#111111] rounded hover:bg-[#FAFAFA] transition-colors"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          id="mobile-menu"
          role="navigation"
          aria-label="Mobil navigasyon"
          className="fixed top-[60px] left-0 right-0 bottom-0 z-[99] bg-white flex flex-col lg:hidden overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto">
            {/* İlanlar */}
            <Link href={routes.marketplace()} onClick={closeMenu} className="mobile-link">
              {t("marketplace")}
            </Link>
            {/* Favoriler */}
            <Link href={"/favoriler" as any} onClick={closeMenu} className="mobile-link flex items-center justify-between">
              <span>{t("favoritesLabel")}</span>
              {favoriteCount > 0 && (
                <span className="w-[20px] h-[20px] rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {favoriteCount > 9 ? "9+" : favoriteCount}
                </span>
              )}
            </Link>
            {/* Nasıl Çalışır */}
            <Link href={routes.howItWorks()} onClick={closeMenu} className="mobile-link">
              {t("howItWorks")}
            </Link>
            {/* Araç Türleri accordion */}
            <div className="border-b-[0.5px] border-[#EEEEEE]">
              <button
                type="button"
                onClick={() => setVehicleTypesOpen((v) => !v)}
                className="w-full flex items-center justify-between px-24 py-16 text-[15px] font-medium text-[#111111] hover:bg-[#FAFAFA] transition-colors"
              >
                <span>{t("vehicleTypes")}</span>
                <ChevronDown
                  size={18}
                  className={cn("text-[#888888] transition-transform duration-200", vehicleTypesOpen && "rotate-180")}
                />
              </button>
              {vehicleTypesOpen && (
                <div className="grid grid-cols-2 gap-8 px-16 pb-16 pt-4 bg-[#FAFAFA]">
                  {VEHICLE_TYPES.map((type) => (
                    <Link
                      key={type.slug}
                      href={routes.service(type.serviceSlug)}
                      onClick={closeMenu}
                      className="flex items-center justify-center px-12 py-10 bg-white border-[0.5px] border-[#EEEEEE] rounded-lg text-[13px] font-medium text-[#111111] hover:border-primary hover:text-primary transition-colors text-center"
                    >
                      {locale === "en" ? type.labelEn : type.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* Şehirler */}
            <Link href={"/sehir" as any} onClick={closeMenu} className="mobile-link">{t("cities")}</Link>
            {/* Blog */}
            <Link href={routes.blog()} onClick={closeMenu} className="mobile-link">{t("blog")}</Link>
          </div>

          {/* CTA bar */}
          <div className="shrink-0 px-16 py-16 pb-[max(16px,env(safe-area-inset-bottom))] bg-white border-t-[0.5px] border-[#EEEEEE] flex flex-col gap-10">
            <Link
              href={routes.becomeDealer()}
              onClick={closeMenu}
              className="flex items-center justify-center w-full border-[0.5px] border-[#EEEEEE] text-[#111111] py-[14px] rounded-lg text-[14px] font-medium hover:bg-gray-50 transition-colors"
            >
              {t("becomeDealer")}
            </Link>
            <Link
              href={routes.quote()}
              onClick={closeMenu}
              className="flex items-center justify-center w-full bg-primary text-white py-[14px] rounded-lg text-[14px] font-medium hover:opacity-90 transition-opacity"
            >
              {t("sellVehicle")}
            </Link>
            <div className="grid grid-cols-2 gap-10">
              <a
                href={externalRoutes.phone(PHONE_NUMBER)}
                className="flex items-center justify-center gap-8 border-[0.5px] border-[#EEEEEE] py-11 rounded-lg text-[13px] font-medium text-[#111111] hover:border-primary hover:text-primary transition-colors"
              >
                <Phone size={15} /> {t("call")}
              </a>
              <a
                href={externalRoutes.whatsapp(WHATSAPP_NUMBER)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-8 border border-whatsapp-green text-whatsapp-green py-11 rounded-lg text-[13px] font-medium hover:bg-whatsapp-green hover:text-white transition-colors"
              >
                <FaWhatsapp size={15} /> {t("whatsapp")}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-[60px]" aria-hidden />

      <style>{`.mobile-link{display:flex;align-items:center;padding:16px 24px;font-size:15px;color:#111111;border-bottom:0.5px solid #EEEEEE;}.mobile-link:hover{background:#FAFAFA;}`}</style>
    </>
  );
}

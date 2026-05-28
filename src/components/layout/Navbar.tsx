"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { routes, externalRoutes } from "@/lib/routes";
import { PHONE_NUMBER, WHATSAPP_NUMBER, VEHICLE_TYPES } from "@/lib/constants";
import { FaWhatsapp } from "react-icons/fa";

const NAV_LINKS = [
  { labelKey: "Nasıl Çalışır", href: (locale: string) => routes.howItWorks(locale) },
  { labelKey: "Araç Türleri", href: (locale: string) => routes.vehicleTypes(locale) },
  { labelKey: "Şehirler", href: (locale: string) => `/${locale}/sehir` },
  { labelKey: "Blog", href: (locale: string) => routes.blog(locale) },
  { labelKey: "Hakkımızda", href: (locale: string) => routes.about(locale) },
];

export function Navbar() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "tr";
  const [menuOpen, setMenuOpen] = useState(false);
  const [vehicleTypesOpen, setVehicleTypesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

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
          scrolled && "shadow-sm"
        )}
        aria-label="Ana navigasyon"
      >
        <div className="mx-auto max-w-[1180px] px-16 md:px-32 h-full flex items-center justify-between">

          {/* Logo */}
          <Link
            href={routes.home(locale)}
            className="flex items-center shrink-0"
            aria-label="HazarAl - Ana Sayfa"
          >
            <span className="font-medium text-on-surface text-[22px] tracking-[-1px]">Hazar</span>
            <span className="font-medium text-primary text-[22px] tracking-[-1px]">Al</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-24 h-full">
            {NAV_LINKS.map((link) => {
              if (link.labelKey === "Araç Türleri") {
                return (
                  <div key={link.labelKey} className="relative group h-full flex items-center">
                    <Link
                      href={link.href(locale)}
                      className="text-[13px] text-muted-text hover:text-primary transition-colors flex items-center gap-4 py-20"
                    >
                      {link.labelKey}
                      <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                    </Link>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[220px] bg-surface-container-lowest border border-[0.5px] border-border-default rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col py-8 z-50">
                      {VEHICLE_TYPES.map((type) => (
                        <Link
                          key={type.slug}
                          href={routes.service(locale, type.serviceSlug)}
                          className="px-16 py-8 text-[13px] text-muted-text hover:bg-surface hover:text-primary transition-colors text-center"
                        >
                          {type.label}
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
                  {link.labelKey}
                </Link>
              );
            })}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-12">
            <a
              href={externalRoutes.phone(PHONE_NUMBER)}
              className="inline-flex items-center gap-8 bg-surface-container-lowest border border-[0.5px] border-border-default text-on-surface px-16 py-8 rounded-btn text-[13px] hover:border-primary hover:text-primary transition-colors"
              aria-label="Bizi arayın"
            >
              <Phone size={14} strokeWidth={1.5} aria-hidden />
              <span className="hidden xl:inline">{PHONE_NUMBER.replace("+90", "0")}</span>
              <span className="xl:hidden">Ara</span>
            </a>
            <a
              href={externalRoutes.whatsapp(WHATSAPP_NUMBER)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-8 bg-transparent border border-whatsapp-green text-whatsapp-green px-16 py-8 rounded-btn text-[13px] font-medium hover:bg-whatsapp-green hover:text-white transition-colors"
              aria-label="WhatsApp ile yazın"
            >
              <FaWhatsapp size={15} aria-hidden />
              <span className="hidden xl:inline">WhatsApp</span>
            </a>
            <Link
              href={routes.quote(locale)}
              className="inline-flex items-center justify-center bg-primary text-on-primary px-24 py-8 rounded-btn text-[13px] font-medium hover:opacity-90 transition-opacity"
            >
              Teklif Al
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-[40px] h-[40px] text-on-surface rounded-btn hover:bg-surface transition-colors"
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
      </motion.nav>

      {/* Mobile drawer — full-height overlay below navbar */}
      {menuOpen && (
        <div
          id="mobile-menu"
          role="navigation"
          aria-label="Mobil navigasyon"
          className="fixed top-[60px] left-0 right-0 bottom-0 z-[99] bg-surface-container-lowest flex flex-col md:hidden overflow-hidden"
        >
          {/* Scrollable nav links */}
          <div className="flex-1 overflow-y-auto">

            {/* Nasıl Çalışır, Şehirler, Blog, Hakkımızda */}
            {NAV_LINKS.map((link) => {
              if (link.labelKey === "Araç Türleri") {
                return (
                  <div key={link.labelKey} className="border-b border-[0.5px] border-border-default">
                    {/* Accordion toggle */}
                    <button
                      type="button"
                      onClick={() => setVehicleTypesOpen((v) => !v)}
                      className="w-full flex items-center justify-between px-24 py-16 text-[15px] font-medium text-on-surface hover:bg-surface transition-colors"
                    >
                      <span>Araç Türleri</span>
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

                    {/* Collapsed vehicle type grid */}
                    {vehicleTypesOpen && (
                      <div className="grid grid-cols-2 gap-8 px-16 pb-16 pt-4 bg-surface">
                        {VEHICLE_TYPES.map((type) => (
                          <Link
                            key={type.slug}
                            href={routes.service(locale, type.serviceSlug)}
                            onClick={closeMenu}
                            className="flex items-center justify-center px-12 py-10 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card text-[13px] font-medium text-on-surface hover:border-primary hover:text-primary transition-colors text-center"
                          >
                            {type.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.labelKey}
                  href={link.href(locale)}
                  onClick={closeMenu}
                  className="flex items-center px-24 py-16 text-[15px] text-on-surface border-b border-[0.5px] border-border-default hover:bg-surface transition-colors"
                >
                  {link.labelKey}
                </Link>
              );
            })}
          </div>

          {/* Fixed CTA bar at the bottom — always fully visible */}
          <div className="shrink-0 px-16 py-16 pb-[max(16px,env(safe-area-inset-bottom))] bg-surface border-t border-[0.5px] border-border-default flex flex-col gap-10">
            <div className="grid grid-cols-2 gap-10">
              <a
                href={externalRoutes.phone(PHONE_NUMBER)}
                className="flex items-center justify-center gap-8 bg-surface-container-lowest border border-[0.5px] border-border-default py-12 rounded-btn text-[13px] font-medium text-on-surface hover:border-primary hover:text-primary transition-colors"
                aria-label="Bizi arayın"
              >
                <Phone size={15} strokeWidth={1.5} aria-hidden />
                Ara
              </a>
              <a
                href={externalRoutes.whatsapp(WHATSAPP_NUMBER)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-8 bg-transparent border border-whatsapp-green text-whatsapp-green py-12 rounded-btn text-[13px] font-medium hover:bg-whatsapp-green hover:text-white transition-colors"
                aria-label="WhatsApp ile yazın"
              >
                <FaWhatsapp size={15} aria-hidden />
                WhatsApp
              </a>
            </div>
            <Link
              href={routes.quote(locale)}
              onClick={closeMenu}
              className="flex items-center justify-center w-full bg-primary text-on-primary py-12 rounded-btn text-[14px] font-medium hover:opacity-90 transition-opacity"
            >
              Ücretsiz Teklif Al
            </Link>
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-[60px]" aria-hidden />
    </>
  );
}

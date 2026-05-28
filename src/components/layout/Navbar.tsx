"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { routes, externalRoutes } from "@/lib/routes";
import { PHONE_NUMBER, WHATSAPP_NUMBER } from "@/lib/constants";
import { FaWhatsapp } from 'react-icons/fa';

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
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 10);
  });

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] h-[60px] bg-surface-container-lowest transition-all duration-200",
          scrolled
            ? "border-b border-[0.5px] border-border-default"
            : "border-b border-[0.5px] border-border-default"
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
            <span className="font-medium text-on-surface text-[22px] tracking-[-1px]">
              Hazar
            </span>
            <span className="font-medium text-primary text-[22px] tracking-[-1px]">
              Al
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-24">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.labelKey}
                href={link.href(locale)}
                className="text-[13px] text-muted-text hover:text-primary transition-colors"
              >
                {link.labelKey}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-12">
            <a
              href={externalRoutes.phone(PHONE_NUMBER)}
              className="inline-flex items-center gap-8 bg-surface-container-lowest border border-[0.5px] border-border-default text-on-surface px-16 py-8 rounded-btn text-[13px] hover:border-primary hover:text-primary transition-colors"
              aria-label="Bizi arayın"
            >
              <Phone size={14} strokeWidth={1.5} aria-hidden />
              <span className="hidden xl:inline">
                {PHONE_NUMBER.replace("+90", "0")}
              </span>
              <span className="xl:hidden">Ara</span>
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
            className="md:hidden p-8 text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-border rounded-sm"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            {menuOpen ? (
              <X size={22} strokeWidth={1.5} aria-hidden />
            ) : (
              <Menu size={22} strokeWidth={1.5} aria-hidden />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className="absolute top-[60px] left-0 right-0 bg-surface-container-lowest border-b border-[0.5px] border-border-default md:hidden"
            role="navigation"
            aria-label="Mobil navigasyon"
          >
            <div className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.labelKey}
                  href={link.href(locale)}
                  onClick={() => setMenuOpen(false)}
                  className="px-24 py-16 text-[14px] text-on-surface border-b border-[0.5px] border-border-default hover:bg-surface transition-colors"
                >
                  {link.labelKey}
                </Link>
              ))}

              <div className="p-24 grid grid-cols-2 gap-12 bg-surface">
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
                  className="flex items-center justify-center gap-8 bg-whatsapp-green text-white py-12 rounded-btn text-[13px] font-medium hover:opacity-90 transition-opacity"
                  aria-label="WhatsApp ile yazın"
                >
                  <FaWhatsapp size={15} strokeWidth={1.5} aria-hidden />
                  WhatsApp
                </a>
                <Link
                  href={routes.quote(locale)}
                  onClick={() => setMenuOpen(false)}
                  className="col-span-2 flex items-center justify-center bg-primary text-on-primary py-16 rounded-btn text-[14px] font-medium mt-4 hover:opacity-90 transition-opacity"
                >
                  Teklif Al
                </Link>
              </div>
            </div>
          </div>
        )}
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-[60px]" aria-hidden />
    </>
  );
}

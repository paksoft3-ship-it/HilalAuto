import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { routes, externalRoutes } from "@/lib/routes";
import { PHONE_NUMBER, WHATSAPP_NUMBER, SITE_NAME, VEHICLE_TYPES } from "@/lib/constants";
import { FaWhatsapp, FaTiktok, FaInstagram, FaFacebook, FaYoutube, FaLinkedin } from 'react-icons/fa';

const SERVICES = VEHICLE_TYPES.slice(0, 6); // First 6 services

const CITIES = [
  { label: "İstanbul", slug: "istanbul" },
  { label: "Ankara", slug: "ankara" },
  { label: "İzmir", slug: "izmir" },
  { label: "Bursa", slug: "bursa" },
  { label: "Konya", slug: "konya" },
  { label: "Antalya", slug: "antalya" },
  { label: "Mersin", slug: "mersin" },
  { label: "Diyarbakır", slug: "diyarbakir" },
  { label: "Samsun", slug: "samsun" },
  { label: "Balıkesir", slug: "balikesir" },
  { label: "Hatay", slug: "hatay" },
];

interface FooterProps {
  locale?: string;
}

export function Footer({ locale = "tr" }: FooterProps) {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111111] text-white pt-60 pb-[calc(60px+env(safe-area-inset-bottom))] md:pb-0">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-44">
          {/* Brand */}
          <div className="flex flex-col gap-16">
            <Link
              href={routes.home()}
              aria-label="Oto Grade - Ana Sayfa"
              className="inline-flex items-baseline"
            >
              <Image 
                src="/images/logo/otograde-dark.svg" 
                alt="Oto Grade Logo" 
                width={140} 
                height={36} 
                className="h-[36px] w-auto"
              />
            </Link>
            <p className="text-[13px] text-[#AAAAAA] leading-relaxed max-w-[220px]">
              {t("tagline")}
            </p>
            <div className="flex flex-col gap-8 mt-4">
              <a
                href={externalRoutes.phone(PHONE_NUMBER)}
                className="inline-flex items-center gap-8 text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
                aria-label="Telefon numaramız"
              >
                <Phone size={14} strokeWidth={1.5} aria-hidden />
                {PHONE_NUMBER.replace("+90", "0")}
              </a>
              <a
                href={externalRoutes.whatsapp(WHATSAPP_NUMBER)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-8 text-[13px] text-[#AAAAAA] hover:text-whatsapp-green transition-colors"
                aria-label="WhatsApp ile yazın"
              >
                <FaWhatsapp size={14} strokeWidth={1.5} aria-hidden />
                WhatsApp
              </a>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-16 mt-8">
              <a
                href="https://www.instagram.com/otograde/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#AAAAAA] hover:text-[#E1306C] transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <span
                className="text-[#555555] cursor-not-allowed"
                aria-label={locale === "en" ? "Facebook (Coming Soon)" : "Facebook (Yakında)"}
                title={locale === "en" ? "Coming Soon" : "Yakında"}
              >
                <FaFacebook size={20} />
              </span>
              <span
                className="text-[#555555] cursor-not-allowed"
                aria-label={locale === "en" ? "YouTube (Coming Soon)" : "YouTube (Yakında)"}
                title={locale === "en" ? "Coming Soon" : "Yakında"}
              >
                <FaYoutube size={20} />
              </span>
              <span
                className="text-[#555555] cursor-not-allowed"
                aria-label={locale === "en" ? "TikTok (Coming Soon)" : "TikTok (Yakında)"}
                title={locale === "en" ? "Coming Soon" : "Yakında"}
              >
                <FaTiktok size={18} />
              </span>
              <span
                className="text-[#555555] cursor-not-allowed"
                aria-label={locale === "en" ? "LinkedIn (Coming Soon)" : "LinkedIn (Yakında)"}
                title={locale === "en" ? "Coming Soon" : "Yakında"}
              >
                <FaLinkedin size={20} />
              </span>
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-16">
            <p className="text-[13px] font-medium text-white uppercase tracking-wider">
              {t("services")}
            </p>
            <nav aria-label={t("services")}>
              <ul className="flex flex-col gap-8">
                {SERVICES.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={routes.service(s.serviceSlug)}
                      className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
                    >
                      {locale === "en" ? s.labelEn : s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Cities */}
          <div className="flex flex-col gap-16">
            <p className="text-[13px] font-medium text-white uppercase tracking-wider">
              {t("cities")}
            </p>
            <nav aria-label={t("cities")}>
              <ul className="flex flex-col gap-8">
                {CITIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={routes.city(c.slug)}
                      className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
                    >
                      {c.label} {locale === "en" ? "Damaged Vehicle" : "Hasarlı Araç"}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Marketplace + Contact */}
          <div className="flex flex-col gap-16">
            <p className="text-[13px] font-medium text-white uppercase tracking-wider">
              {locale === "en" ? "Marketplace" : "Pazaryeri"}
            </p>
            <div className="flex flex-col gap-8">
              <Link
                href={routes.marketplace()}
                className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
              >
                {locale === "en" ? "Listings" : "İlanlar"}
              </Link>
              <Link
                href={("/bayiler") as never}
                className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
              >
                {locale === "en" ? "Dealers" : "Bayiler"}
              </Link>
              <Link
                href={routes.becomeDealer()}
                className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
              >
                {locale === "en" ? "Become a Dealer" : "Bayi Ol"}
              </Link>
              <Link
                href={routes.dealerPanel()}
                className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
              >
                {locale === "en" ? "Dealer Login" : "Bayi Girişi"}
              </Link>
            </div>

            <p className="text-[13px] font-medium text-white uppercase tracking-wider mt-4">
              {t("contact")}
            </p>
            <div className="flex flex-col gap-8">
              <Link
                href={routes.contact()}
                className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
              >
                {t("contact")}
              </Link>
              <Link
                href={routes.about()}
                className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
              >
                {locale === "en" ? "About Us" : "Hakkımızda"}
              </Link>
              <Link
                href={routes.blog()}
                className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
              >
                Blog
              </Link>
            </div>

            <p className="text-[13px] font-medium text-white uppercase tracking-wider mt-8">
              {locale === "en" ? "Legal" : "Yasal"}
            </p>
            <div className="flex flex-col gap-8">
              <Link
                href={routes.kvkk()}
                className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
              >
                {t("kvkk")}
              </Link>
              <Link
                href={routes.privacy()}
                className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
              >
                {t("privacy")}
              </Link>
              <Link
                href={routes.terms()}
                className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
              >
                {t("terms")}
              </Link>
              <a
                href="/sitemap.xml"
                target="_blank"
                className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
              >
                {locale === "en" ? "Sitemap" : "Site Haritası"}
              </a>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-white/10 mt-60">
        <Container className="py-24 flex flex-col sm:flex-row items-center justify-between gap-16">
          <p className="text-[12px] text-[#888888]">
            © {year} Otograde — {locale === "en" ? "Turkey's Damaged Vehicle Marketplace" : "Türkiye'nin Hasarlı Araç Pazaryeri"}
          </p>
          <a
            href="https://paksoft.com.tr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center group text-[12px]"
          >
            <span className="text-[#888888] mr-8 group-hover:text-primary transition-colors">
              {locale === "en" ? "Developed by PakSoft" : "PakSoft tarafından geliştirildi"}
            </span>
            <div className="flex items-center text-primary group-hover:opacity-80 transition-opacity">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px] -rotate-12 mr-4">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.85 0 3.58-.5 5.08-1.38-.7.13-1.42.21-2.16.21-5.52 0-10-4.48-10-10S9.42 2.83 14.92 2.83c.74 0 1.46.08 2.16.21C15.58 2.5 13.85 2 12 2z" />
              </svg>
              <span className="font-bold text-[13px] tracking-wide">PakSoft</span>
            </div>
          </a>
        </Container>
      </div>
    </footer>
  );
}

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { routes, externalRoutes } from "@/lib/routes";
import { PHONE_NUMBER, WHATSAPP_NUMBER, VEHICLE_TYPES } from "@/lib/constants";
import { FaWhatsapp, FaTiktok, FaInstagram, FaFacebook, FaYoutube, FaLinkedin } from "react-icons/fa";

const SERVICES = VEHICLE_TYPES.slice(0, 6);

const CITIES = [
  { label: "İstanbul", slug: "istanbul" },
  { label: "Ankara",   slug: "ankara" },
  { label: "İzmir",    slug: "izmir" },
  { label: "Bursa",    slug: "bursa" },
  { label: "Konya",    slug: "konya" },
  { label: "Antalya",  slug: "antalya" },
  { label: "Mersin",   slug: "mersin" },
  { label: "Diyarbakır", slug: "diyarbakir" },
  { label: "Samsun",   slug: "samsun" },
  { label: "Balıkesir", slug: "balikesir" },
  { label: "Hatay",    slug: "hatay" },
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
            <Link href={routes.home()} aria-label="Otograde Ana Sayfa">
              <Image
                src="/images/logo/otograde-dark.svg"
                alt="Otograde"
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
                <FaWhatsapp size={14} aria-hidden />
                WhatsApp
              </a>
            </div>

            {/* Social icons */}
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
              <span className="text-[#555555] cursor-not-allowed" title={locale === "en" ? "Coming Soon" : "Yakında"}>
                <FaFacebook size={20} />
              </span>
              <span className="text-[#555555] cursor-not-allowed" title={locale === "en" ? "Coming Soon" : "Yakında"}>
                <FaYoutube size={20} />
              </span>
              <span className="text-[#555555] cursor-not-allowed" title={locale === "en" ? "Coming Soon" : "Yakında"}>
                <FaTiktok size={18} />
              </span>
              <span className="text-[#555555] cursor-not-allowed" title={locale === "en" ? "Coming Soon" : "Yakında"}>
                <FaLinkedin size={20} />
              </span>
            </div>
          </div>

          {/* Hizmetler */}
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

          {/* Şehirler */}
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

          {/* Platform + İletişim + Legal */}
          <div className="flex flex-col gap-16">
            <p className="text-[13px] font-medium text-white uppercase tracking-wider">
              Platform
            </p>
            <div className="flex flex-col gap-8">
              <Link href={routes.marketplace()} className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors">
                İlanlar
              </Link>
              <Link href={routes.becomeDealer()} className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors">
                Bayi Ol
              </Link>
              <Link href={routes.dealerPanel()} className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors">
                Bayi Girişi
              </Link>
              <Link href={routes.about()} className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors">
                {locale === "en" ? "About Us" : "Hakkımızda"}
              </Link>
              <Link href={routes.blog()} className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors">
                Blog
              </Link>
              <Link href={routes.contact()} className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors">
                {t("contact")}
              </Link>
            </div>

            <p className="text-[13px] font-medium text-white uppercase tracking-wider mt-8">
              {locale === "en" ? "Legal" : "Yasal"}
            </p>
            <div className="flex flex-col gap-8">
              <Link href={routes.kvkk()} className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors">
                {t("kvkk")}
              </Link>
              <Link href={routes.privacy()} className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors">
                {t("privacy")}
              </Link>
              <Link href={routes.terms()} className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors">
                {t("terms")}
              </Link>
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
            <span className="text-primary font-bold text-[13px] tracking-wide">PakSoft</span>
          </a>
        </Container>
      </div>
    </footer>
  );
}

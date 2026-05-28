import Link from "next/link";
import { Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { routes, externalRoutes } from "@/lib/routes";
import { PHONE_NUMBER, WHATSAPP_NUMBER, SITE_NAME } from "@/lib/constants";
import { FaWhatsapp } from 'react-icons/fa';

const SERVICES = [
  { label: "Kazalı Araç Alımı", slug: "kazali-arac-alimi" },
  { label: "Pert Araç Alımı", slug: "pert-arac-alimi" },
  { label: "Yanmış Araç Alımı", slug: "yanmis-arac-alimi" },
  { label: "Sel Hasarlı Araç Alımı", slug: "sel-hasarli-arac-alimi" },
  { label: "Hurda Araç Alımı", slug: "hurda-arac-alimi" },
  { label: "Motor Arızalı Araç Alımı", slug: "motor-arizali-arac-alimi" },
];

const CITIES = [
  { label: "İstanbul", slug: "istanbul" },
  { label: "Ankara", slug: "ankara" },
  { label: "İzmir", slug: "izmir" },
  { label: "Bursa", slug: "bursa" },
  { label: "Konya", slug: "konya" },
  { label: "Antalya", slug: "antalya" },
];

interface FooterProps {
  locale?: string;
}

export function Footer({ locale = "tr" }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111111] text-white pt-60 pb-16">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-44">
          {/* Brand */}
          <div className="flex flex-col gap-16">
            <Link
              href={routes.home(locale)}
              aria-label="HazarAl - Ana Sayfa"
              className="inline-flex items-baseline"
            >
              <span className="font-medium text-white text-[20px] tracking-[-1px]">
                Hazar
              </span>
              <span className="font-medium text-primary text-[20px] tracking-[-1px]">
                Al
              </span>
            </Link>
            <p className="text-[13px] text-[#AAAAAA] leading-relaxed max-w-[220px]">
              Hasarlı araç alım hizmetinde güvenilir adres. Türkiye genelinde hizmet.
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
          </div>

          {/* Services */}
          <div className="flex flex-col gap-16">
            <p className="text-[13px] font-medium text-white uppercase tracking-wider">
              Hizmetler
            </p>
            <nav aria-label="Hizmetler">
              <ul className="flex flex-col gap-8">
                {SERVICES.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={routes.service(locale, s.slug)}
                      className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Cities */}
          <div className="flex flex-col gap-16">
            <p className="text-[13px] font-medium text-white uppercase tracking-wider">
              Şehirler
            </p>
            <nav aria-label="Hizmet verdiğimiz şehirler">
              <ul className="flex flex-col gap-8">
                {CITIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={routes.city(locale, c.slug)}
                      className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
                    >
                      {c.label} Hasarlı Araç
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact + Legal */}
          <div className="flex flex-col gap-16">
            <p className="text-[13px] font-medium text-white uppercase tracking-wider">
              İletişim
            </p>
            <div className="flex flex-col gap-8">
              <Link
                href={routes.contact(locale)}
                className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
              >
                İletişim
              </Link>
              <Link
                href={routes.about(locale)}
                className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
              >
                Hakkımızda
              </Link>
              <Link
                href={routes.blog(locale)}
                className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
              >
                Blog
              </Link>
            </div>

            <p className="text-[13px] font-medium text-white uppercase tracking-wider mt-8">
              Yasal
            </p>
            <div className="flex flex-col gap-8">
              <Link
                href={routes.kvkk(locale)}
                className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
              >
                KVKK
              </Link>
              <Link
                href={routes.privacy(locale)}
                className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
              >
                Gizlilik Politikası
              </Link>
              <Link
                href={routes.terms(locale)}
                className="text-[13px] text-[#AAAAAA] hover:text-white transition-colors"
              >
                Kullanım Koşulları
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-white/10 mt-60">
        <Container className="py-24 flex flex-col sm:flex-row items-center justify-between gap-8">
          <p className="text-[12px] text-[#888888]">
            © {year} {SITE_NAME}. Tüm hakları saklıdır.
          </p>
          <p className="text-[12px] text-[#888888]">
            Türkiye geneli hasarlı araç alım hizmeti
          </p>
        </Container>
      </div>
    </footer>
  );
}

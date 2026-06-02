import { Link } from "@/i18n/routing";
import { routes, externalRoutes } from "@/lib/routes";
import { PHONE_NUMBER, WHATSAPP_NUMBER, VEHICLE_TYPES } from "@/lib/constants";
import { FaWhatsapp } from "react-icons/fa";

const FOOTER_SERVICES = VEHICLE_TYPES.slice(0, 4);

const FOOTER_CITIES = [
  { label: "İstanbul İlanları", slug: "istanbul" },
  { label: "Ankara İlanları", slug: "ankara" },
  { label: "İzmir İlanları", slug: "izmir" },
  { label: "Tüm Şehirler", slug: null },
];

interface FooterProps {
  locale?: string;
}

function GradeBarFooter() {
  return (
    <div className="grade-bar overflow-hidden rounded-full" style={{ width: 60 }}>
      <span style={{ backgroundColor: "#22C55E" }} />
      <span style={{ backgroundColor: "#F97316" }} />
      <span style={{ backgroundColor: "#EF4444" }} />
      <span style={{ backgroundColor: "#475569" }} />
      <span style={{ backgroundColor: "#94A3B8" }} />
    </div>
  );
}

export function Footer({ locale = "tr" }: FooterProps) {
  return (
    <footer className="w-full bg-white border-t-[0.5px] border-[#EEEEEE] pt-60 pb-[calc(60px+env(safe-area-inset-bottom))] md:pb-0">
      <div className="max-w-[1180px] mx-auto px-16 md:px-32 pb-60">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-44">

          {/* Brand col */}
          <div className="flex flex-col gap-24 lg:col-span-1">
            <Link href={routes.home()} className="flex flex-col items-start" aria-label="Otograde Ana Sayfa">
              <div className="flex items-center">
                <span className="font-medium text-[#111111] text-[22px] tracking-[-1px]">Oto</span>
                <span className="font-medium text-primary text-[22px] tracking-[-1px]">grade</span>
              </div>
              <GradeBarFooter />
            </Link>
            <p className="text-[13px] leading-relaxed text-[#888888]">
              Türkiye&apos;nin hasarlı araç pazaryeri. Grade sistemiyle şeffaf ve güvenli ticaretin adresi.
            </p>
          </div>

          {/* Platform col */}
          <div className="flex flex-col gap-20">
            <h4 className="text-[13px] font-medium text-[#111111]">Platform</h4>
            <div className="flex flex-col gap-12">
              <Link href={routes.marketplace()} className="text-[13px] text-[#888888] hover:text-primary transition-colors">
                İlanlar
              </Link>
              <Link href={routes.becomeDealer()} className="text-[13px] text-[#888888] hover:text-primary transition-colors">
                Bayi Ol
              </Link>
              <Link href={routes.dealerPanel()} className="text-[13px] text-[#888888] hover:text-primary transition-colors">
                Bayi Girişi
              </Link>
              <Link href={routes.howItWorks()} className="text-[13px] text-[#888888] hover:text-primary transition-colors">
                Nasıl Çalışır
              </Link>
            </div>
          </div>

          {/* Services col */}
          <div className="flex flex-col gap-20">
            <h4 className="text-[13px] font-medium text-[#111111]">Hizmetler</h4>
            <div className="flex flex-col gap-12">
              {FOOTER_SERVICES.map((s) => (
                <Link
                  key={s.slug}
                  href={routes.service(s.serviceSlug)}
                  className="text-[13px] text-[#888888] hover:text-primary transition-colors"
                >
                  {locale === "en" ? s.labelEn : s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Cities col */}
          <div className="flex flex-col gap-20">
            <h4 className="text-[13px] font-medium text-[#111111]">Şehirler</h4>
            <div className="flex flex-col gap-12">
              {FOOTER_CITIES.map(({ label, slug }) => (
                <Link
                  key={label}
                  href={slug ? (routes.city(slug) as never) : ("/sehir" as never)}
                  className="text-[13px] text-[#888888] hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact col */}
          <div className="flex flex-col gap-20">
            <h4 className="text-[13px] font-medium text-[#111111]">İletişim</h4>
            <div className="flex flex-col gap-12">
              <a
                href={externalRoutes.phone(PHONE_NUMBER)}
                className="text-[15px] font-medium text-[#111111] hover:text-primary transition-colors"
              >
                {PHONE_NUMBER.replace("+90", "0")}
              </a>
              <a
                href={externalRoutes.whatsapp(WHATSAPP_NUMBER)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-8 bg-whatsapp-green text-white rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity h-[40px] px-16 w-fit"
              >
                <FaWhatsapp size={16} aria-hidden />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t-[0.5px] border-[#EEEEEE] py-24">
        <div className="max-w-[1180px] mx-auto px-16 md:px-32 flex flex-col md:flex-row justify-between items-center gap-16">
          <p className="text-[12px] text-[#888888]">
            © 2026 Otograde — Türkiye&apos;nin Hasarlı Araç Pazaryeri
          </p>
          <div className="flex items-center gap-24">
            <Link href={routes.kvkk()} className="text-[12px] text-[#888888] hover:text-[#111111] transition-colors">KVKK</Link>
            <Link href={routes.privacy()} className="text-[12px] text-[#888888] hover:text-[#111111] transition-colors">Gizlilik</Link>
            <Link href={routes.terms()} className="text-[12px] text-[#888888] hover:text-[#111111] transition-colors">Kullanım Koşulları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

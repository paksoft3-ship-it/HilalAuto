import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Car, Flame, Droplets, Trash2, Wrench, FileX, AlertTriangle, ShieldAlert } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { DarkCTAForm } from "@/components/sections/DarkCTAForm";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { routes } from "@/lib/routes";
import { CITIES } from "@/lib/constants";
import { SITE_URL } from "@/lib/constants";

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = "Araç Türleri — HazarAl";
  const description = "HazarAl olarak aldığımız hasarlı araç türleri. Kazalı, pert, yanmış, sel hasarlı ve daha fazlası.";
  return {
    title, description,
    alternates: { canonical: `${SITE_URL}/${locale}/arac-turleri` },
    openGraph: { title, description, locale: locale === "tr" ? "tr_TR" : "en_US", type: "website" },
  };
}

const VEHICLE_TYPES = [
  { icon: Car, label: "Kazalı Araç", desc: "Trafik kazası sonucu hasar görmüş araçlar. Hasar derecesine bakılmaksızın değerlendirme.", slug: "kazali-arac-alimi" },
  { icon: ShieldAlert, label: "Pert Araç", desc: "Sigorta tarafından pert ilan edilmiş araçlar. Belge sürecinde destek sağlıyoruz.", slug: "pert-arac-alimi" },
  { icon: Flame, label: "Yanmış Araç", desc: "Yangın hasarı görmüş araçlar. Kısmi veya tam yangın fark etmez.", slug: "yanmis-arac-alimi" },
  { icon: Droplets, label: "Sel Hasarlı Araç", desc: "Su baskını veya sel nedeniyle zarar gören araçlar.", slug: "sel-hasarli-arac-alimi" },
  { icon: Trash2, label: "Hurda Araç", desc: "Ekonomik değerini yitirmiş, hareket edemeyen araçlar.", slug: "hurda-arac-alimi" },
  { icon: Wrench, label: "Motor Arızalı Araç", desc: "Motor veya şanzıman arızası olan araçlar.", slug: "motor-arizali-arac-alimi" },
  { icon: FileX, label: "Çekme Belgeli Araç", desc: "Çekme kaydı bulunan araçlar. Tescil sürecinde yardımcı oluyoruz.", slug: "cekme-belgeli-arac-alimi" },
  { icon: AlertTriangle, label: "Ağır Hasarlı Araç", desc: "Ciddi kaza hasarı bulunan araçlar. Araç durumunu fotoğrafla iletin.", slug: "agir-hasarli-arac-alimi" },
];

export default async function AracTurleriPage({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <Navbar />
      <main className="pb-[76px] md:pb-0">
        {/* Hero */}
        <section className="bg-bg-surface border-b border-[0.5px] border-border-default py-44 md:py-60">
          <Container className="flex flex-col items-center text-center gap-16">
            <Badge variant="accent">Araç Türleri</Badge>
            <h1 className="text-section-title-mobile md:text-[40px] font-medium tracking-heading text-text-primary max-w-[640px]">
              Her Türlü Hasarlı Aracı Değerinde Alıyoruz
            </h1>
            <p className="text-[14px] text-text-muted max-w-[520px] leading-relaxed">
              Kazalı, pert, yanmış, sel hasarlı veya arızalı fark etmez. Aracınızın durumunu bildirin, ücretsiz teklif alın.
            </p>
          </Container>
        </section>

        {/* Vehicle type cards */}
        <section className="py-44 md:py-60">
          <Container>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
              {VEHICLE_TYPES.map(({ icon: Icon, label, desc, slug }) => (
                <li key={slug}>
                  <Link href={routes.service(locale, slug)} className="group flex flex-col gap-16 p-24 bg-bg-primary border border-[0.5px] border-border-default rounded-card hover:border-accent-border hover:bg-accent-light transition-colors h-full">
                    <div className="flex items-center justify-center w-[44px] h-[44px] bg-accent-light border border-[0.5px] border-accent-border rounded-full shrink-0 group-hover:bg-white transition-colors" aria-hidden>
                      <Icon size={20} strokeWidth={1.5} className="text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-medium text-text-primary mb-8">{label}</p>
                      <p className="text-[12px] text-text-muted leading-relaxed">{desc}</p>
                    </div>
                    <div className="flex items-center gap-4 text-[12px] text-accent font-medium">
                      Detaylı Bilgi <ArrowRight size={12} strokeWidth={1.5} aria-hidden />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* City links */}
        <section className="bg-bg-surface border-y border-[0.5px] border-border-default py-44 md:py-60">
          <Container>
            <SectionHeader title="Hizmet Verdiğimiz Şehirler" subtitle="Türkiye'nin büyük şehirlerinde yerinden alım hizmeti." align="center" className="mb-32" />
            <ul className="flex flex-wrap gap-8 justify-center">
              {Object.entries(CITIES).map(([slug, name]) => (
                <li key={slug}>
                  <Link href={routes.city(locale, slug)} className="px-16 py-8 bg-white border border-[0.5px] border-border-default rounded-pill text-[13px] text-text-muted hover:border-accent hover:text-accent transition-colors">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <DarkCTAForm />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <MobileStickyCTA />
    </>
  );
}

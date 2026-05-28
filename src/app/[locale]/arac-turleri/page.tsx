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
import { routes, externalRoutes } from "@/lib/routes";
import { CITIES, WHATSAPP_NUMBER } from "@/lib/constants";
import { SITE_URL } from "@/lib/constants";
import { FaWhatsapp } from 'react-icons/fa';

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = "Hasarlı Araç Türleri — Kazalı, Pert, Hurda Araç Alımı | HazarAl";
  const description =
    "HazarAl olarak aldığımız hasarlı araç türleri: kazalı, pert, yanmış, sel hasarlı, hurda, motor arızalı ve daha fazlası. Ücretsiz teklif alın.";
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${locale}/arac-turleri` },
    openGraph: { title, description, locale: "tr_TR", type: "website" },
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/tr` },
      { "@type": "ListItem", position: 2, name: "Araç Türleri", item: `${SITE_URL}/tr/arac-turleri` },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Hasarlı Araç Türleri",
    itemListElement: VEHICLE_TYPES.map(({ label, slug }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: label,
      url: `${SITE_URL}/tr/hizmet/${slug}`,
    })),
  };

  return (
    <>
      <Navbar />
      <main className="pb-[76px] md:pb-0">
        {/* Hero */}
        <section className="bg-bg-surface border-b border-[0.5px] border-border-default py-44 md:py-60 mb-60">
          <Container>
            <div className="flex flex-col items-start gap-16 max-w-[640px] w-full">
              <Badge variant="accent">Araç Türleri</Badge>
              <h1 className="text-section-title-mobile md:text-[40px] font-medium tracking-heading text-text-primary">
                Her Türlü Hasarlı Aracı Değerinde Alıyoruz
              </h1>
              <p className="text-[14px] text-text-muted leading-relaxed">
                Kazalı, pert, yanmış, sel hasarlı veya arızalı fark etmez. Aracınızın durumunu bildirin, ücretsiz teklif alın.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-12 mt-8 w-full sm:w-auto">
                <Link
                  href={routes.quote(locale)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-8 bg-primary text-white px-32 py-16 rounded-btn font-medium text-[14px] hover:opacity-90 transition-opacity"
                >
                  Ücretsiz Teklif Al
                  <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
                </Link>
                <a
                  href={externalRoutes.whatsapp(WHATSAPP_NUMBER)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-8 bg-transparent border border-whatsapp-green text-whatsapp-green px-32 py-16 rounded-btn text-[14px] font-medium hover:bg-whatsapp-green hover:text-white transition-colors"
                  aria-label="WhatsApp ile yazın"
                >
                  <FaWhatsapp size={16} aria-hidden />
                  WhatsApp ile Yaz
                </a>
              </div>
            </div>
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
            <SectionHeader title="Hizmet Verdiğimiz Şehirler" subtitle="Türkiye'nin büyük şehirlerinde yerinden alım hizmeti." align="left" className="mb-32" />
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </>
  );
}

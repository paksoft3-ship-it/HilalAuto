import type { Metadata } from "next";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FaWhatsapp } from 'react-icons/fa';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { DarkCTAForm } from "@/components/sections/DarkCTAForm";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { routes, externalRoutes } from "@/lib/routes";
import { SITE_URL, WHATSAPP_NUMBER } from "@/lib/constants";

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = "Hakkımızda — HazarAl";
  const description = "HazarAl hakkında bilgi edinin. Türkiye genelinde hasarlı araç alım hizmetinde güvenilir adres.";
  return {
    title, description,
    alternates: { canonical: `${SITE_URL}/${locale}/hakkimizda` },
    openGraph: { title, description, locale: locale === "tr" ? "tr_TR" : "en_US", type: "website" },
  };
}

const VALUES = [
  { title: "Şeffaflık", desc: "Gizli ücret yok, net teklif, açık iletişim." },
  { title: "Hız", desc: "1 saat içinde dönüş, 24 saat içinde teslim." },
  { title: "Güven", desc: "KVKK uyumlu veri işleme, güvenli devir süreci." },
  { title: "Ulaşılabilirlik", desc: "Türkiye geneli hizmet, WhatsApp ile 7 gün iletişim." },
];

const WHAT_WE_BUY = [
  "Kazalı araçlar", "Pert araçlar", "Yanmış araçlar", "Sel hasarlı araçlar",
  "Hurda araçlar", "Motor arızalı araçlar", "Çekme belgeli araçlar", "Ağır hasarlı araçlar",
];

const STATS = [
  { value: "500+", label: "Satın alınan araç" },
  { value: "81", label: "İlde hizmet" },
  { value: "1 saat", label: "Ortalama dönüş süresi" },
  { value: "%100", label: "Şeffaf süreç" },
];

export default async function HakkimizdaPage({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <Navbar />
      <main className="pb-[76px] md:pb-0">
        {/* Hero */}
        <section className="bg-bg-surface border-b border-[0.5px] border-border-default py-44 md:py-60">
          <Container>
            <div className="flex flex-col items-start gap-16 max-w-[640px] w-full">
              <Badge variant="accent">Hakkımızda</Badge>
              <h1 className="text-section-title-mobile md:text-[40px] font-medium tracking-heading text-text-primary">
                Hasarlı Araç Alımında Türkiye&apos;nin Güvenilir Markası
              </h1>
              <p className="text-[14px] text-text-muted leading-relaxed">
                Yılların getirdiği otomotiv tecrübesiyle, hasarlı araç sahiplerine en doğru fiyatı ve en güvenli hizmeti sunuyoruz.
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

        {/* Story */}
        <section className="py-44 md:py-60">
          <Container>
            <div className="flex flex-col gap-24 text-[14px] text-muted-text leading-relaxed">
              <h2 className="text-section-title-mobile md:text-[28px] font-medium tracking-heading text-on-surface">
                Hikayemiz
              </h2>
              <p>
                HazarAl, hasarlı araç satışının ne kadar karmaşık ve stresli olabileceğini gören bir ekip tarafından kuruldu. Kazalı araç sahiplerinin galeriler, çekiciler ve sigortacılar arasında sıkışıp kaldığını fark ettik.
              </p>
              <p>
                Bu sorunu çözmek için tek bir hedefe odaklandık: hasarlı araç sahiplerine hızlı, adil ve şeffaf bir satış deneyimi sunmak. Bugün Türkiye&apos;nin her iline hizmet veriyoruz.
              </p>
            </div>
          </Container>
        </section>

        {/* Stats */}
        <section className="bg-surface-container-lowest border-y border-[0.5px] border-border-default py-44 md:py-60">
          <Container>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-24">
              {STATS.map(({ value, label }) => (
                <li key={label} className="flex flex-col items-center text-center gap-8">
                  <span className="text-[32px] font-medium tracking-heading text-primary">{value}</span>
                  <span className="text-[13px] text-muted-text">{label}</span>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Values */}
        <section className="py-44 md:py-60">
          <Container>
            <SectionHeader title="Değerlerimiz" subtitle="Her müşterimize aynı özenle yaklaşıyoruz." align="left" className="mb-32 md:mb-44" />
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16">
              {VALUES.map(({ title, desc }) => (
                <li key={title} className="flex flex-col gap-12 p-24 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card">
                  <p className="text-[15px] font-medium text-on-surface">{title}</p>
                  <p className="text-[13px] text-muted-text leading-relaxed">{desc}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* What we buy */}
        <section className="bg-surface-container-lowest border-y border-[0.5px] border-border-default py-44 md:py-60">
          <Container>
            <div className="flex flex-col lg:flex-row gap-44 items-start">
              <div className="lg:w-[360px] shrink-0">
                <SectionHeader title="Hangi Araçları Alıyoruz?" subtitle="Her türlü hasarlı araç için teklif veriyoruz." align="left" />
              </div>
              <ul className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-12">
                {WHAT_WE_BUY.map((item) => (
                  <li key={item} className="flex items-center gap-8">
                    <CheckCircle size={15} strokeWidth={1.5} className="text-primary shrink-0" aria-hidden />
                    <span className="text-[13px] text-on-surface">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        <DarkCTAForm />
        <FinalCTA />
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <MobileStickyCTA />
    </>
  );
}

import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t("aboutTitle", { default: "Hakkımızda — Oto Grade" });
  const description = t("aboutDescription", { default: "Oto Grade hakkında bilgi edinin. Türkiye genelinde hasarlı araç alım hizmetinde güvenilir adres." });
  return {
    title, description,
    alternates: { canonical: `${SITE_URL}/${locale}/hakkimizda` },
    openGraph: { title, description, locale: locale === "en" ? "en_US" : "tr_TR", type: "website" },
  };
}

export default async function HakkimizdaPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  const STATS = [
    { value: "500+", label: t("stat1", { default: "Satın alınan araç" }) },
    { value: "81", label: t("stat2", { default: "İlde hizmet" }) },
    { value: t("stat3Val", { default: "1 saat" }), label: t("stat3", { default: "Ortalama dönüş süresi" }) },
    { value: "%100", label: t("stat4", { default: "Şeffaf süreç" }) },
  ];

  const VALUES = [
    { title: t("val1Title", { default: "Şeffaflık" }), desc: t("val1Desc", { default: "Gizli ücret yok, net teklif, açık iletişim." }) },
    { title: t("val2Title", { default: "Hız" }), desc: t("val2Desc", { default: "1 saat içinde dönüş, 24 saat içinde teslim." }) },
    { title: t("val3Title", { default: "Güven" }), desc: t("val3Desc", { default: "KVKK uyumlu veri işleme, güvenli devir süreci." }) },
    { title: t("val4Title", { default: "Ulaşılabilirlik" }), desc: t("val4Desc", { default: "Türkiye geneli hizmet, WhatsApp ile 7 gün iletişim." }) },
  ];

  const WHAT_WE_BUY = [
    t("buy1", { default: "Kazalı araçlar" }), t("buy2", { default: "Pert araçlar" }), t("buy3", { default: "Yanmış araçlar" }), t("buy4", { default: "Sel hasarlı araçlar" }),
    t("buy5", { default: "Hurda araçlar" }), t("buy6", { default: "Motor arızalı araçlar" }), t("buy7", { default: "Çekme belgeli araçlar" }), t("buy8", { default: "Ağır hasarlı araçlar" }),
  ];
  return (
    <>
      <Navbar />
      <main className="pb-[76px] md:pb-0">
        {/* Hero */}
        <section className="bg-bg-surface border-b border-[0.5px] border-border-default py-44 md:py-60">
          <Container>
            <div className="flex flex-col items-start gap-16 w-full lg:w-3/4">
              <Badge variant="accent">{t("badge", { default: "Hakkımızda" })}</Badge>
              <h1 className="text-section-title-mobile md:text-[40px] font-medium tracking-heading text-text-primary">
                {t("title", { default: "Hasarlı Araç Alımında Türkiye'nin Güvenilir Markası" })}
              </h1>
              <p className="text-[14px] text-text-muted leading-relaxed">
                {t("subtitle", { default: "Yılların getirdiği otomotiv tecrübesiyle, hasarlı araç sahiplerine en doğru fiyatı ve en güvenli hizmeti sunuyoruz." })}
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-12 mt-8 w-full sm:w-auto">
                <Link
                  href={routes.quote(locale)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-8 bg-primary text-white px-32 py-16 rounded-btn font-medium text-[14px] hover:opacity-90 transition-opacity"
                >
                  {t("ctaQuote", { default: "Ücretsiz Teklif Al" })}
                  <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
                </Link>
                <a
                  href={externalRoutes.whatsapp(WHATSAPP_NUMBER)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-8 bg-transparent border border-whatsapp-green text-whatsapp-green px-32 py-16 rounded-btn text-[14px] font-medium hover:bg-whatsapp-green hover:text-white transition-colors"
                  aria-label={t("ctaWhatsapp", { default: "WhatsApp ile yazın" })}
                >
                  <FaWhatsapp size={16} aria-hidden />
                  {t("ctaWhatsapp", { default: "WhatsApp ile Yaz" })}
                </a>
              </div>
            </div>
          </Container>
        </section>

        {/* Story */}
        <section className="py-44 md:py-60">
          <Container>
            <div className="flex flex-col gap-24 text-[14px] text-muted-text leading-relaxed w-full">
              <h2 className="text-section-title-mobile md:text-[28px] font-medium tracking-heading text-on-surface">
                {t("storyTitle", { default: "Hikayemiz" })}
              </h2>
              <p>
                {t("storyP1", { default: "Oto Grade, hasarlı araç satışının ne kadar karmaşık ve stresli olabileceğini gören bir ekip tarafından kuruldu. Kazalı araç sahiplerinin galeriler, çekiciler ve sigortacılar arasında sıkışıp kaldığını fark ettik." })}
              </p>
              <p>
                {t("storyP2", { default: "Bu sorunu çözmek için tek bir hedefe odaklandık: hasarlı araç sahiplerine hızlı, adil ve şeffaf bir satış deneyimi sunmak. Bugün Türkiye'nin her iline hizmet veriyoruz." })}
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
            <SectionHeader title={t("valuesTitle", { default: "Değerlerimiz" })} subtitle={t("valuesSubtitle", { default: "Her müşterimize aynı özenle yaklaşıyoruz." })} align="left" className="mb-32 md:mb-44" />
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
                <SectionHeader title={t("buyTitle", { default: "Hangi Araçları Alıyoruz?" })} subtitle={t("buySubtitle", { default: "Her türlü hasarlı araç için teklif veriyoruz." })} align="left" />
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

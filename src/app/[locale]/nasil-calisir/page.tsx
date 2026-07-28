import { getPathname } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { CheckCircle, ArrowRight } from "lucide-react";
import { FaWhatsapp } from 'react-icons/fa';
import { Navbar } from "@/components/layout/Navbar";
import { GroupSiteBacklink } from "@/components/seo/GroupSiteBacklink";
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
import { SITE_URL, WHATSAPP_NUMBER } from "@/lib/constants";
import { localeUrl } from "@/lib/locale-url";

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t("howItWorksTitle", { default: "Nasıl Çalışır — Oto Grade" });
  const description = t("howItWorksDescription", { default: "Oto Grade ile hasarlı araç satış süreci. 6 adımda aracınızı satın, yerinden teslim ve hızlı ödeme." });
  const canonical = `${SITE_URL}${getPathname({ locale, href: "/nasil-calisir" })}`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        tr: `${SITE_URL}${getPathname({ locale: "tr", href: "/nasil-calisir" })}`,
        en: `${SITE_URL}${getPathname({ locale: "en", href: "/nasil-calisir" })}`,
        "x-default": `${SITE_URL}${getPathname({ locale: "tr", href: "/nasil-calisir" })}`,
      },
    },
    openGraph: { title, description, url: canonical, locale: locale === "en" ? "en_US" : "tr_TR", type: "website" },
  };
}

export default async function NasilCalisirPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "howItWorksPage" });

  const STEPS = [
    { num: "01", title: t("step1Title", { default: "Bilgilerinizi Gönderin" }), desc: t("step1Desc", { default: "Araç markası, hasar türü, il ve telefon numaranızı kısa form üzerinden iletın. Bağlayıcı değil, 2 dakika sürer." }), time: t("step1Time", { default: "~2 dakika" }) },
    { num: "02", title: t("step2Title", { default: "Araç Durumu Değerlendirilsin" }), desc: t("step2Desc", { default: "Uzman ekibimiz gönderdiğiniz bilgileri ve fotoğrafları inceleyerek aracınızı değerlendirir." }), time: t("step2Time", { default: "Aynı gün" }) },
    { num: "03", title: t("step3Title", { default: "Uzmanımız Sizi Arasın" }), desc: t("step3Desc", { default: "Değerleme tamamlandıktan sonra ekibimiz sizi telefonla arayarak teklif sunar." }), time: t("step3Time", { default: "1 saat içinde" }) },
    { num: "04", title: t("step4Title", { default: "Teklifinizi Alın" }), desc: t("step4Desc", { default: "Piyasa koşullarına göre belirlenen adil teklifinizi değerlendirin. Kabul etmek zorunda değilsiniz." }), time: t("step4Time", { default: "Aynı gün" }) },
    { num: "05", title: t("step5Title", { default: "Teslim ve Evrak Süreci Planlansın" }), desc: t("step5Desc", { default: "Anlaşma sağlanırsa teslim tarihi ve evrak süreci birlikte planlanır. Ekibimiz her adımda yanınızda." }), time: t("step5Time", { default: "1-2 gün" }) },
    { num: "06", title: t("step6Title", { default: "Ödeme Süreci Tamamlansın" }), desc: t("step6Desc", { default: "Araç teslimi ve devir işlemi tamamlandıktan sonra ödemeniz gerçekleştirilir." }), time: t("step6Time", { default: "Teslim günü" }) },
  ];

  const REQUIRED_INFO = [
    t("req1", { default: "Araç markası ve modeli" }), t("req2", { default: "Model yılı" }), t("req3", { default: "Hasar türü ve açıklaması" }),
    t("req4", { default: "İl ve ilçe bilgisi" }), t("req5", { default: "Telefon numarası" }), t("req6", { default: "Araç fotoğrafları (isteğe bağlı)" }),
  ];

  const TRUST_ITEMS = [
    { title: t("trust1Title", { default: "Bağlayıcı Değil" }), desc: t("trust1Desc", { default: "Teklif almak herhangi bir yükümlülük doğurmaz." }) },
    { title: t("trust2Title", { default: "Şeffaf Süreç" }), desc: t("trust2Desc", { default: "Her adımı size önceden bildiririz." }) },
    { title: t("trust3Title", { default: "Kişisel Veriler Güvende" }), desc: t("trust3Desc", { default: "Bilgileriniz KVKK kapsamında korunur." }) },
    { title: t("trust4Title", { default: "Hızlı Dönüş" }), desc: t("trust4Desc", { default: "1 saat içinde geri dönüş yapılır." }) },
  ];


  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t("schemaTitle", { default: locale === "en" ? "How to Sell Your Damaged Vehicle" : "Hasarlı Araç Nasıl Satılır?" }),
    description: t("schemaDesc", { default: locale === "en" ? "Sell your damaged vehicle in 6 simple steps with Oto Grade" : "Oto Grade ile hasarlı aracınızı 6 adımda satın" }),
    url: localeUrl(locale, locale === "en" ? "/how-it-works" : "/nasil-calisir"),
    step: STEPS.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.title,
      text: step.desc,
    })),
  };

  return (
    <>
      <Navbar />
      <main className="pb-[76px] md:pb-0">
        {/* Hero */}
        <section className="bg-bg-surface border-b border-[0.5px] border-border-default py-32 md:py-44">
          <Container>
            <div className="flex flex-col items-start gap-16 w-full lg:w-3/4">
              <Badge variant="accent">{t("badge", { default: "Nasıl Çalışır" })}</Badge>
              <h1 className="text-section-title-mobile md:text-[40px] font-medium tracking-heading text-text-primary">
                {t("title", { default: "Hasarlı Aracınızı Satmak Artık Çok Daha Kolay" })}
              </h1>
              <p className="text-[14px] text-text-muted leading-relaxed">
                {t("subtitle", { default: "Ekspertizden ödemeye kadar tüm süreci şeffaf ve güvenli bir şekilde yönetiyoruz. Siz sadece teklifimizi değerlendirin, gerisini bize bırakın." })}
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-12 mt-8 w-full sm:w-auto">
                <Link
                  href={routes.quote()}
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
        <GroupSiteBacklink variant="howItWorks" locale={locale} />

        {/* Steps */}
        <section className="py-32 md:py-44">
          <Container>
            <SectionHeader title={t("stepsTitle", { default: "6 Adımlı Süreç" })} subtitle={t("stepsSubtitle", { default: "Başvurudan ödemeye kadar her adım." })} align="left" className="mb-32" />
            <ol className="flex flex-col gap-0" aria-label={t("stepsAria", { default: "Süreç adımları" })}>
              {STEPS.map((step, i) => (
                <li key={step.num} className="flex gap-24 pb-32 relative">
                  {i < STEPS.length - 1 && (
                    <div className="absolute left-[21px] top-[44px] w-[0.5px] h-[calc(100%-20px)] bg-border-default" aria-hidden />
                  )}
                  <div className="flex items-center justify-center w-[44px] h-[44px] bg-accent-light border border-[0.5px] border-accent-border rounded-full shrink-0 text-accent text-[14px] font-medium z-10">
                    {step.num}
                  </div>
                  <div className="flex-1 pt-8">
                    <div className="flex items-center gap-12 mb-8 flex-wrap">
                      <h2 className="text-[15px] font-medium text-text-primary">{step.title}</h2>
                      <span className="px-8 py-4 bg-bg-surface border border-[0.5px] border-border-default rounded-pill text-[11px] text-text-muted font-medium">{step.time}</span>
                    </div>
                    <p className="text-[13px] text-text-muted leading-relaxed">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* Required info */}
        <section className="bg-surface-container-lowest border-y border-[0.5px] border-border-default py-32 md:py-44">
          <Container>
            <div className="flex flex-col lg:flex-row gap-24 items-start">
              <div className="lg:w-[360px] shrink-0">
                <SectionHeader title={t("reqTitle", { default: "Hangi Bilgiler Gerekli?" })} subtitle={t("reqSubtitle", { default: "Başvuru için ihtiyaç duyulan minimum bilgiler." })} align="left" />
              </div>
              <ul className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-12">
                {REQUIRED_INFO.map((item) => (
                  <li key={item} className="flex items-center gap-8">
                    <CheckCircle size={15} strokeWidth={1.5} className="text-accent shrink-0" aria-hidden />
                    <span className="text-[13px] text-text-primary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {/* Trust */}
        <section className="py-32 md:py-44">
          <Container>
            <SectionHeader title={t("trustTitle", { default: "Güvenli mi?" })} subtitle={t("trustSubtitle", { default: "Sürecimiz tamamen şeffaf ve güvenlidir." })} align="left" className="mb-32" />
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-16">
              {TRUST_ITEMS.map(({ title, desc }) => (
                <li key={title} className="flex flex-col gap-8 p-24 bg-bg-surface border border-[0.5px] border-border-default rounded-card">
                  <p className="text-[14px] font-medium text-text-primary">{title}</p>
                  <p className="text-[12px] text-text-muted leading-relaxed">{desc}</p>
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
    </>
  );
}

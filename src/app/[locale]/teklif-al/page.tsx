import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { CheckCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { SITE_URL, WHATSAPP_NUMBER } from "@/lib/constants";
import { externalRoutes } from "@/lib/routes";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t("quoteTitle", { default: "Ücretsiz Teklif Al — Oto Grade" });
  const description = t("quoteDescription", { default: "Hasarlı aracınız için ücretsiz ve bağlayıcı olmayan teklif alın. Formu doldurun, uzman ekibimiz hızlıca dönüş yapsın." });

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/teklif-al`,
    },
    openGraph: {
      title,
      description,
      locale: locale === "en" ? "en_US" : "tr_TR",
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

export default async function TeklifAlPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quote" });

  const TRUST_ITEMS = [
    t("trust1", { default: "Ücretsiz değerleme" }),
    t("trust2", { default: "Türkiye geneli hizmet" }),
    t("trust3", { default: "WhatsApp ile hızlı dönüş" }),
  ];

  const SIDEBAR_ITEMS = [
    { title: t("side1Title", { default: "Ücretsiz ve Bağlayıcı Değil" }), desc: t("side1Desc", { default: "Teklif almak için herhangi bir ücret ödemezsiniz. İstediğiniz zaman vazgeçebilirsiniz." }) },
    { title: t("side2Title", { default: "1 Saat İçinde Dönüş" }), desc: t("side2Desc", { default: "Başvurunuz alındıktan sonra uzman ekibimiz en kısa sürede sizi arar." }) },
    { title: t("side3Title", { default: "Yerinden Alım" }), desc: t("side3Desc", { default: "Aracınızı bulunduğu yerden teslim alıyoruz, sizi zor durumda bırakmıyoruz." }) },
    { title: t("side4Title", { default: "Evrak Desteği" }), desc: t("side4Desc", { default: "Devir ve noter işlemlerinde ekibimiz her adımda yanınızda." }) },
  ];

  return (
    <>
      <Navbar />
      <main className="pb-[76px] md:pb-0">
        {/* Hero */}
        <section className="bg-bg-surface border-b border-[0.5px] border-border-default py-32 md:py-44">
          <Container className="flex flex-col items-center text-center gap-16">
            <Badge variant="accent">{t("badge", { default: "Ücretsiz ve bağlayıcı olmayan teklif" })}</Badge>
            <h1 className="text-section-title-mobile md:text-[40px] font-medium tracking-heading text-text-primary w-full">
              {t("title", { default: "Hasarlı aracınız için hızlı teklif alın" })}
            </h1>
            <p className="text-[14px] text-text-muted leading-relaxed">
              {t("subtitle", { default: "Birkaç basit adımı tamamlayarak aracınızın durumunu bize iletin. Uzman ekibimiz en kısa sürede size en iyi fiyat teklifini sunacaktır." })}
            </p>
            <ul className="flex flex-col md:flex-row items-center gap-12 md:gap-24" aria-label={t("featuresAria", { default: "Öne çıkan özellikler" })}>
              {TRUST_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-8 text-[13px] text-text-muted">
                  <CheckCircle size={15} strokeWidth={1.5} className="text-accent shrink-0" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Main content */}
        <section className="py-32 md:py-44">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-32">
              {/* Form card */}
              <div className="lg:col-span-8">
                <div className="bg-white border border-[0.5px] border-border-default rounded-card-lg p-24 md:p-44">
                  <MultiStepQuoteForm />
                </div>
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 flex flex-col gap-16" aria-label={t("whyAria", { default: "Neden Oto Grade" })}>
                <div className="bg-bg-surface border border-[0.5px] border-border-default rounded-card p-24 flex flex-col gap-24">
                  <h2 className="text-[15px] font-medium text-text-primary">
                    {t("whyTitle", { default: "Neden Oto Grade?" })}
                  </h2>
                  <ul className="flex flex-col gap-20">
                    {SIDEBAR_ITEMS.map((item) => (
                      <li key={item.title} className="flex flex-col gap-4">
                        <div className="flex items-center gap-8">
                          <CheckCircle
                            size={14}
                            strokeWidth={1.5}
                            className="text-accent shrink-0"
                            aria-hidden
                          />
                          <p className="text-[13px] font-medium text-text-primary">
                            {item.title}
                          </p>
                        </div>
                        <p className="text-[12px] text-text-muted leading-relaxed pl-[22px]">
                          {item.desc}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-accent-light border border-[0.5px] border-accent-border rounded-card p-24 text-center">
                  <p className="text-[13px] text-text-muted mb-16 leading-relaxed">
                    {t("directContact", { default: "Formu doldurmak yerine doğrudan konuşmak mı istiyorsunuz?" })}
                  </p>
                  <a
                    href={externalRoutes.whatsapp(WHATSAPP_NUMBER)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-8 bg-whatsapp text-white px-16 py-12 rounded-btn text-[13px] font-medium hover:opacity-90 transition-opacity w-full"
                    aria-label={t("whatsappAria", { default: "WhatsApp ile yazın" })}
                  >
                    {t("whatsapp", { default: "WhatsApp ile Yaz" })}
                  </a>
                </div>
              </aside>
            </div>
          </Container>
        </section>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <MobileStickyCTA />
    </>
  );
}

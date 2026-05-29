import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return {
    title: t("termsTitle", { default: `Kullanım Koşulları — ${SITE_NAME}` }),
    description: t("termsDesc", { default: "Oto Grade web sitesi kullanım koşulları ve hizmet şartları." }),
    alternates: { canonical: `${SITE_URL}/${locale}/kullanim-kosullari` },
    robots: { index: false },
  };
}

export default async function KullanimKosullariPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  return (
    <>
      <Navbar />
      <main className="py-24 md:py-32 pb-[76px] md:pb-0">
        <Container narrow>
          <h1 className="text-section-title-mobile md:text-section-title font-medium tracking-heading text-text-primary mb-32">
            {t("title", { default: "Kullanım Koşulları" })}
          </h1>
          <div className="flex flex-col gap-24 text-[14px] text-text-muted leading-relaxed">
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s1Title", { default: "1. Kabul" })}</h2>
              <p>
                {t("s1Content", { default: "Bu web sitesini kullanarak aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız. Koşulları kabul etmiyorsanız siteyi kullanmayı bırakınız." })}
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s2Title", { default: "2. Hizmet Tanımı" })}</h2>
              <p>
                {t("s2Content", { default: `${SITE_NAME}, hasarlı, kazalı, pert ve ikinci el araçların satın alınmasına aracılık eden bir platformdur. Web sitesi üzerinden alınan teklifler bağlayıcı değil, ön değerlendirme niteliğindedir. Nihai teklif araç yerinde incelendikten sonra belirlenir.` })}
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s3Title", { default: "3. Teklif Formu" })}</h2>
              <p>{t("s3Desc", { default: "Teklif formu aracılığıyla gönderilen bilgiler için aşağıdaki kurallar geçerlidir:" })}</p>
              <ul className="list-disc list-inside mt-8 flex flex-col gap-4">
                <li>{t("s3i1", { default: "Gerçek ve doğru bilgi girilmesi kullanıcının sorumluluğundadır" })}</li>
                <li>{t("s3i2", { default: "Yüklenen fotoğrafların gerçeği yansıtması gerekmektedir" })}</li>
                <li>{t("s3i3", { default: "Yanıltıcı bilgi içeren başvurular değerlendirme dışı bırakılabilir" })}</li>
                <li>{t("s3i4", { default: "Form gönderimi, satış yükümlülüğü doğurmaz" })}</li>
              </ul>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s4Title", { default: "4. Sorumluluk Sınırlaması" })}</h2>
              <p>
                {t("s4Content", { default: `${SITE_NAME}, web sitesindeki bilgilerin doğruluğu, güncelliği ve eksiksizliği konusunda azami özen göstermekle birlikte, hata veya eksikliklerden kaynaklanabilecek zararlardan sorumlu tutulamaz. Site içerikleri bilgilendirme amaçlıdır.` })}
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s5Title", { default: "5. Fikri Mülkiyet" })}</h2>
              <p>
                {t("s5Content", { default: `Bu web sitesindeki tüm içerikler (metinler, görseller, logolar, tasarım) ${SITE_NAME}'a aittir ve izinsiz kopyalanamaz, dağıtılamaz veya değiştirilemez.` })}
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s6Title", { default: "6. Bağlantılı Siteler" })}</h2>
              <p>
                {t("s6Content", { default: "Web sitemiz üçüncü taraf sitelere bağlantı içerebilir. Bu sitelerin içeriklerinden ve gizlilik uygulamalarından sorumlu değiliz." })}
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s7Title", { default: "7. Değişiklikler" })}</h2>
              <p>
                {t("s7Content", { default: "Bu kullanım koşulları herhangi bir bildirim yapılmaksızın değiştirilebilir. Siteyi kullanmaya devam etmeniz, güncel koşulları kabul ettiğiniz anlamına gelir." })}
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s8Title", { default: "8. Uygulanacak Hukuk" })}</h2>
              <p>
                {t("s8Content", { default: "Bu koşullar Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda İstanbul mahkemeleri yetkilidir." })}
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer locale={locale} />
    </>
  );
}

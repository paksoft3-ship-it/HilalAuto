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
    title: t("privacyTitle", { default: `Gizlilik Politikası — ${SITE_NAME}` }),
    description: t("privacyDesc", { default: "Oto Grade gizlilik politikası ve kişisel veri işleme hakkında bilgi." }),
    alternates: { canonical: `${SITE_URL}/${locale}/gizlilik-politikasi` },
    robots: { index: false },
  };
}

export default async function GizlilikPolitikasiPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return (
    <>
      <Navbar />
      <main className="py-44 md:py-60 pb-[76px] md:pb-0">
        <Container narrow>
          <h1 className="text-section-title-mobile md:text-section-title font-medium tracking-heading text-text-primary mb-32">
            {t("title", { default: "Gizlilik Politikası" })}
          </h1>
          <div className="flex flex-col gap-24 text-[14px] text-text-muted leading-relaxed">
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s1Title", { default: "1. Genel Bilgiler" })}</h2>
              <p>
                {t("s1Content", { default: `${SITE_NAME} olarak kullanıcılarımızın gizliliğini korumak en önemli önceliğimizdir. Bu politika, web sitemizi ziyaret ettiğinizde veya hizmetlerimizi kullandığınızda toplanan bilgilerin nasıl işlendiğini açıklamaktadır.` })}
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s2Title", { default: "2. Toplanan Bilgiler" })}</h2>
              <p>{t("s2Desc", { default: "Aşağıdaki bilgiler hizmet süreçlerimiz kapsamında toplanabilir:" })}</p>
              <ul className="list-disc list-inside mt-8 flex flex-col gap-4">
                <li>{t("s2i1", { default: "Ad ve soyad bilgisi" })}</li>
                <li>{t("s2i2", { default: "Telefon numarası" })}</li>
                <li>{t("s2i3", { default: "İl ve ilçe bilgisi" })}</li>
                <li>{t("s2i4", { default: "Araç bilgileri (marka, model, yıl, hasar türü)" })}</li>
                <li>{t("s2i5", { default: "Araç fotoğrafları (isteğe bağlı yükleme)" })}</li>
              </ul>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s3Title", { default: "3. Bilgilerin Kullanımı" })}</h2>
              <p>{t("s3Desc", { default: "Toplanan bilgiler yalnızca aşağıdaki amaçlarla kullanılmaktadır:" })}</p>
              <ul className="list-disc list-inside mt-8 flex flex-col gap-4">
                <li>{t("s3i1", { default: "Aracınız için fiyat teklifi hazırlamak" })}</li>
                <li>{t("s3i2", { default: "Sizi arayarak veya mesaj göndererek bilgilendirmek" })}</li>
                <li>{t("s3i3", { default: "Hizmet kalitemizi iyileştirmek" })}</li>
                <li>{t("s3i4", { default: "Yasal yükümlülükleri yerine getirmek" })}</li>
              </ul>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s4Title", { default: "4. Bilgilerin Paylaşımı" })}</h2>
              <p>
                {t("s4Content", { default: "Kişisel verileriniz; yasal zorunluluklar ve resmi makam talepleri dışında üçüncü taraflarla paylaşılmaz, satılmaz veya kiralanmaz." })}
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s5Title", { default: "5. Çerezler (Cookies)" })}</h2>
              <p>
                {t("s5Content", { default: "Web sitemiz, kullanıcı deneyimini iyileştirmek amacıyla analitik çerezler kullanabilir. Google Analytics ve Google Ads çerezleri, anonim kullanıcı davranışlarını takip etmek için kullanılmaktadır. Çerezleri tarayıcı ayarlarınızdan devre dışı bırakabilirsiniz." })}
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s6Title", { default: "6. Veri Güvenliği" })}</h2>
              <p>
                {t("s6Content", { default: "Kişisel verilerinizi korumak için endüstri standardı güvenlik önlemleri uygulanmaktadır. Verileriniz şifreli bağlantılar üzerinden iletilmekte ve güvenli sunucularda saklanmaktadır." })}
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s7Title", { default: "7. Veri Saklama Süresi" })}</h2>
              <p>
                {t("s7Content", { default: "Kişisel verileriniz, hizmet amacının sona ermesinden itibaren yasal süreler dahilinde saklanır. Talebiniz halinde verileriniz silinebilir." })}
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s8Title", { default: "8. Haklarınız" })}</h2>
              <p>{t("s8Content", { default: "KVKK kapsamında kişisel verileriniz hakkında bilgi alma, düzeltme ve silme haklarına sahipsiniz. Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz." })}</p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s9Title", { default: "9. Değişiklikler" })}</h2>
              <p>
                {t("s9Content", { default: "Bu politika zaman zaman güncellenebilir. Önemli değişikliklerde kullanıcılar bilgilendirilecektir." })}
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer locale={locale} />
    </>
  );
}

import { getPathname } from "@/i18n/routing";
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
    title: t("kvkkTitle", { default: `KVKK Aydınlatma Metni — ${SITE_NAME}` }),
    description: t("kvkkDesc", { default: "Oto Grade KVKK Kişisel Verilerin Korunması Kanunu aydınlatma metni." }),
    alternates: { canonical: `${SITE_URL}${getPathname({ locale, href: "/kvkk" })}` },
    robots: { index: false },
  };
}

export default async function KVKKPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "kvkk" });
  return (
    <>
      <Navbar />
      <main className="py-24 md:py-32 pb-[76px] md:pb-0">
        <Container narrow>
          <h1 className="text-section-title-mobile md:text-section-title font-medium tracking-heading text-text-primary mb-32">
            {t("title", { default: "KVKK Aydınlatma Metni" })}
          </h1>
          <div className="flex flex-col gap-24 text-[14px] text-text-muted leading-relaxed">
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s1Title", { default: "1. Veri Sorumlusu" })}</h2>
              <p>
                {t("s1Content", { default: `${SITE_NAME} olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında kişisel verilerinizin işlenmesine ilişkin sizi bilgilendirmek amacıyla bu aydınlatma metnini hazırladık.` })}
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s2Title", { default: "2. İşlenen Kişisel Veriler" })}</h2>
              <p>{t("s2Desc", { default: "Hizmetlerimiz kapsamında aşağıdaki kişisel veriler işlenmektedir:" })}</p>
              <ul className="list-disc list-inside mt-8 flex flex-col gap-4">
                <li>{t("s2i1", { default: "Ad, soyad" })}</li>
                <li>{t("s2i2", { default: "Telefon numarası" })}</li>
                <li>{t("s2i3", { default: "İl ve ilçe bilgisi" })}</li>
                <li>{t("s2i4", { default: "Araç bilgileri (marka, model, yıl, hasar türü)" })}</li>
              </ul>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s3Title", { default: "3. Kişisel Verilerin İşlenme Amacı" })}</h2>
              <p>
                {t("s3Content", { default: "Kişisel verileriniz; hasarlı araç alım tekliflerinin hazırlanması, iletişim kurulması ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir." })}
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s4Title", { default: "4. Kişisel Verilerin Aktarılması" })}</h2>
              <p>
                {t("s4Content", { default: "Kişisel verileriniz, yasal zorunluluklar dışında üçüncü kişilerle paylaşılmamaktadır." })}
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s5Title", { default: "5. Haklarınız" })}</h2>
              <p>{t("s5Desc", { default: "KVKK madde 11 uyarınca aşağıdaki haklara sahipsiniz:" })}</p>
              <ul className="list-disc list-inside mt-8 flex flex-col gap-4">
                <li>{t("s5i1", { default: "Kişisel verilerinizin işlenip işlenmediğini öğrenme" })}</li>
                <li>{t("s5i2", { default: "Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme" })}</li>
                <li>{t("s5i3", { default: "Kişisel verilerinizin silinmesini veya yok edilmesini isteme" })}</li>
              </ul>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">{t("s6Title", { default: "6. İletişim" })}</h2>
              <p>
                {t("s6Content", { default: "Haklarınızı kullanmak için bizimle iletişime geçebilirsiniz. Bu metin, nihai hukuki metin değildir; hukuki danışmanlık önerilir." })}
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer locale={locale} />
    </>
  );
}

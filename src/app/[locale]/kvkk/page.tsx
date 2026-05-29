import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `KVKK Aydınlatma Metni — ${SITE_NAME}`,
    description: "Oto Grade KVKK Kişisel Verilerin Korunması Kanunu aydınlatma metni.",
    alternates: { canonical: `${SITE_URL}/${locale}/kvkk` },
    robots: { index: false },
  };
}

export default async function KVKKPage({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <Navbar />
      <main className="py-44 md:py-60 pb-[76px] md:pb-0">
        <Container narrow>
          <h1 className="text-section-title-mobile md:text-section-title font-medium tracking-heading text-text-primary mb-32">
            KVKK Aydınlatma Metni
          </h1>
          <div className="flex flex-col gap-24 text-[14px] text-text-muted leading-relaxed">
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">1. Veri Sorumlusu</h2>
              <p>
                {SITE_NAME} olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında kişisel verilerinizin işlenmesine ilişkin sizi bilgilendirmek amacıyla bu aydınlatma metnini hazırladık.
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">2. İşlenen Kişisel Veriler</h2>
              <p>Hizmetlerimiz kapsamında aşağıdaki kişisel veriler işlenmektedir:</p>
              <ul className="list-disc list-inside mt-8 flex flex-col gap-4">
                <li>Ad, soyad</li>
                <li>Telefon numarası</li>
                <li>İl ve ilçe bilgisi</li>
                <li>Araç bilgileri (marka, model, yıl, hasar türü)</li>
              </ul>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">3. Kişisel Verilerin İşlenme Amacı</h2>
              <p>
                Kişisel verileriniz; hasarlı araç alım tekliflerinin hazırlanması, iletişim kurulması ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir.
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">4. Kişisel Verilerin Aktarılması</h2>
              <p>
                Kişisel verileriniz, yasal zorunluluklar dışında üçüncü kişilerle paylaşılmamaktadır.
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">5. Haklarınız</h2>
              <p>KVKK madde 11 uyarınca aşağıdaki haklara sahipsiniz:</p>
              <ul className="list-disc list-inside mt-8 flex flex-col gap-4">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                <li>Kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
              </ul>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">6. İletişim</h2>
              <p>
                Haklarınızı kullanmak için bizimle iletişime geçebilirsiniz. Bu metin, nihai hukuki metin değildir; hukuki danışmanlık önerilir.
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer locale={locale} />
    </>
  );
}

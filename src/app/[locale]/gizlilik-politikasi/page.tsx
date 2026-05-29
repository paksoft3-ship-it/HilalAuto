import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Gizlilik Politikası — ${SITE_NAME}`,
    description: "Oto Grade gizlilik politikası ve kişisel veri işleme hakkında bilgi.",
    alternates: { canonical: `${SITE_URL}/${locale}/gizlilik-politikasi` },
    robots: { index: false },
  };
}

export default async function GizlilikPolitikasiPage({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <Navbar />
      <main className="py-44 md:py-60 pb-[76px] md:pb-0">
        <Container narrow>
          <h1 className="text-section-title-mobile md:text-section-title font-medium tracking-heading text-text-primary mb-32">
            Gizlilik Politikası
          </h1>
          <div className="flex flex-col gap-24 text-[14px] text-text-muted leading-relaxed">
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">1. Genel Bilgiler</h2>
              <p>
                {SITE_NAME} olarak kullanıcılarımızın gizliliğini korumak en önemli önceliğimizdir. Bu politika, web sitemizi ziyaret ettiğinizde veya hizmetlerimizi kullandığınızda toplanan bilgilerin nasıl işlendiğini açıklamaktadır.
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">2. Toplanan Bilgiler</h2>
              <p>Aşağıdaki bilgiler hizmet süreçlerimiz kapsamında toplanabilir:</p>
              <ul className="list-disc list-inside mt-8 flex flex-col gap-4">
                <li>Ad ve soyad bilgisi</li>
                <li>Telefon numarası</li>
                <li>İl ve ilçe bilgisi</li>
                <li>Araç bilgileri (marka, model, yıl, hasar türü)</li>
                <li>Araç fotoğrafları (isteğe bağlı yükleme)</li>
              </ul>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">3. Bilgilerin Kullanımı</h2>
              <p>Toplanan bilgiler yalnızca aşağıdaki amaçlarla kullanılmaktadır:</p>
              <ul className="list-disc list-inside mt-8 flex flex-col gap-4">
                <li>Aracınız için fiyat teklifi hazırlamak</li>
                <li>Sizi arayarak veya mesaj göndererek bilgilendirmek</li>
                <li>Hizmet kalitemizi iyileştirmek</li>
                <li>Yasal yükümlülükleri yerine getirmek</li>
              </ul>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">4. Bilgilerin Paylaşımı</h2>
              <p>
                Kişisel verileriniz; yasal zorunluluklar ve resmi makam talepleri dışında üçüncü taraflarla paylaşılmaz, satılmaz veya kiralanmaz.
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">5. Çerezler (Cookies)</h2>
              <p>
                Web sitemiz, kullanıcı deneyimini iyileştirmek amacıyla analitik çerezler kullanabilir. Google Analytics ve Google Ads çerezleri, anonim kullanıcı davranışlarını takip etmek için kullanılmaktadır. Çerezleri tarayıcı ayarlarınızdan devre dışı bırakabilirsiniz.
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">6. Veri Güvenliği</h2>
              <p>
                Kişisel verilerinizi korumak için endüstri standardı güvenlik önlemleri uygulanmaktadır. Verileriniz şifreli bağlantılar üzerinden iletilmekte ve güvenli sunucularda saklanmaktadır.
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">7. Veri Saklama Süresi</h2>
              <p>
                Kişisel verileriniz, hizmet amacının sona ermesinden itibaren yasal süreler dahilinde saklanır. Talebiniz halinde verileriniz silinebilir.
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">8. Haklarınız</h2>
              <p>KVKK kapsamında kişisel verileriniz hakkında bilgi alma, düzeltme ve silme haklarına sahipsiniz. Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.</p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">9. Değişiklikler</h2>
              <p>
                Bu politika zaman zaman güncellenebilir. Önemli değişikliklerde kullanıcılar bilgilendirilecektir.
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer locale={locale} />
    </>
  );
}

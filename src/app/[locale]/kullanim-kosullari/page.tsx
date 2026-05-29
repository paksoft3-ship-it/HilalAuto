import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Kullanım Koşulları — ${SITE_NAME}`,
    description: "Oto Grade web sitesi kullanım koşulları ve hizmet şartları.",
    alternates: { canonical: `${SITE_URL}/${locale}/kullanim-kosullari` },
    robots: { index: false },
  };
}

export default async function KullanimKosullariPage({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <Navbar />
      <main className="py-44 md:py-60 pb-[76px] md:pb-0">
        <Container narrow>
          <h1 className="text-section-title-mobile md:text-section-title font-medium tracking-heading text-text-primary mb-32">
            Kullanım Koşulları
          </h1>
          <div className="flex flex-col gap-24 text-[14px] text-text-muted leading-relaxed">
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">1. Kabul</h2>
              <p>
                Bu web sitesini kullanarak aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız. Koşulları kabul etmiyorsanız siteyi kullanmayı bırakınız.
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">2. Hizmet Tanımı</h2>
              <p>
                {SITE_NAME}, hasarlı, kazalı, pert ve ikinci el araçların satın alınmasına aracılık eden bir platformdur. Web sitesi üzerinden alınan teklifler bağlayıcı değil, ön değerlendirme niteliğindedir. Nihai teklif araç yerinde incelendikten sonra belirlenir.
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">3. Teklif Formu</h2>
              <p>Teklif formu aracılığıyla gönderilen bilgiler için aşağıdaki kurallar geçerlidir:</p>
              <ul className="list-disc list-inside mt-8 flex flex-col gap-4">
                <li>Gerçek ve doğru bilgi girilmesi kullanıcının sorumluluğundadır</li>
                <li>Yüklenen fotoğrafların gerçeği yansıtması gerekmektedir</li>
                <li>Yanıltıcı bilgi içeren başvurular değerlendirme dışı bırakılabilir</li>
                <li>Form gönderimi, satış yükümlülüğü doğurmaz</li>
              </ul>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">4. Sorumluluk Sınırlaması</h2>
              <p>
                {SITE_NAME}, web sitesindeki bilgilerin doğruluğu, güncelliği ve eksiksizliği konusunda azami özen göstermekle birlikte, hata veya eksikliklerden kaynaklanabilecek zararlardan sorumlu tutulamaz. Site içerikleri bilgilendirme amaçlıdır.
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">5. Fikri Mülkiyet</h2>
              <p>
                Bu web sitesindeki tüm içerikler (metinler, görseller, logolar, tasarım) {SITE_NAME}&apos;a aittir ve izinsiz kopyalanamaz, dağıtılamaz veya değiştirilemez.
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">6. Bağlantılı Siteler</h2>
              <p>
                Web sitemiz üçüncü taraf sitelere bağlantı içerebilir. Bu sitelerin içeriklerinden ve gizlilik uygulamalarından sorumlu değiliz.
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">7. Değişiklikler</h2>
              <p>
                Bu kullanım koşulları herhangi bir bildirim yapılmaksızın değiştirilebilir. Siteyi kullanmaya devam etmeniz, güncel koşulları kabul ettiğiniz anlamına gelir.
              </p>
            </section>
            <section>
              <h2 className="text-[16px] font-medium text-text-primary mb-12">8. Uygulanacak Hukuk</h2>
              <p>
                Bu koşullar Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda İstanbul mahkemeleri yetkilidir.
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer locale={locale} />
    </>
  );
}

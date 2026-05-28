import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { FaWhatsapp } from 'react-icons/fa';
import { Navbar } from "@/components/layout/Navbar";
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

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = "Nasıl Çalışır — HazarAl";
  const description = "HazarAl ile hasarlı araç satış süreci. 6 adımda aracınızı satın, yerinden teslim ve hızlı ödeme.";
  return {
    title, description,
    alternates: { canonical: `${SITE_URL}/${locale}/nasil-calisir` },
    openGraph: { title, description, locale: locale === "tr" ? "tr_TR" : "en_US", type: "website" },
  };
}

const STEPS = [
  { num: "01", title: "Bilgilerinizi Gönderin", desc: "Araç markası, hasar türü, il ve telefon numaranızı kısa form üzerinden iletın. Bağlayıcı değil, 2 dakika sürer.", time: "~2 dakika" },
  { num: "02", title: "Araç Durumu Değerlendirilsin", desc: "Uzman ekibimiz gönderdiğiniz bilgileri ve fotoğrafları inceleyerek aracınızı değerlendirir.", time: "Aynı gün" },
  { num: "03", title: "Uzmanımız Sizi Arasın", desc: "Değerleme tamamlandıktan sonra ekibimiz sizi telefonla arayarak teklif sunar.", time: "1 saat içinde" },
  { num: "04", title: "Teklifinizi Alın", desc: "Piyasa koşullarına göre belirlenen adil teklifinizi değerlendirin. Kabul etmek zorunda değilsiniz.", time: "Aynı gün" },
  { num: "05", title: "Teslim ve Evrak Süreci Planlansın", desc: "Anlaşma sağlanırsa teslim tarihi ve evrak süreci birlikte planlanır. Ekibimiz her adımda yanınızda.", time: "1-2 gün" },
  { num: "06", title: "Ödeme Süreci Tamamlansın", desc: "Araç teslimi ve devir işlemi tamamlandıktan sonra ödemeniz gerçekleştirilir.", time: "Teslim günü" },
];

const REQUIRED_INFO = [
  "Araç markası ve modeli", "Model yılı", "Hasar türü ve açıklaması",
  "İl ve ilçe bilgisi", "Telefon numarası", "Araç fotoğrafları (isteğe bağlı)",
];

const TRUST_ITEMS = [
  { title: "Bağlayıcı Değil", desc: "Teklif almak herhangi bir yükümlülük doğurmaz." },
  { title: "Şeffaf Süreç", desc: "Her adımı size önceden bildiririz." },
  { title: "Kişisel Veriler Güvende", desc: "Bilgileriniz KVKK kapsamında korunur." },
  { title: "Hızlı Dönüş", desc: "1 saat içinde geri dönüş yapılır." },
];

export default async function NasilCalisirPage({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <Navbar />
      <main className="pb-[76px] md:pb-0">
        {/* Hero */}
        <section className="bg-bg-surface border-b border-[0.5px] border-border-default py-44 md:py-60">
          <Container>
            <div className="flex flex-col items-start gap-16 max-w-[640px] w-full">
              <Badge variant="accent">Nasıl Çalışır</Badge>
              <h1 className="text-section-title-mobile md:text-[40px] font-medium tracking-heading text-text-primary">
                Hasarlı Aracınızı Satmak Artık Çok Daha Kolay
              </h1>
              <p className="text-[14px] text-text-muted leading-relaxed">
                Ekspertizden ödemeye kadar tüm süreci şeffaf ve güvenli bir şekilde yönetiyoruz. Siz sadece teklifimizi değerlendirin, gerisini bize bırakın.
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

        {/* Steps */}
        <section className="py-44 md:py-60">
          <Container>
            <SectionHeader title="6 Adımlı Süreç" subtitle="Başvurudan ödemeye kadar her adım." align="left" className="mb-32 md:mb-44" />
            <ol className="flex flex-col gap-0" aria-label="Süreç adımları">
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
        <section className="bg-bg-surface border-y border-[0.5px] border-border-default py-44 md:py-60">
          <Container>
            <div className="flex flex-col lg:flex-row gap-44 items-start">
              <div className="lg:w-[360px] shrink-0">
                <SectionHeader title="Hangi Bilgiler Gerekli?" subtitle="Başvuru için ihtiyaç duyulan minimum bilgiler." align="left" />
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
        <section className="py-44 md:py-60">
          <Container>
            <SectionHeader title="Güvenli mi?" subtitle="Sürecimiz tamamen şeffaf ve güvenlidir." align="left" className="mb-32 md:mb-44" />
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
    </>
  );
}

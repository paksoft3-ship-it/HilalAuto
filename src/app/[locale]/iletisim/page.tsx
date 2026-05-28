import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ContactForm } from "@/components/forms/ContactForm";
import { PHONE_NUMBER, WHATSAPP_NUMBER, CITIES, SITE_URL } from "@/lib/constants";
import { externalRoutes, routes } from "@/lib/routes";
import Link from "next/link";
import { FaWhatsapp } from 'react-icons/fa';

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = "İletişim — HazarAl";
  const description = "HazarAl ile iletişime geçin. Telefon, WhatsApp veya form üzerinden bize ulaşın.";
  return {
    title, description,
    alternates: { canonical: `${SITE_URL}/${locale}/iletisim` },
    openGraph: { title, description, locale: locale === "tr" ? "tr_TR" : "en_US", type: "website" },
  };
}

export default async function IletisimPage({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <Navbar />
      <main className="pb-[76px] md:pb-0">
        {/* Hero */}
        <section className="bg-bg-surface border-b border-[0.5px] border-border-default py-44 md:py-60">
          <Container className="flex flex-col items-center text-center gap-16">
            <Badge variant="accent">İletişim</Badge>
            <h1 className="text-section-title-mobile md:text-[40px] font-medium tracking-heading text-text-primary max-w-[560px]">
              Bize Ulaşın
            </h1>
            <p className="text-[14px] text-text-muted max-w-[440px] leading-relaxed">
              Sorularınız için arayın, yazın veya formu doldurun. Hızlıca dönüş yapıyoruz.
            </p>
          </Container>
        </section>

        {/* Contact options */}
        <section className="py-44 md:py-60">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-32">
              {/* Contact cards + form */}
              <div className="lg:col-span-7 flex flex-col gap-16">
                {/* Phone */}
                <a href={externalRoutes.phone(PHONE_NUMBER)} className="flex items-center gap-16 p-24 bg-white border border-[0.5px] border-border-default rounded-card hover:border-accent-border transition-colors group">
                  <div className="flex items-center justify-center w-[44px] h-[44px] bg-accent-light border border-[0.5px] border-accent-border rounded-full shrink-0">
                    <Phone size={20} strokeWidth={1.5} className="text-accent" aria-hidden />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-text-primary group-hover:text-accent transition-colors">Telefonla Ara</p>
                    <p className="text-[13px] text-text-muted mt-4">{PHONE_NUMBER.replace("+90", "0")}</p>
                  </div>
                </a>

                {/* WhatsApp */}
                <a href={externalRoutes.whatsapp(WHATSAPP_NUMBER)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-16 p-24 bg-white border border-[0.5px] border-border-default rounded-card hover:border-whatsapp transition-colors group">
                  <div className="flex items-center justify-center w-[44px] h-[44px] bg-green-50 border border-[0.5px] border-green-200 rounded-full shrink-0">
                    <FaWhatsapp size={20} strokeWidth={1.5} className="text-whatsapp" aria-hidden />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-text-primary group-hover:text-whatsapp transition-colors">WhatsApp ile Yaz</p>
                    <p className="text-[13px] text-text-muted mt-4">7 gün yanıt veriyoruz</p>
                  </div>
                </a>

                {/* Contact form */}
                <div className="p-24 bg-white border border-[0.5px] border-border-default rounded-card mt-8">
                  <h2 className="text-[16px] font-medium text-text-primary mb-24">İletişim Formu</h2>
                  <ContactForm />
                </div>
              </div>

              {/* Sidebar: cities */}
              <aside className="lg:col-span-5" aria-label="Hizmet verilen şehirler">
                <div className="bg-bg-surface border border-[0.5px] border-border-default rounded-card p-24">
                  <h2 className="text-[15px] font-medium text-text-primary mb-16">Hizmet Verdiğimiz Şehirler</h2>
                  <ul className="flex flex-wrap gap-8">
                    {Object.entries(CITIES).map(([slug, name]) => (
                      <li key={slug}>
                        <Link href={routes.city(locale, slug)} className="px-12 py-4 bg-white border border-[0.5px] border-border-default rounded-pill text-[12px] text-text-muted hover:border-accent hover:text-accent transition-colors">
                          {name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[12px] text-text-soft mt-16">ve Türkiye&apos;nin tüm illeri</p>
                </div>
              </aside>
            </div>
          </Container>
        </section>

        <FAQSection />
        <FinalCTA />
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <MobileStickyCTA />
    </>
  );
}

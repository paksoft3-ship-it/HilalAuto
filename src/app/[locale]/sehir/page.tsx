import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { FaWhatsapp } from 'react-icons/fa';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { DarkCTAForm } from "@/components/sections/DarkCTAForm";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { CITIES_DATA } from "@/data/cities";
import { routes, externalRoutes } from "@/lib/routes";
import { SITE_URL, WHATSAPP_NUMBER } from "@/lib/constants";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = "Türkiye Geneli Hasarlı Araç Alanlar — Tüm Şehirler | HazarAl";
  const description =
    "HazarAl olarak Türkiye'nin 15 büyük şehrinde kazalı, pert ve hurda araç alım hizmeti veriyoruz. Şehrinizi seçin, ücretsiz teklif alın.";
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${locale}/sehir` },
    openGraph: {
      title,
      description,
      locale: "tr_TR",
      type: "website",
    },
  };
}

export default async function SehirlerPage({ params }: Props) {
  const { locale } = await params;

  const cities = Object.values(CITIES_DATA);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/tr` },
      { "@type": "ListItem", position: 2, name: "Şehirler", item: `${SITE_URL}/tr/sehir` },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Hizmet Verdiğimiz Şehirler",
    itemListElement: cities.map((city, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${city.name} Hasarlı Araç Alanlar`,
      url: `${SITE_URL}/tr/sehir/${city.slug}`,
    })),
  };

  return (
    <>
      <Navbar />
      <main className="pb-[76px] md:pb-0">
        {/* Hero */}
        <section className="bg-bg-surface border-b border-[0.5px] border-border-default py-44 md:py-60">
          <Container>
            <div className="flex flex-col items-start gap-16 max-w-[640px]">
              <Badge variant="accent">
                <MapPin size={11} aria-hidden className="mr-4 inline" />
                Türkiye Geneli
              </Badge>
              <h1 className="text-section-title-mobile md:text-[40px] font-medium tracking-heading text-text-primary">
                Türkiye&apos;nin Her Şehrinde Hasarlı Araç Alımı
              </h1>
              <p className="text-[14px] text-text-muted leading-relaxed">
                Türkiye genelinde {cities.length} büyük ilde kazalı, pert, yanmış ve hurda araç alım
                hizmeti sunuyoruz. Şehrinizi seçin, ücretsiz teklif alın.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-12 mt-8">
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

        {/* City grid */}
        <section className="py-44 md:py-60">
          <Container>
            <SectionHeader
              title="Hizmet Verdiğimiz Şehirler"
              subtitle="Aşağıdan şehrinizi seçin, o şehre özel hasarlı araç alım sayfasına ulaşın."
              align="center"
              className="mb-32 md:mb-44"
            />
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={routes.city(locale, city.slug)}
                    className="group flex flex-col gap-12 p-24 bg-bg-surface border border-[0.5px] border-border-default rounded-card hover:border-accent-border hover:bg-accent-light transition-colors h-full"
                  >
                    <div className="flex items-center gap-8">
                      <MapPin
                        size={16}
                        strokeWidth={1.5}
                        className="text-accent shrink-0"
                        aria-hidden
                      />
                      <p className="text-[15px] font-medium text-text-primary">{city.name}</p>
                    </div>
                    <p className="text-[12px] text-text-muted leading-relaxed line-clamp-2">
                      {city.description}
                    </p>
                    <div className="flex flex-wrap gap-6 mt-auto pt-8">
                      {city.districts.slice(0, 3).map((d) => (
                        <span
                          key={d}
                          className="px-8 py-2 bg-white border border-[0.5px] border-border-default rounded-pill text-[11px] text-text-soft"
                        >
                          {d}
                        </span>
                      ))}
                      {city.districts.length > 3 && (
                        <span className="px-8 py-2 text-[11px] text-text-soft">
                          +{city.districts.length - 3} ilçe
                        </span>
                      )}
                    </div>
                    <span className="text-[12px] text-accent font-medium flex items-center gap-4 mt-4 group-hover:gap-8 transition-all">
                      Teklif Al <ArrowRight size={12} strokeWidth={1.5} aria-hidden />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <DarkCTAForm />
        <FinalCTA />
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <MobileStickyCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </>
  );
}

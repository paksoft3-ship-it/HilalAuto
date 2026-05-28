import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { DarkCTAForm } from "@/components/sections/DarkCTAForm";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { TrustBar } from "@/components/sections/TrustBar";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { QuickQuoteForm } from "@/components/forms/QuickQuoteForm";
import { CITIES_DATA, ALL_CITY_SLUGS } from "@/data/cities";
import { SITE_FAQ_ITEMS } from "@/data/faqs";
import { routes } from "@/lib/routes";
import { CITIES, SITE_URL, PHONE_NUMBER } from "@/lib/constants";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return ALL_CITY_SLUGS.flatMap((slug) => [
    { locale: "tr", slug },
    { locale: "en", slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const city = CITIES_DATA[slug];
  if (!city) return {};
  return {
    title: `${city.name} Hasarlı Araç Alanlar — HazarAl`,
    description: city.metaDescription,
    alternates: { canonical: `${SITE_URL}/${locale}/sehir/${slug}` },
    openGraph: {
      title: `${city.name} Hasarlı Araç Alanlar — HazarAl`,
      description: city.metaDescription,
      locale: "tr_TR",
      type: "website",
    },
  };
}

const VEHICLE_SERVICES = [
  { label: "Kazalı Araç", slug: "kazali-arac-alimi" },
  { label: "Pert Araç", slug: "pert-arac-alimi" },
  { label: "Yanmış Araç", slug: "yanmis-arac-alimi" },
  { label: "Sel Hasarlı", slug: "sel-hasarli-arac-alimi" },
  { label: "Hurda Araç", slug: "hurda-arac-alimi" },
  { label: "Motor Arızalı", slug: "motor-arizali-arac-alimi" },
];

export default async function CityPage({ params }: Props) {
  const { locale, slug } = await params;
  const city = CITIES_DATA[slug];
  if (!city) notFound();

  const nearbyCities = city.nearbyCities
    .map((s) => ({ slug: s, name: CITIES[s] ?? s }))
    .filter((c) => c.name);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/tr` },
      { "@type": "ListItem", position: 2, name: "Şehirler", item: `${SITE_URL}/tr/sehir` },
      {
        "@type": "ListItem",
        position: 3,
        name: `${city.name} Hasarlı Araç Alanlar`,
        item: `${SITE_URL}/tr/sehir/${slug}`,
      },
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: `HazarAl — ${city.name} Hasarlı Araç Alımı`,
    description: city.metaDescription,
    url: `${SITE_URL}/tr/sehir/${slug}`,
    telephone: PHONE_NUMBER,
    areaServed: {
      "@type": "City",
      name: city.name,
      containedInPlace: { "@type": "Country", name: "TR" },
    },
    priceRange: "Ücretsiz Teklif",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SITE_FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <Navbar />
      <main className="pb-[76px] md:pb-0">
        {/* Hero */}
        <section className="bg-bg-surface border-b border-[0.5px] border-border-default py-44 md:py-60">
          <Container>
            <div className="flex flex-col lg:flex-row gap-44 md:gap-60 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-8 mb-24">
                  <Badge variant="accent"><MapPin size={11} aria-hidden className="mr-4" />{city.name}</Badge>
                </div>
                <h1 className="text-section-title-mobile md:text-[40px] font-medium tracking-heading text-text-primary mb-16">
                  {city.name} Hasarlı Araç Alanlar
                </h1>
                <p className="text-[14px] text-text-muted leading-relaxed max-w-[480px] mb-32">
                  {city.description}
                </p>

                <div>
                  <p className="text-[12px] font-medium text-text-primary uppercase tracking-wider mb-12">Hizmet Verilen İlçeler</p>
                  <ul className="flex flex-wrap gap-8" aria-label={`${city.name} ilçeleri`}>
                    {city.districts.map((d) => (
                      <li key={d}>
                        <span className="px-12 py-4 bg-white border border-[0.5px] border-border-default rounded-pill text-[12px] text-text-muted">
                          {d}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="w-full lg:w-[400px] shrink-0">
                <div className="bg-white border border-[0.5px] border-border-default rounded-card-lg p-24">
                  <h2 className="text-[16px] font-medium text-text-primary mb-4">
                    {city.nameGenitive} Ücretsiz Teklif Al
                  </h2>
                  <p className="text-[12px] text-text-soft mb-24">Bağlayıcı değil · Hızlı dönüş</p>
                  <QuickQuoteForm />
                </div>
              </div>
            </div>
          </Container>
        </section>

        <TrustBar />

        {/* Vehicle types */}
        <section className="py-44 md:py-60">
          <Container>
            <SectionHeader title={`${city.nameGenitive} Aldığımız Araç Türleri`} subtitle="Her türlü hasarlı araç için teklif veriyoruz." align="center" className="mb-32 md:mb-44" />
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-12">
              {VEHICLE_SERVICES.map(({ label, slug: sSlug }) => (
                <li key={sSlug}>
                  <Link href={routes.service(locale, sSlug)} className="flex items-center justify-between gap-8 p-16 bg-bg-surface border border-[0.5px] border-border-default rounded-card hover:border-accent-border hover:bg-accent-light transition-colors">
                    <span className="text-[13px] font-medium text-text-primary">{label}</span>
                    <ArrowRight size={14} strokeWidth={1.5} className="text-text-soft shrink-0" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <DarkCTAForm />
        <FAQSection />

        {/* Nearby cities */}
        {nearbyCities.length > 0 && (
          <section className="py-44 md:py-60 bg-bg-surface border-b border-[0.5px] border-border-default">
            <Container>
              <SectionHeader title="Yakın Şehirler" subtitle="Komşu illerde de hizmet veriyoruz." align="center" className="mb-24" />
              <ul className="flex flex-wrap gap-12 justify-center">
                {nearbyCities.map(({ slug: cs, name }) => (
                  <li key={cs}>
                    <Link href={routes.city(locale, cs)} className="inline-flex items-center gap-8 px-24 py-12 bg-white border border-[0.5px] border-border-default rounded-pill text-[13px] text-text-muted hover:border-accent hover:text-accent transition-colors">
                      <MapPin size={13} strokeWidth={1.5} aria-hidden />
                      {name} Hasarlı Araç
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        )}

        <FinalCTA />
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <MobileStickyCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}

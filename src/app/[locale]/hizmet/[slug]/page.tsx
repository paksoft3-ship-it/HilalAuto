import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { DarkCTAForm } from "@/components/sections/DarkCTAForm";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { QuickQuoteForm } from "@/components/forms/QuickQuoteForm";
import { SERVICES, ALL_SERVICE_SLUGS } from "@/data/services";
import { routes } from "@/lib/routes";
import { SITE_URL, PHONE_NUMBER } from "@/lib/constants";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

const SEO_TITLES: Record<string, string> = {
  "kazali-arac-alimi": "Kazalı Araç Alanlar & Alımı | HazarAl",
  "pert-arac-alimi": "Pert Araç Alanlar & Alımı | HazarAl",
  "yanmis-arac-alimi": "Yanmış Araç Alımı | HazarAl",
  "sel-hasarli-arac-alimi": "Sel Hasarlı Araç Alanlar | HazarAl",
  "hurda-arac-alimi": "Hurda Araç Alanlar & Alımı | HazarAl",
  "motor-arizali-arac-alimi": "Motor Arızalı Araç Alımı | HazarAl",
  "cekme-belgeli-arac-alimi": "Çekme Belgeli Araç Alımı | HazarAl",
  "agir-hasarli-arac-alimi": "Ağır Hasarlı Araç Alanlar | HazarAl",
};

export function generateStaticParams() {
  return ALL_SERVICE_SLUGS.flatMap((slug) => [
    { locale: "tr", slug },
    { locale: "en", slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = SERVICES[slug];
  if (!service) return {};
  const title = SEO_TITLES[slug] ?? `${service.title} — HazarAl`;
  return {
    title,
    description: service.metaDescription,
    alternates: { canonical: `${SITE_URL}/${locale}/hizmet/${slug}` },
    openGraph: {
      title,
      description: service.metaDescription,
      locale: "tr_TR",
      type: "website",
    },
  };
}

const HOW_IT_WORKS = [
  { num: "01", title: "Formu Doldurun", desc: "Araç bilgilerini kısa form üzerinden gönderin." },
  { num: "02", title: "Uzmanımız Arasın", desc: "Ekibimiz değerleme yapıp size teklif sunar." },
  { num: "03", title: "Teslim ve Ödeme", desc: "Aracınızı yerinden alır, ödemenizi yaparız." },
];

const RELATED_SLUGS: Record<string, string[]> = {
  "kazali-arac-alimi": ["pert-arac-alimi", "agir-hasarli-arac-alimi"],
  "pert-arac-alimi": ["kazali-arac-alimi", "cekme-belgeli-arac-alimi"],
  "yanmis-arac-alimi": ["sel-hasarli-arac-alimi", "hurda-arac-alimi"],
  "sel-hasarli-arac-alimi": ["yanmis-arac-alimi", "motor-arizali-arac-alimi"],
  "hurda-arac-alimi": ["motor-arizali-arac-alimi", "agir-hasarli-arac-alimi"],
  "motor-arizali-arac-alimi": ["hurda-arac-alimi", "cekme-belgeli-arac-alimi"],
  "cekme-belgeli-arac-alimi": ["pert-arac-alimi", "agir-hasarli-arac-alimi"],
  "agir-hasarli-arac-alimi": ["kazali-arac-alimi", "pert-arac-alimi"],
};

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  const service = SERVICES[slug];
  if (!service) notFound();

  const relatedSlugs = RELATED_SLUGS[slug] ?? [];
  const relatedServices = relatedSlugs.map((s) => SERVICES[s]).filter(Boolean);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/tr` },
      { "@type": "ListItem", position: 2, name: "Hizmetler", item: `${SITE_URL}/tr/hizmet` },
      { "@type": "ListItem", position: 3, name: service.title, item: `${SITE_URL}/tr/hizmet/${slug}` },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.metaDescription,
    provider: {
      "@type": "LocalBusiness",
      name: "HazarAl",
      url: SITE_URL,
      telephone: PHONE_NUMBER,
    },
    areaServed: { "@type": "Country", name: "TR" },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
      description: "Ücretsiz teklif — bağlayıcı değil",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
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
                <Badge variant="accent" className="mb-24">{service.hero.badge}</Badge>
                <h1 className="text-section-title-mobile md:text-[40px] font-medium tracking-heading text-text-primary mb-16">
                  {service.hero.heading}
                </h1>
                <p className="text-[14px] text-text-muted leading-relaxed max-w-[480px] mb-32">
                  {service.hero.description}
                </p>
                <ul className="flex flex-col gap-8 mb-32">
                  {service.conditions.map(({ label }) => (
                    <li key={label} className="flex items-center gap-8">
                      <CheckCircle size={15} strokeWidth={1.5} className="text-accent shrink-0" aria-hidden />
                      <span className="text-[13px] text-text-muted">{label}</span>
                    </li>
                  ))}
                </ul>
                <Link href={routes.quote(locale)} className="inline-flex items-center gap-8 bg-accent text-white px-32 py-16 rounded-btn font-medium text-[14px] hover:opacity-90 transition-opacity">
                  Ücretsiz Teklif Al <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
                </Link>
              </div>

              <div className="w-full lg:w-[400px] shrink-0">
                <div className="bg-white border border-[0.5px] border-border-default rounded-card-lg p-24">
                  <h2 className="text-[16px] font-medium text-text-primary mb-4">Hızlı Teklif Al</h2>
                  <p className="text-[12px] text-text-soft mb-24">Bağlayıcı değil · Hızlı dönüş</p>
                  <QuickQuoteForm />
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Problems */}
        <section className="py-44 md:py-60">
          <Container>
            <SectionHeader title="Hangi Durumlar Kapsanıyor?" subtitle="Aşağıdaki durumlardan herhangi birinde değerlendirme yapıyoruz." align="center" className="mb-32 md:mb-44" />
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16">
              {service.problems.map(({ title, desc }) => (
                <li key={title}>
                  <Card className="h-full">
                    <CardBody>
                      <p className="text-[14px] font-medium text-text-primary mb-8">{title}</p>
                      <p className="text-[12px] text-text-muted leading-relaxed">{desc}</p>
                    </CardBody>
                  </Card>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* How it works */}
        <section className="bg-bg-surface border-y border-[0.5px] border-border-default py-44 md:py-60">
          <Container>
            <SectionHeader title="Nasıl Çalışır?" subtitle="3 adımda aracınızı satın." align="center" className="mb-32 md:mb-44" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {HOW_IT_WORKS.map(({ num, title, desc }) => (
                <div key={num} className="flex flex-col gap-12 p-24 bg-white border border-[0.5px] border-border-default rounded-card text-center">
                  <span className="flex items-center justify-center w-[40px] h-[40px] bg-accent-light border border-[0.5px] border-accent-border text-accent rounded-full text-[14px] font-medium mx-auto">{num}</span>
                  <div>
                    <p className="text-[14px] font-medium text-text-primary mb-8">{title}</p>
                    <p className="text-[12px] text-text-muted leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <DarkCTAForm />

        {/* FAQ */}
        <section className="py-44 md:py-60 border-b border-[0.5px] border-border-default">
          <Container>
            <SectionHeader title="Sık Sorulan Sorular" align="center" className="mb-32" />
            <div className="max-w-[720px] mx-auto">
              <Accordion items={service.faqs} />
            </div>
          </Container>
        </section>

        {/* Related services */}
        {relatedServices.length > 0 && (
          <section className="py-44 md:py-60 bg-bg-surface border-b border-[0.5px] border-border-default">
            <Container>
              <SectionHeader title="İlgili Hizmetler" align="center" className="mb-32" />
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-16 max-w-[640px] mx-auto">
                {relatedServices.map((s) => (
                  <li key={s.slug}>
                    <Link href={routes.service(locale, s.slug)} className="flex items-center justify-between gap-8 p-24 bg-white border border-[0.5px] border-border-default rounded-card hover:border-accent-border hover:bg-accent-light transition-colors">
                      <p className="text-[14px] font-medium text-text-primary">{s.title}</p>
                      <ArrowRight size={15} strokeWidth={1.5} className="text-accent shrink-0" aria-hidden />
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}

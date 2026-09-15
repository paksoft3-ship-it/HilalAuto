import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPathname, Link } from "@/i18n/routing";
import {
  Store,
  Gauge,
  MessagesSquare,
  BadgeCheck,
  Wallet,
  MapPinned,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { localeUrl } from "@/lib/locale-url";
import { routes } from "@/lib/routes";
import BayiOlForm from "./BayiOlForm";

interface Props {
  params: Promise<{ locale: string }>;
}

/**
 * Server wrapper around the client-side signup form. The form itself needs
 * "use client" for its multi-step state, and previously shipped with no
 * surrounding content — no Navbar/Footer, no explanation of what a dealer
 * gets, nothing targeting "hasarlı araç bayilik" / "galeri ilan verme" /
 * "hasarlı araç toptan satış" intent. This adds that content around the
 * unchanged form.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  const title = t("dealerSignupTitle", {
    default: `Hasarlı Araç Bayiliği — Ücretsiz İlan Verin | ${SITE_NAME}`,
  });
  const description = t("dealerSignupDesc", {
    default:
      "Hasarlı, pert ve hurda araç alım satımı yapan galeri ve bayiler için ücretsiz üyelik. Stoğunuzu Otograde'de listeleyin, alıcılarla doğrudan iletişime geçin.",
  });

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `${SITE_URL}${getPathname({ locale, href: "/bayi-ol" })}`,
      languages: {
        tr: `${SITE_URL}${getPathname({ locale: "tr", href: "/bayi-ol" })}`,
        en: `${SITE_URL}${getPathname({ locale: "en", href: "/bayi-ol" })}`,
        "x-default": `${SITE_URL}${getPathname({ locale: "tr", href: "/bayi-ol" })}`,
      },
    },
    openGraph: {
      title,
      description,
      locale: locale === "en" ? "en_US" : "tr_TR",
      type: "website",
      url: `${SITE_URL}${getPathname({ locale, href: "/bayi-ol" })}`,
    },
  };
}

const BENEFITS = [
  {
    icon: Wallet,
    title: "Üyelik Ücretsiz",
    body: "Üyelik ve ilan yayınlama şu anda tamamen ücretsizdir — komisyon alınmaz, dilediğiniz kadar ilan ekleyebilirsiniz.",
  },
  {
    icon: Store,
    title: "Bayi Paneli",
    body: "İlanlarınızı tek yerden yönetin, düzenleyin ve öne çıkarın — ayrı bir yönetim paneli üzerinden.",
  },
  {
    icon: MessagesSquare,
    title: "Doğrudan Alıcı İletişimi",
    body: "Alıcılar sizinle panel üzerinden veya WhatsApp ile doğrudan iletişime geçer, aracı yayınladığınız fiyat ve koşullarla görüşür.",
  },
  {
    icon: Gauge,
    title: "A-E Grade Sistemiyle İlan",
    body: "İlanı oluştururken aracın hasar ağırlığını A'dan E'ye kadar kendiniz derecelendirirsiniz — alıcılar ilanınızı tek bakışta değerlendirir.",
  },
  {
    icon: BadgeCheck,
    title: "Bayi Profil Sayfası",
    body: "Kendi bayi profil sayfanızda tüm aktif ilanlarınız, iletişim bilgileriniz ve konumunuz alıcılara birlikte gösterilir.",
  },
  {
    icon: MapPinned,
    title: "Türkiye Genelinde Görünürlük",
    body: "İlanlarınız şehir ve hasar türüne göre filtrelenebilir listelerde yer alır, aracınızı arayan alıcılara ulaşır.",
  },
];

const FAQS = [
  {
    id: "free",
    question: "Bayi üyeliği ücretli mi?",
    answer:
      "Hayır. Otograde'de bayi üyeliği ve ilan yayınlama şu anda tamamen ücretsizdir; herhangi bir komisyon veya listeleme ücreti alınmaz.",
  },
  {
    id: "who",
    question: "Kimler bayi olarak başvurabilir?",
    answer:
      "Hasarlı, pert veya hurda araç alım satımı yapan galeriler, oto ticaret şirketleri ve bireysel toptan satıcılar başvurabilir. Başvuru formunda firma/isim, telefon ve şehir bilgisi yeterlidir.",
  },
  {
    id: "approval",
    question: "Başvurum ne zaman onaylanır?",
    answer:
      "Başvurular incelenir ve onaylandıktan sonra e-posta ile bilgilendirme yapılır; bu süreç genellikle 24 saat içinde tamamlanır.",
  },
  {
    id: "grade",
    question: "İlanımın hasar derecesini kim belirliyor?",
    answer:
      "Grade'i (A-E), ilanı oluştururken siz belirlersiniz — Otograde aracı fiziksel olarak incelemez. Derecelerin ne anlama geldiğini grade sistemi sayfasından inceleyebilirsiniz.",
  },
];

export default async function BayiOlPage({ params }: Props) {
  const { locale } = await params;

  const pageUrl = localeUrl(locale, "/bayi-ol");

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: localeUrl(locale, "/") },
      { "@type": "ListItem", position: 2, name: "Bayi Ol", item: pageUrl },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <Navbar />
      <main className="pb-[76px] md:pb-0">
        {/* Hero */}
        <section className="bg-bg-surface border-b border-[0.5px] border-border-default py-32 md:py-44">
          <Container>
            <div className="flex flex-col items-start gap-16 w-full lg:w-3/4">
              <Badge variant="accent">Bayiler İçin</Badge>
              <h1 className="text-section-title-mobile md:text-[40px] font-medium tracking-heading text-text-primary">
                Hasarlı Araç Bayiliği: Stoğunuzu Otograde&apos;de Listeleyin
              </h1>
              <p className="text-[14px] text-text-muted leading-relaxed">
                Galeri veya toptan hasarlı araç satıcısı iseniz, kazalı, pert, sel hasarlı ve
                hurda araç stoğunuzu ücretsiz bayi üyeliğiyle yayınlayın — ilan verme ve
                alıcı iletişimi tek panelden.
              </p>
            </div>
          </Container>
        </section>

        {/* Benefits */}
        <section className="py-32 md:py-44">
          <Container>
            <SectionHeader title="Bayi Olarak Neler Kazanırsınız?" align="left" className="mb-32" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-24"
                >
                  <div className="w-[40px] h-[40px] rounded-full bg-accent-light flex items-center justify-center text-accent mb-16">
                    <b.icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[15px] font-medium text-text-primary mb-8">{b.title}</h3>
                  <p className="text-[13px] text-text-muted leading-relaxed">{b.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Grade system for dealer stock */}
        <section className="py-32 md:py-44 bg-bg-surface border-y border-[0.5px] border-border-default">
          <Container narrow>
            <SectionHeader title="Stoğunuz İçin A-E Grade Sistemi" align="left" className="mb-16" />
            <p className="text-[14px] text-text-muted leading-relaxed mb-16">
              Her ilan oluştururken aracın hasar ağırlığını A (en hafif) ile E (en ağır)
              arasında kendiniz derecelendirirsiniz. Bu, alıcının ilanınızı diğer
              ilanlarla hızlıca karşılaştırmasını sağlar ve doğru alıcıya daha hızlı
              ulaşmanıza yardımcı olur.
            </p>
            <Link
              href={routes.gradeSystem() as never}
              className="inline-flex items-center gap-8 text-[13px] font-medium text-primary hover:underline"
            >
              Grade Sistemi Nasıl Çalışır?
              <ArrowRight size={14} aria-hidden />
            </Link>
          </Container>
        </section>

        {/* FAQ */}
        <section className="py-32 md:py-44">
          <Container narrow>
            <SectionHeader title="Bayiler İçin Sık Sorulan Sorular" align="left" className="mb-24" />
            <div className="flex flex-col gap-12">
              {FAQS.map((f) => (
                <div
                  key={f.id}
                  className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-20"
                >
                  <h3 className="text-[14px] font-medium text-text-primary mb-8">{f.question}</h3>
                  <p className="text-[13px] text-text-muted leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Signup form */}
        <BayiOlForm />
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <MobileStickyCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}

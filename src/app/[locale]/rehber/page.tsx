import { getPathname } from "@/i18n/routing";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { SITE_URL } from "@/lib/constants";
import { localeUrl } from "@/lib/locale-url";
import { REHBER_POSTS } from "@/data/rehber-content";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title =
    locale === "en"
      ? "Buyer's Guide — Damaged Vehicle Purchasing | Otograde"
      : "Alıcı Rehberi — Hasarlı Araç Satın Alma | Otograde";
  const description =
    locale === "en"
      ? "Practical, question-by-question guidance for buying a damaged or written-off vehicle in Turkey: registration, insurance, financing and inspection."
      : "Hasarlı ve pert araç satın alma sürecine dair pratik rehber: tescil, sigorta, kredi ve satın alma öncesi kontrol listesi.";
  const canonical = `${SITE_URL}${getPathname({ locale, href: "/rehber" })}`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        tr: `${SITE_URL}${getPathname({ locale: "tr", href: "/rehber" })}`,
        en: `${SITE_URL}${getPathname({ locale: "en", href: "/rehber" })}`,
        "x-default": `${SITE_URL}${getPathname({ locale: "tr", href: "/rehber" })}`,
      },
    },
    openGraph: { title, description, url: canonical, locale: locale === "en" ? "en_US" : "tr_TR", type: "website" },
  };
}

export default async function RehberIndexPage({ params }: Props) {
  const { locale } = await params;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Alıcı Rehberi",
    description: "Hasarlı ve pert araç satın alma sürecine dair pratik rehber içerikleri.",
    url: localeUrl(locale, "/rehber"),
    inLanguage: locale === "en" ? "en-US" : "tr-TR",
    hasPart: REHBER_POSTS.map((post) => ({
      "@type": "Article",
      headline: post.question,
      url: localeUrl(locale, `/rehber/${post.slug}`),
      datePublished: post.publishedDate,
    })),
  };

  return (
    <>
      <Navbar />
      <main className="pb-[76px] md:pb-0">
        <section className="bg-bg-surface border-b border-[0.5px] border-border-default py-32 md:py-44">
          <Container>
            <div className="flex flex-col items-start gap-16 w-full lg:w-3/4">
              <Badge variant="accent">Alıcı Rehberi</Badge>
              <h1 className="text-section-title-mobile md:text-[40px] font-medium tracking-heading text-text-primary">
                Hasarlı Araç Satın Alma Rehberi
              </h1>
              <p className="text-[14px] text-text-muted leading-relaxed">
                Pert, hasarlı ve hasar kayıtlı araç satın alırken en çok sorulan sorulara
                doğrudan, uygulanabilir cevaplar.
              </p>
            </div>
          </Container>
        </section>

        <Container className="py-32 md:py-44">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            {REHBER_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={{ pathname: "/rehber/[slug]", params: { slug: post.slug } }}
                className="group bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-24 hover:border-primary transition-colors flex flex-col"
              >
                <h2 className="text-[18px] font-medium text-on-surface mb-12 leading-tight group-hover:text-primary transition-colors">
                  {post.question}
                </h2>
                <p className="text-[14px] text-text-muted leading-relaxed mb-20">{post.excerpt}</p>
                <div className="mt-auto pt-16 border-t border-[0.5px] border-border-default flex items-center gap-8 text-[13px] font-medium text-primary">
                  Devamını Oku
                  <ArrowRight size={14} aria-hidden />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <MobileStickyCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
    </>
  );
}

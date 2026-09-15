import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getPathname } from "@/i18n/routing";
import { ArrowRight, ChevronRight, Calendar } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { Container } from "@/components/ui/Container";
import { SITE_URL } from "@/lib/constants";
import { localeUrl } from "@/lib/locale-url";
import { REHBER_POSTS, getRehberPost } from "@/data/rehber-content";
import { routes } from "@/lib/routes";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return REHBER_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getRehberPost(slug);
  if (!post) return {};

  const title = `${post.question} — Otograde`;
  const canonical = `${SITE_URL}${getPathname({ locale, href: { pathname: "/rehber/[slug]", params: { slug } } })}`;

  return {
    title: { absolute: title },
    description: post.metaDescription,
    alternates: { canonical },
    openGraph: {
      title,
      description: post.metaDescription,
      url: canonical,
      locale: locale === "en" ? "en_US" : "tr_TR",
      type: "article",
    },
    robots: { index: true, follow: true },
  };
}

export default async function RehberDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = getRehberPost(slug);
  if (!post) notFound();

  const postUrl = localeUrl(locale, `/rehber/${slug}`);
  const otherPosts = REHBER_POSTS.filter((p) => p.slug !== slug).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": postUrl,
    headline: post.question,
    description: post.metaDescription,
    url: postUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    datePublished: post.publishedDate,
    dateModified: post.publishedDate,
    inLanguage: locale === "en" ? "en-US" : "tr-TR",
    author: { "@type": "Organization", name: "Oto Grade", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Oto Grade", url: SITE_URL },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: localeUrl(locale, "/") },
      { "@type": "ListItem", position: 2, name: "Alıcı Rehberi", item: localeUrl(locale, "/rehber") },
      { "@type": "ListItem", position: 3, name: post.question, item: postUrl },
    ],
  };

  return (
    <>
      <Navbar />
      <main className="bg-surface pb-[76px] md:pb-32 pt-32">
        <Container narrow>
          <div className="flex items-center gap-2 text-[13px] text-muted-text mb-24 overflow-x-auto whitespace-nowrap pb-2">
            <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
            <ChevronRight size={14} className="opacity-50 flex-shrink-0" />
            <Link href="/rehber" className="hover:text-primary transition-colors">Alıcı Rehberi</Link>
            <ChevronRight size={14} className="opacity-50 flex-shrink-0" />
            <span className="text-on-surface font-medium truncate max-w-[240px] sm:max-w-md">{post.question}</span>
          </div>

          <div className="flex items-center gap-8 text-[13px] text-muted-text mb-16">
            <Calendar size={14} className="text-primary" />
            {new Date(post.publishedDate).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <h1 className="text-[26px] md:text-[34px] font-medium tracking-heading text-text-primary leading-tight mb-32">
            {post.question}
          </h1>

          <article className="flex flex-col gap-16">
            {post.body.map((block, i) => {
              if (block.type === "p") {
                return (
                  <p key={i} className="text-[15px] text-text-secondary leading-relaxed">
                    {block.text}
                  </p>
                );
              }
              if (block.type === "h2") {
                return (
                  <h2 key={i} className="text-[19px] font-medium text-text-primary mt-16">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "list") {
                return (
                  <ul key={i} className="flex flex-col gap-8 list-disc pl-20">
                    {block.items.map((item, j) => (
                      <li key={j} className="text-[15px] text-text-secondary leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <div
                  key={i}
                  className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-20 mt-8"
                >
                  <p className="text-[14px] text-text-secondary leading-relaxed mb-12">{block.text}</p>
                  <Link
                    href={block.href as never}
                    className="inline-flex items-center gap-8 text-[13px] font-medium text-primary hover:underline"
                  >
                    {block.cta}
                    <ArrowRight size={14} aria-hidden />
                  </Link>
                </div>
              );
            })}
          </article>

          {otherPosts.length > 0 && (
            <div className="mt-48 pt-32 border-t border-[0.5px] border-border-default">
              <h3 className="text-[18px] font-medium text-text-primary mb-20">Diğer Rehber Yazıları</h3>
              <div className="flex flex-col gap-12">
                {otherPosts.map((p) => (
                  <Link
                    key={p.slug}
                    href={{ pathname: "/rehber/[slug]", params: { slug: p.slug } }}
                    className="group flex items-center justify-between gap-12 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card px-20 py-16 hover:border-primary transition-colors"
                  >
                    <span className="text-[14px] font-medium text-on-surface group-hover:text-primary transition-colors">
                      {p.question}
                    </span>
                    <ArrowRight size={14} className="text-primary flex-shrink-0" aria-hidden />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-32 flex flex-col sm:flex-row gap-12">
            <Link
              href={routes.becomeDealer() as never}
              className="inline-flex items-center justify-center gap-8 bg-primary text-white px-24 py-14 rounded-btn text-[14px] font-medium hover:opacity-90 transition-opacity"
            >
              Bayi Olarak İlan Verin
            </Link>
            <Link
              href={routes.marketplace() as never}
              className="inline-flex items-center justify-center gap-8 border border-[0.5px] border-border-default text-on-surface px-24 py-14 rounded-btn text-[14px] font-medium hover:border-primary transition-colors"
            >
              Tüm İlanları İncele
            </Link>
          </div>
        </Container>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <MobileStickyCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/routing";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Navbar } from "@/components/layout/Navbar";
import { GroupSiteBacklink } from "@/components/seo/GroupSiteBacklink";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { supabase } from "@/lib/supabase";
import { SITE_URL, WHATSAPP_NUMBER } from "@/lib/constants";
import { localeUrl } from "@/lib/locale-url";
import { externalRoutes } from "@/lib/routes";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t("blogTitle");
  const description = t("blogDescription");
  const canonical = `${SITE_URL}${getPathname({ locale, href: "/blog" })}`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        tr: `${SITE_URL}${getPathname({ locale: "tr", href: "/blog" })}`,
        en: `${SITE_URL}${getPathname({ locale: "en", href: "/blog" })}`,
        "x-default": `${SITE_URL}${getPathname({ locale: "tr", href: "/blog" })}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: locale === "en" ? "en_US" : "tr_TR",
      type: "website",
    },
  };
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blogPage" });

  const { data: blogs } = await supabase
    .from("hazaral_blogs")
    .select("id, slug, title, excerpt, image_url, created_at")
    .eq("status", "published")
    .eq("locale", locale)
    .order("created_at", { ascending: false });

  const blogList = blogs ?? [];

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("title", { default: "Blog" }),
    description: t("subtitle", { default: "" }),
    url: localeUrl(locale, "/blog"),
    inLanguage: locale === "en" ? "en-US" : "tr-TR",
    publisher: {
      "@type": "Organization",
      name: "Oto Grade",
      url: SITE_URL,
    },
    ...(blogList.length > 0
      ? {
          hasPart: blogList.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            url: localeUrl(locale, `/blog/${post.slug}`),
            datePublished: post.created_at,
            image: post.image_url ?? undefined,
          })),
        }
      : {}),
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-[76px] md:pb-0">
        {/* Hero */}
        <section className="bg-bg-surface border-b border-[0.5px] border-border-default py-32 md:py-44">
          <Container>
            <div className="flex flex-col items-start gap-16 w-full lg:w-3/4">
              <Badge variant="accent">{t("badge", { default: "Blog" })}</Badge>
              <h1 className="text-section-title-mobile md:text-[40px] font-medium tracking-heading text-text-primary">
                {t("title", { default: "Sektörel Haberler ve Rehberler" })}
              </h1>
              <p className="text-[14px] text-text-muted leading-relaxed">
                {t("subtitle", { default: "Hasarlı araç sektörü, araç değer kaybı ve sigorta işlemleri hakkında güncel bilgiler." })}
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-12 mt-8 w-full sm:w-auto">
                <Link
                  href={`/${locale}/teklif-al`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-8 bg-primary text-white px-32 py-16 rounded-btn font-medium text-[14px] hover:opacity-90 transition-opacity"
                >
                  {t("ctaQuote", { default: "Ücretsiz Teklif Al" })}
                  <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
                </Link>
                <a
                  href={externalRoutes.whatsapp(WHATSAPP_NUMBER)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-8 bg-transparent border border-whatsapp-green text-whatsapp-green px-32 py-16 rounded-btn text-[14px] font-medium hover:bg-whatsapp-green hover:text-white transition-colors"
                  aria-label={t("ctaWhatsapp", { default: "WhatsApp ile yazın" })}
                >
                  <FaWhatsapp size={16} aria-hidden />
                  {t("ctaWhatsapp", { default: "WhatsApp ile Yaz" })}
                </a>
              </div>
            </div>
          </Container>
        </section>
        <GroupSiteBacklink variant="blog" locale={locale} />

        <Container className="py-32 md:py-44">
          {blogList.length === 0 ? (
            <div className="text-center py-44 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px]">
              <p className="text-[14px] text-muted-text">
                {t("empty", { default: "Henüz yayınlanmış bir blog yazısı bulunmuyor." })}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
              {blogList.map((blog) => (
                <Link
                  href={`/${locale}/blog/${blog.slug}`}
                  key={blog.id}
                  className="group bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] overflow-hidden hover:border-primary transition-colors flex flex-col"
                >
                  <div className="aspect-[16/10] bg-surface relative overflow-hidden">
                    {blog.image_url ? (
                      <Image
                        src={blog.image_url}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-text text-[12px]">
                        {t("noImage", { default: "Görsel Yok" })}
                      </div>
                    )}
                  </div>
                  <div className="p-24 flex flex-col flex-1">
                    <div className="flex items-center gap-8 text-[12px] text-muted-text mb-12">
                      <Calendar size={14} aria-hidden />
                      {new Date(blog.created_at).toLocaleDateString(
                        locale === "tr" ? "tr-TR" : "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </div>
                    <h2 className="text-[18px] font-medium text-on-surface mb-12 line-clamp-2 leading-tight">
                      {blog.title}
                    </h2>
                    <p className="text-[14px] text-muted-text line-clamp-3 mb-24">{blog.excerpt}</p>
                    <div className="mt-auto pt-16 border-t border-[0.5px] border-border-default flex items-center gap-8 text-[13px] font-medium text-primary">
                      {t("readMore", { default: "Devamını Oku" })}
                      <ArrowRight size={14} aria-hidden />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <MobileStickyCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
    </>
  );
}

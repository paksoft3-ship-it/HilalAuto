/* eslint-disable @typescript-eslint/no-unused-vars */
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Calendar, ArrowLeft, Share2, Clock, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Container } from "@/components/ui/Container";
import { SITE_URL } from "@/lib/constants";
import { localeUrl } from "@/lib/locale-url";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  const { data } = await supabase
    .from("hazaral_blogs")
    .select("title, image_url, excerpt")
    .eq("slug", slug)
    .single();

  if (!data) return {};

  return {
    title: `${data.title} — Oto Grade`,
    description: data.excerpt || data.title,
    alternates: {
      canonical: localeUrl(locale, `/blog/${slug}`),
    },
    openGraph: {
      title: `${data.title} — Oto Grade`,
      description: data.excerpt || data.title,
      locale: "tr_TR",
      type: "article",
      images: data.image_url ? [{ url: data.image_url, width: 1200, height: 630, alt: data.title }] : [],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "blogDetail" });

  const { data: blog, error } = await supabase
    .from("hazaral_blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !blog) notFound();

  // Fetch related blogs (latest 3 excluding current)
  const { data: relatedBlogs } = await supabase
    .from("hazaral_blogs")
    .select("title, slug, excerpt, image_url, created_at")
    .neq("slug", slug)
    .limit(3)
    .order("created_at", { ascending: false });

  // Calculate Reading Time (assuming average 200 words per minute)
  const wordCount = blog.content ? blog.content.replace(/<[^>]*>?/gm, '').split(/\\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    datePublished: blog.created_at,
    publisher: {
      "@type": "Organization",
      name: "Oto Grade",
      url: SITE_URL,
    },
    ...(blog.image_url ? { image: blog.image_url } : {}),
  };

  const shareUrl = `${SITE_URL}${localeUrl(locale, `/blog/${slug}`)}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(blog.title + " " + shareUrl)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`;

  return (
    <>
      <Navbar />
      <main className="bg-surface pb-[76px] md:pb-32 pt-32">
        <Container>
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[13px] text-muted-text mb-24 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
            <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
            <ChevronRight size={14} className="opacity-50 flex-shrink-0" />
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <ChevronRight size={14} className="opacity-50 flex-shrink-0" />
            <span className="text-on-surface font-medium truncate max-w-[200px] sm:max-w-md">{blog.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 relative">
            
            {/* Main Content Area */}
            <div className="lg:col-span-8 flex flex-col gap-32">
              <div className="flex flex-col gap-16">
                <div className="flex flex-wrap items-center gap-16 text-[13px] text-muted-text">
                  <div className="flex items-center gap-6">
                    <Calendar size={14} className="text-primary" />
                    {new Date(blog.created_at).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-6 bg-surface-container-high px-10 py-4 rounded-full text-on-surface font-medium">
                    <Clock size={14} className="text-primary" />
                    {readingTime} Dk Okuma Süresi
                  </div>
                </div>
                <h1 className="text-[28px] md:text-[36px] font-bold text-on-surface tracking-[-1px] leading-tight">
                  {blog.title}
                </h1>
              </div>

              {blog.image_url && (
                <div className="w-full aspect-[16/9] bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] overflow-hidden shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] p-16 md:p-24 shadow-sm">
                <div
                  className="prose prose-sm md:prose-base prose-neutral max-w-none
                    prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-on-surface
                    prose-p:text-muted-text prose-p:leading-relaxed
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-li:text-muted-text prose-strong:text-on-surface"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>

              {/* Social Share Box */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-24 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] gap-16 shadow-sm">
                <div className="flex items-center gap-12">
                  <div className="w-40 h-40 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Share2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[15px] text-on-surface m-0">Bu yazıyı faydalı buldunuz mu?</h4>
                    <span className="text-[13px] text-muted-text">Arkadaşlarınızla ve çevrenizle paylaşın.</span>
                  </div>
                </div>
                <div className="flex items-center gap-12">
                  <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-8 px-16 py-8 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors font-medium text-[14px]">
                    WhatsApp
                  </a>
                  <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-8 px-16 py-8 rounded-full bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors font-medium text-[14px]">
                    Facebook
                  </a>
                  <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-8 px-16 py-8 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-colors font-medium text-[14px]">
                    Twitter
                  </a>
                </div>
              </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-32 flex flex-col gap-24">
                
                {/* Author Block */}
                <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[16px] p-24 shadow-sm flex items-start gap-16">
                  <div className="w-48 h-48 rounded-full bg-surface-container-high border-2 border-primary flex items-center justify-center overflow-hidden shrink-0">
                    <img src="/images/logo/rounded.svg" alt="Oto Grade Uzman Ekibi" className="w-24 h-24 object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[16px] text-on-surface mb-4">Oto Grade Uzman Ekibi</h4>
                    <p className="text-[13px] text-muted-text leading-relaxed m-0">Yılların getirdiği sektörel tecrübeyle hasarlı, pert ve hurda araç alımında güvenilir, şeffaf ve kurumsal çözümler üretiyoruz.</p>
                  </div>
                </div>

                {/* Sticky CTA Widget */}
                <div className="bg-[#1a1c1c] rounded-[16px] p-32 text-center shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 z-0 opacity-15 bg-primary" style={{ backgroundImage: "radial-gradient(circle at top right, var(--color-primary) 0%, transparent 70%)" }}></div>
                  <div className="relative z-10">
                    <div className="w-56 h-56 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-16 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                    </div>
                    <h3 className="text-[20px] font-bold text-white mb-12 leading-tight">Aracınızın Gerçek Değerini Öğrenin</h3>
                    <p className="text-[#cccccc] mb-24 text-[14px] leading-relaxed">Hasarlı aracınızı yok pahasına satmayın. Hemen ücretsiz ve anında kurumsal teklif alın.</p>
                    <Link href="/teklif-al" className="flex items-center justify-center bg-primary text-white px-24 py-12 rounded-full font-bold w-full hover:opacity-90 transition-all shadow-[0_0_15px_rgba(178,35,0,0.4)]">
                      Fiyat Teklifi Al
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Related Blogs Section */}
          {relatedBlogs && relatedBlogs.length > 0 && (
            <div className="mt-48 pt-48 border-t border-[0.5px] border-border-default">
              <div className="flex items-center justify-between mb-32">
                <h3 className="text-[24px] font-bold text-on-surface tracking-tight">İlginizi Çekebilir</h3>
                <Link href="/blog" className="text-[14px] font-medium text-primary hover:underline flex items-center gap-4">
                  Tüm Yazılar <ChevronRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
                {relatedBlogs.map((relBlog) => (
                  <Link href={{ pathname: "/blog/[slug]", params: { slug: relBlog.slug } }} key={relBlog.slug} className="group flex flex-col gap-16 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] overflow-hidden hover:border-primary/50 transition-colors shadow-sm">
                    {relBlog.image_url ? (
                      <div className="w-full aspect-[16/9] bg-surface-container-low overflow-hidden">
                        <img src={relBlog.image_url} alt={relBlog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ) : (
                      <div className="w-full aspect-[16/9] bg-surface-container-high flex items-center justify-center">
                        <span className="text-muted-text">Görsel Yok</span>
                      </div>
                    )}
                    <div className="p-20 pt-4 flex flex-col gap-8 flex-1">
                      <span className="text-[12px] text-muted-text font-medium">
                        {new Date(relBlog.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                      <h4 className="text-[16px] font-bold text-on-surface leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {relBlog.title}
                      </h4>
                      {relBlog.excerpt && (
                        <p className="text-[13px] text-muted-text line-clamp-2 mt-auto">
                          {relBlog.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </Container>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <MobileStickyCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </>
  );
}

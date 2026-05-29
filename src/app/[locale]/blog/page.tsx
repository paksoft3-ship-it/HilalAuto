"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, ArrowRight } from "lucide-react";
import { FaWhatsapp } from 'react-icons/fa';
import { Badge } from "@/components/ui/Badge";
import { externalRoutes, routes } from "@/lib/routes";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";

export default function BlogIndexPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useParams()?.locale as string ?? "tr";
  const t = useTranslations("blogPage");

  useEffect(() => {
    async function loadBlogs() {
      const { data } = await supabase
        .from("hazaral_blogs")
        .select("*")
        .eq("status", "published")
        .eq("locale", locale)
        .order("created_at", { ascending: false });
      setBlogs(data || []);
      setLoading(false);
    }
    loadBlogs();
  }, [locale]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-[76px] md:pb-0">
        <section className="bg-bg-surface border-b border-[0.5px] border-border-default py-44 md:py-60 mb-60">
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
                  href={routes.quote(locale)}
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

        <Container className="mb-60 md:mb-[100px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] h-[360px]"></div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-60 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px]">
              <p className="text-[14px] text-muted-text">{t("empty", { default: "Henüz yayınlanmış bir blog yazısı bulunmuyor." })}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
              {blogs.map((blog) => (
                <Link 
                  href={`/${locale}/blog/${blog.slug}`} 
                  key={blog.id}
                  className="group bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] overflow-hidden hover:border-primary transition-colors flex flex-col"
                >
                  <div className="aspect-[16/10] bg-surface relative overflow-hidden">
                    {blog.image_url ? (
                      <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-text text-[12px]">{t("noImage", { default: "Görsel Yok" })}</div>
                    )}
                  </div>
                  <div className="p-24 flex flex-col flex-1">
                    <div className="flex items-center gap-8 text-[12px] text-muted-text mb-12">
                      <Calendar size={14} /> {new Date(blog.created_at).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h3 className="text-[18px] font-medium text-on-surface mb-12 line-clamp-2 leading-tight">
                      {blog.title}
                    </h3>
                    <p className="text-[14px] text-muted-text line-clamp-3 mb-24">
                      {blog.excerpt}
                    </p>
                    <div className="mt-auto pt-16 border-t border-[0.5px] border-border-default flex items-center gap-8 text-[13px] font-medium text-primary">
                      {t("readMore", { default: "Devamını Oku" })} <ArrowRight size={14} />
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
    </>
  );
}

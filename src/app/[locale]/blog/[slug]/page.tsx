import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, ArrowLeft, Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Container } from "@/components/ui/Container";
import { SITE_URL } from "@/lib/constants";
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
    .select("title, image_url")
    .eq("slug", slug)
    .single();

  if (!data) return {};

  return {
    title: `${data.title} — HazarAl`,
    description: data.title,
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog/${slug}`,
    },
    openGraph: {
      title: `${data.title} — HazarAl`,
      description: data.title,
      locale: "tr_TR",
      type: "article",
      images: data.image_url ? [{ url: data.image_url, width: 1200, height: 630, alt: data.title }] : [],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  const { data: blog, error } = await supabase
    .from("hazaral_blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !blog) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    datePublished: blog.created_at,
    publisher: {
      "@type": "Organization",
      name: "HazarAl",
      url: SITE_URL,
    },
    ...(blog.image_url ? { image: blog.image_url } : {}),
  };

  return (
    <>
      <Navbar />
      <main className="bg-surface pb-[76px] md:pb-0 pt-32">
        <Container>
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-8 text-[13px] text-muted-text hover:text-on-surface transition-colors mb-32"
          >
            <ArrowLeft size={16} /> Blog&apos;a Dön
          </Link>

          <div className="flex flex-col gap-32">
            <div className="flex flex-col gap-16 text-center">
              <div className="flex items-center justify-center gap-8 text-[13px] text-muted-text">
                <Calendar size={14} />
                {new Date(blog.created_at).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <h1 className="text-[28px] md:text-[36px] font-bold text-on-surface tracking-[-1px] leading-tight">
                {blog.title}
              </h1>
            </div>

            {blog.image_url && (
              <div className="w-full aspect-[16/9] bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] p-24 md:p-32">
              <div
                className="prose prose-sm md:prose-base prose-neutral max-w-none
                  prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-on-surface
                  prose-p:text-muted-text prose-p:leading-relaxed
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>

            <div className="flex items-center justify-between py-24 border-t border-[0.5px] border-border-default">
              <span className="text-[14px] font-medium text-on-surface">Bu yazıyı paylaş:</span>
              <div className="flex items-center gap-16">
                <Share2 size={20} className="text-muted-text" />
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <MobileStickyCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </>
  );
}

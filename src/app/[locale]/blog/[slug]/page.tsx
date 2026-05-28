"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Container } from "@/components/ui/Container";
import { useParams, notFound } from "next/navigation";
import { Calendar, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";

export default function BlogDetailPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const slug = params?.slug as string;
  const locale = params?.locale as string ?? "tr";

  useEffect(() => {
    async function loadBlog() {
      if (!slug) return;
      const { data, error } = await supabase.from("hazaral_blogs").select("*").eq("slug", slug).single();
      
      if (error || !data) {
        notFound();
      } else {
        setBlog(data);
      }
      setLoading(false);
    }
    loadBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-surface py-60 min-h-screen">
        <Container className="max-w-[800px]">
          <div className="animate-pulse flex flex-col gap-32">
            <div className="h-32 bg-surface-container-lowest border border-border-default rounded w-1/3"></div>
            <div className="h-64 bg-surface-container-lowest border border-border-default rounded w-3/4"></div>
            <div className="w-full h-[400px] bg-surface-container-lowest border border-border-default rounded-[14px]"></div>
            <div className="h-20 bg-surface-container-lowest border border-border-default rounded w-full"></div>
            <div className="h-20 bg-surface-container-lowest border border-border-default rounded w-full"></div>
            <div className="h-20 bg-surface-container-lowest border border-border-default rounded w-5/6"></div>
          </div>
        </Container>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="bg-surface pb-60 pt-32">
      <Container className="max-w-[800px]">
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
              {new Date(blog.created_at).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <h1 className="text-[28px] md:text-[36px] font-bold text-on-surface tracking-[-1px] leading-tight">
              {blog.title}
            </h1>
          </div>

          {blog.image_url && (
            <div className="w-full aspect-[16/9] bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] overflow-hidden">
              <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] p-24 md:p-44">
            {/* 
              In a real scenario, you'd use a safe HTML parser like DOMPurify or marked (if markdown).
              For this implementation, assuming content is basic HTML strings from a rich text editor.
            */}
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
              <button className="text-muted-text hover:text-primary transition-colors">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

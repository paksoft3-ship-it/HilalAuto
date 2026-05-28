"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, ArrowRight } from "lucide-react";

export default function BlogIndexPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useParams()?.locale as string ?? "tr";

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
    <div className="bg-surface pb-60 pt-32 min-h-screen">
      <Container>
        <SectionHeader
          badge="Blog"
          title="Sektörel Haberler ve Rehberler"
          subtitle="Hasarlı araç sektörü, araç değer kaybı ve sigorta işlemleri hakkında güncel bilgiler."
          align="left"
          className="mb-44"
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] h-[360px]"></div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-60 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px]">
            <p className="text-[14px] text-muted-text">Henüz yayınlanmış bir blog yazısı bulunmuyor.</p>
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
                    <div className="w-full h-full flex items-center justify-center text-muted-text text-[12px]">Görsel Yok</div>
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
                    Devamını Oku <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

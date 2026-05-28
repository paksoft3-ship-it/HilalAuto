"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit, Trash2, Image as ImageIcon, Eye, RefreshCw, Calendar } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AdminBlogs() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const locale = useParams()?.locale as string ?? "tr";

  async function fetchBlogs() {
    setLoading(true);
    const { data } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
    setBlogs(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase.from("blogs").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setBlogs(blogs.map(blog => blog.id === id ? { ...blog, status: newStatus } : blog));
    }
  }

  async function deleteBlog(id: string) {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (!error) {
      setBlogs(blogs.filter(blog => blog.id !== id));
    }
  }

  return (
    <div className="flex flex-col gap-32">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-16">
        <div>
          <h1 className="text-[24px] font-bold text-on-surface tracking-[-1px]">Blog Yönetimi</h1>
          <p className="text-[14px] text-muted-text mt-4">SEO uyumlu blog yazılarınızı oluşturun ve düzenleyin.</p>
        </div>
        <div className="flex gap-12">
          <button 
            onClick={fetchBlogs}
            className="inline-flex items-center gap-8 px-16 py-8 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-btn text-[13px] font-medium text-on-surface hover:bg-surface transition-colors"
          >
            <RefreshCw size={14} /> Yenile
          </button>
          <button className="inline-flex items-center gap-8 px-16 py-8 bg-primary text-on-primary rounded-btn text-[13px] font-medium hover:opacity-90 transition-opacity">
            <Plus size={14} /> Yeni Yazı
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[0.5px] border-border-default bg-surface">
                <th className="py-16 px-16 text-[12px] font-medium text-muted-text uppercase tracking-wider">Görsel</th>
                <th className="py-16 px-16 text-[12px] font-medium text-muted-text uppercase tracking-wider">Başlık</th>
                <th className="py-16 px-16 text-[12px] font-medium text-muted-text uppercase tracking-wider">Tarih</th>
                <th className="py-16 px-16 text-[12px] font-medium text-muted-text uppercase tracking-wider">Dil</th>
                <th className="py-16 px-16 text-[12px] font-medium text-muted-text uppercase tracking-wider">Durum</th>
                <th className="py-16 px-16 text-[12px] font-medium text-muted-text uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-32 text-center text-[14px] text-muted-text">Yükleniyor...</td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-32 text-center text-[14px] text-muted-text">Henüz blog yazısı bulunmuyor.</td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.id} className="border-b border-[0.5px] border-border-default last:border-0 hover:bg-surface transition-colors">
                    <td className="py-16 px-16">
                      <div className="w-[60px] h-[40px] bg-surface border border-[0.5px] border-border-default rounded flex items-center justify-center overflow-hidden">
                        {blog.image_url ? (
                          <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={16} className="text-muted-text" />
                        )}
                      </div>
                    </td>
                    <td className="py-16 px-16 text-[13px] text-on-surface">
                      <div className="font-medium max-w-[300px] truncate">{blog.title}</div>
                      <div className="text-[11px] text-muted-text mt-4 max-w-[300px] truncate">{blog.excerpt}</div>
                    </td>
                    <td className="py-16 px-16 text-[13px] text-on-surface">
                      <div className="flex items-center gap-6">
                        <Calendar size={14} className="text-muted-text" />
                        {new Date(blog.created_at).toLocaleDateString("tr-TR")}
                      </div>
                    </td>
                    <td className="py-16 px-16 text-[13px] text-on-surface uppercase font-medium">
                      {blog.locale}
                    </td>
                    <td className="py-16 px-16">
                      <select
                        value={blog.status}
                        onChange={(e) => updateStatus(blog.id, e.target.value)}
                        className={`text-[12px] font-medium outline-none cursor-pointer py-4 px-8 rounded-full border border-[0.5px] ${
                          blog.status === 'published' ? 'bg-green-50 text-green-600 border-green-200' :
                          'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        <option value="published">Yayında</option>
                        <option value="draft">Taslak</option>
                      </select>
                    </td>
                    <td className="py-16 px-16 text-right">
                      <div className="flex items-center justify-end gap-12">
                        <Link 
                          href={`/${blog.locale}/blog/${blog.slug}`} 
                          target="_blank"
                          className="p-8 text-muted-text hover:text-primary transition-colors"
                          title="Görüntüle"
                        >
                          <Eye size={16} />
                        </Link>
                        <button className="p-8 text-muted-text hover:text-blue-500 transition-colors" title="Düzenle">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => deleteBlog(blog.id)} className="p-8 text-muted-text hover:text-red-500 transition-colors" title="Sil">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

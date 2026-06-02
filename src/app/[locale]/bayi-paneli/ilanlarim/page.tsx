"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Listing } from "@/types/marketplace";
import { GradeBadge } from "@/components/marketplace/GradeBadge";
import { Link } from "@/i18n/routing";
import { formatPrice, daysBetween } from "@/lib/dealer-utils";
import { Plus, Edit, Trash2, Eye, EyeOff, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  active:         { label: "Yayında",    cls: "bg-green-100 text-green-700" },
  pending_review: { label: "İnceleniyor", cls: "bg-amber-100 text-amber-700" },
  draft:          { label: "Taslak",     cls: "bg-gray-100 text-gray-600" },
  sold:           { label: "Satıldı",    cls: "bg-blue-100 text-blue-700" },
  rejected:       { label: "Reddedildi", cls: "bg-red-100 text-red-700" },
  expired:        { label: "Süresi Doldu", cls: "bg-gray-100 text-gray-500" },
};

export default function IlanlarimPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setDealerId] = useState("");

  async function load() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: d } = await supabase.from("hazaral_dealers").select("id").eq("user_id", session.user.id).single();
    if (!d) return;
    setDealerId(d.id);

    const { data } = await supabase
      .from("hazaral_listings")
      .select("*")
      .eq("dealer_id", d.id)
      .order("created_at", { ascending: false });

    setListings((data as Listing[]) || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleStatus(id: string, current: string) {
    const next = current === "active" ? "draft" : "active";
    const { error } = await supabase.from("hazaral_listings").update({ status: next }).eq("id", id);
    if (!error) setListings((ls) => ls.map((l) => l.id === id ? { ...l, status: next as Listing["status"] } : l));
  }

  async function deleteListing(id: string) {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("hazaral_listings").delete().eq("id", id);
    if (!error) setListings((ls) => ls.filter((l) => l.id !== id));
  }

  const conv = (l: Listing) => l.view_count > 0
    ? ((l.whatsapp_click_count + l.phone_click_count) / l.view_count * 100).toFixed(1)
    : "0.0";

  return (
    <div className="flex flex-col gap-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
        <div>
          <h1 className="text-[22px] font-bold text-on-surface tracking-[-0.5px]">İlanlarım</h1>
          <p className="text-[13px] text-muted-text mt-4">{listings.length} ilan</p>
        </div>
        <div className="flex gap-10">
          <button onClick={load} className="flex items-center gap-8 px-16 py-9 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-btn text-[13px] font-medium text-on-surface hover:bg-surface">
            <RefreshCw size={13} /> Yenile
          </button>
          <Link href="/bayi-paneli/ilan-ekle" className="flex items-center gap-8 px-16 py-9 bg-primary text-white rounded-btn text-[13px] font-semibold hover:opacity-90">
            <Plus size={13} /> Yeni İlan
          </Link>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-[0.5px] border-border-default bg-surface">
                {["İlan", "Durum", "Fiyat", "Görüntülenme", "WhatsApp", "Dönüşüm", "Son Kullanma", "İşlemler"].map((h) => (
                  <th key={h} className="py-12 px-14 text-[11px] font-medium text-muted-text uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="py-32 text-center text-muted-text text-[13px]">Yükleniyor...</td></tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-40 text-center">
                    <p className="text-[14px] text-muted-text mb-12">Henüz ilan eklemediniz.</p>
                    <Link href="/bayi-paneli/ilan-ekle" className="text-[13px] text-primary hover:underline">İlk ilanınızı ekleyin →</Link>
                  </td>
                </tr>
              ) : listings.map((l) => {
                const s = STATUS_LABELS[l.status] || { label: l.status, cls: "bg-gray-100 text-gray-600" };
                const expiresIn = l.expires_at ? daysBetween(new Date().toISOString(), l.expires_at) : null;

                return (
                  <tr key={l.id} className="border-b border-[0.5px] border-border-default last:border-0 hover:bg-surface transition-colors">
                    <td className="py-12 px-14">
                      <div className="flex items-center gap-10">
                        <div className="w-[50px] h-[38px] bg-surface rounded overflow-hidden shrink-0">
                          {l.primary_image || l.images[0] ? (
                            <img src={l.primary_image || l.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : <div className="w-full h-full bg-surface-container-low" />}
                        </div>
                        <div>
                          <div className="text-[12px] font-medium text-on-surface max-w-[180px] truncate">{l.title}</div>
                          <div className="flex items-center gap-6 mt-2">
                            <GradeBadge grade={l.damage_grade} size="sm" />
                            <span className="text-[10px] text-muted-text">{l.year} · {l.city}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-12 px-14">
                      <span className={cn("inline-block px-8 py-4 rounded-full text-[11px] font-medium", s.cls)}>{s.label}</span>
                    </td>
                    <td className="py-12 px-14 text-[12px] font-semibold text-primary whitespace-nowrap">
                      {formatPrice(l.asking_price)}
                    </td>
                    <td className="py-12 px-14 text-[12px] text-on-surface">{l.view_count}</td>
                    <td className="py-12 px-14 text-[12px] text-on-surface">{l.whatsapp_click_count}</td>
                    <td className="py-12 px-14">
                      <span className={cn("text-[11px] font-semibold",
                        parseFloat(conv(l)) >= 5 ? "text-green-600" :
                        parseFloat(conv(l)) >= 2 ? "text-amber-600" : "text-red-500"
                      )}>%{conv(l)}</span>
                    </td>
                    <td className="py-12 px-14 text-[11px] text-muted-text whitespace-nowrap">
                      {expiresIn !== null ? (expiresIn <= 0 ? "Süresi doldu" : `${expiresIn}g kaldı`) : "—"}
                    </td>
                    <td className="py-12 px-14">
                      <div className="flex items-center gap-8">
                        <Link href={{ pathname: "/bayi-paneli/ilan-duzenle/[id]", params: { id: l.id } } as never} className="p-6 text-muted-text hover:text-blue-500 transition-colors" title="Düzenle">
                          <Edit size={14} />
                        </Link>
                        <button onClick={() => toggleStatus(l.id, l.status)} className="p-6 text-muted-text hover:text-amber-500 transition-colors" title={l.status === "active" ? "Pasife Al" : "Yayınla"}>
                          {l.status === "active" ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button onClick={() => deleteListing(l.id)} className="p-6 text-muted-text hover:text-red-500 transition-colors" title="Sil">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

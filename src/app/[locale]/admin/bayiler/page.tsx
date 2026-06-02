"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Dealer } from "@/types/marketplace";
import { CheckCircle, XCircle, ShieldCheck, RefreshCw, Download, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending:   { label: "Bekliyor",  cls: "bg-amber-100 text-amber-700" },
  active:    { label: "Aktif",     cls: "bg-green-100 text-green-700" },
  suspended: { label: "Askıda",   cls: "bg-red-100 text-red-600" },
  expired:   { label: "Süresi Doldu", cls: "bg-gray-100 text-gray-500" },
};

const PLAN_PRICES: Record<string, number> = { basic: 4999, professional: 9999, premium: 19999 };

export default function AdminBayiler() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendTarget, setSuspendTarget] = useState<string | null>(null);
  const [noteTarget, setNoteTarget] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("hazaral_dealers")
      .select("*")
      .order("created_at", { ascending: false });
    setDealers((data as Dealer[]) || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function approve(id: string) {
    setSaving(true);
    const now = new Date();
    const dealer = dealers.find((d) => d.id === id);
    const days = dealer?.subscription_plan === "professional" ? 60 : dealer?.subscription_plan === "premium" ? 90 : 30;
    const end = new Date(now.getTime() + days * 86400000).toISOString();

    await supabase.from("hazaral_dealers").update({
      is_approved: true,
      subscription_status: "active",
      subscription_start: now.toISOString(),
      subscription_end: end,
    }).eq("id", id);

    // Send notification
    await supabase.from("hazaral_notifications").insert({
      dealer_id: id,
      type: "listing_approved",
      title: "Başvurunuz Onaylandı",
      body: "Otograde bayi başvurunuz onaylandı. Artık ilan ekleyebilirsiniz.",
    });

    await load();
    setSaving(false);
  }

  async function suspend(id: string) {
    setSaving(true);
    await supabase.from("hazaral_dealers").update({
      subscription_status: "suspended",
      notes: suspendReason || null,
    }).eq("id", id);

    await supabase.from("hazaral_notifications").insert({
      dealer_id: id,
      type: "listing_rejected",
      title: "Hesabınız Askıya Alındı",
      body: suspendReason || "Hesabınız askıya alınmıştır. Detay için iletişime geçin.",
    });

    setSuspendTarget(null);
    setSuspendReason("");
    await load();
    setSaving(false);
  }

  async function verify(id: string, current: boolean) {
    await supabase.from("hazaral_dealers").update({ is_verified: !current }).eq("id", id);
    setDealers((ds) => ds.map((d) => d.id === id ? { ...d, is_verified: !current } : d));
  }

  async function saveNote() {
    if (!noteTarget) return;
    setSaving(true);
    await supabase.from("hazaral_dealers").update({ notes: noteText }).eq("id", noteTarget);
    setNoteTarget(null);
    setNoteText("");
    setSaving(false);
  }

  function exportCSV() {
    const header = "Firma,İletişim,Email,Şehir,Plan,Durum,İlan,Görüntülenme,İletişim,Üyelik Başlangıcı";
    const rows = filtered.map((d) =>
      [d.company_name, d.contact_name, d.email, d.city, d.subscription_plan || "", d.subscription_status,
       d.total_listings, d.total_views, d.total_contacts, d.created_at?.slice(0, 10)].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bayiler-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = dealers.filter((d) => {
    const matchSearch = !search ||
      d.company_name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || d.subscription_status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
        <div>
          <h1 className="text-[24px] font-bold text-on-surface tracking-[-1px]">Bayi Yönetimi</h1>
          <p className="text-[13px] text-muted-text mt-4">{dealers.length} bayi · {dealers.filter(d => d.subscription_status === "pending").length} bekliyor</p>
        </div>
        <div className="flex gap-10">
          <button onClick={load} className="flex items-center gap-8 px-14 py-8 border border-[0.5px] border-border-default rounded-btn text-[12px] text-muted-text hover:border-primary bg-surface-container-lowest">
            <RefreshCw size={12} /> Yenile
          </button>
          <button onClick={exportCSV} className="flex items-center gap-8 px-14 py-8 border border-[0.5px] border-border-default rounded-btn text-[12px] text-muted-text hover:border-primary bg-surface-container-lowest">
            <Download size={12} /> CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-10">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-12 top-1/2 -translate-y-1/2 text-muted-text" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Firma adı, e-posta veya şehir ara..."
            className="w-full pl-36 pr-16 py-10 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-input text-[13px] outline-none focus:border-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-14 py-10 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-input text-[13px] outline-none focus:border-primary"
        >
          <option value="all">Tüm Durumlar</option>
          <option value="pending">Bekliyor</option>
          <option value="active">Aktif</option>
          <option value="suspended">Askıda</option>
          <option value="expired">Süresi Doldu</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-[0.5px] border-border-default bg-surface">
                {["Firma", "İletişim", "Şehir", "Plan", "Durum", "İlan", "Görüntülenme", "Abonelik Bitiş", "İşlemler"].map((h) => (
                  <th key={h} className="py-12 px-14 text-[11px] font-medium text-muted-text uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="py-32 text-center text-muted-text text-[13px]">Yükleniyor...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="py-32 text-center text-muted-text text-[13px]">Bayi bulunamadı.</td></tr>
              ) : filtered.map((d) => {
                const s = STATUS_LABELS[d.subscription_status] || { label: d.subscription_status, cls: "bg-gray-100 text-gray-500" };
                const endDate = d.subscription_end ? new Date(d.subscription_end).toLocaleDateString("tr-TR") : "—";
                return (
                  <tr key={d.id} className="border-b border-[0.5px] border-border-default last:border-0 hover:bg-surface transition-colors">
                    <td className="py-12 px-14 text-[13px] text-on-surface font-medium">
                      <div className="flex items-center gap-8">
                        {d.is_verified && <ShieldCheck size={13} className="text-primary shrink-0" />}
                        <span className="truncate max-w-[160px]">{d.company_name}</span>
                      </div>
                    </td>
                    <td className="py-12 px-14 text-[12px] text-muted-text">
                      <div>{d.contact_name}</div>
                      <div className="text-[10px]">{d.email}</div>
                    </td>
                    <td className="py-12 px-14 text-[12px] text-on-surface">{d.city}</td>
                    <td className="py-12 px-14 text-[12px] text-on-surface capitalize">
                      {d.subscription_plan || "—"}
                      {d.subscription_plan && (
                        <div className="text-[10px] text-muted-text">{PLAN_PRICES[d.subscription_plan]?.toLocaleString("tr-TR")} TL/ay</div>
                      )}
                    </td>
                    <td className="py-12 px-14">
                      <span className={cn("inline-block px-8 py-4 rounded-full text-[11px] font-medium", s.cls)}>{s.label}</span>
                    </td>
                    <td className="py-12 px-14 text-[12px] text-on-surface">{d.total_listings}</td>
                    <td className="py-12 px-14 text-[12px] text-on-surface">{d.total_views.toLocaleString("tr-TR")}</td>
                    <td className="py-12 px-14 text-[11px] text-muted-text whitespace-nowrap">{endDate}</td>
                    <td className="py-12 px-14">
                      <div className="flex items-center gap-6">
                        {d.subscription_status === "pending" && (
                          <button
                            onClick={() => approve(d.id)}
                            disabled={saving}
                            className="p-6 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Onayla"
                          >
                            <CheckCircle size={15} />
                          </button>
                        )}
                        {d.subscription_status === "active" && (
                          <button
                            onClick={() => setSuspendTarget(d.id)}
                            className="p-6 text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Askıya Al"
                          >
                            <XCircle size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => verify(d.id, d.is_verified)}
                          className={cn("p-6 rounded transition-colors", d.is_verified ? "text-primary hover:bg-primary/10" : "text-muted-text hover:bg-surface")}
                          title={d.is_verified ? "Onaylı Rozeti Kaldır" : "Onaylı Bayi Yap"}
                        >
                          <ShieldCheck size={15} />
                        </button>
                        <button
                          onClick={() => { setNoteTarget(d.id); setNoteText(d.notes || ""); }}
                          className="p-6 text-muted-text hover:text-on-surface hover:bg-surface rounded transition-colors text-[10px]"
                          title="Not Ekle"
                        >
                          📝
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

      {/* Suspend modal */}
      {suspendTarget && (
        <Modal title="Hesabı Askıya Al" onClose={() => setSuspendTarget(null)}>
          <p className="text-[13px] text-muted-text mb-16">Askıya alma sebebini girin (isteğe bağlı — bayiye bildirim gönderilecek):</p>
          <textarea
            rows={3}
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
            placeholder="Sebep..."
            className="w-full px-14 py-10 bg-surface border border-[0.5px] border-border-default rounded-input text-[13px] outline-none focus:border-primary resize-none mb-16"
          />
          <div className="flex gap-10 justify-end">
            <button onClick={() => setSuspendTarget(null)} className="px-20 py-10 text-[13px] text-muted-text hover:text-on-surface">İptal</button>
            <button
              onClick={() => suspend(suspendTarget)}
              disabled={saving}
              className="px-20 py-10 bg-red-600 text-white text-[13px] font-semibold rounded-btn hover:opacity-90 disabled:opacity-60"
            >
              Askıya Al
            </button>
          </div>
        </Modal>
      )}

      {/* Note modal */}
      {noteTarget && (
        <Modal title="İç Not" onClose={() => setNoteTarget(null)}>
          <textarea
            rows={4}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Bayi hakkında notunuz..."
            className="w-full px-14 py-10 bg-surface border border-[0.5px] border-border-default rounded-input text-[13px] outline-none focus:border-primary resize-none mb-16"
          />
          <div className="flex gap-10 justify-end">
            <button onClick={() => setNoteTarget(null)} className="px-20 py-10 text-[13px] text-muted-text">İptal</button>
            <button onClick={saveNote} disabled={saving} className="px-20 py-10 bg-primary text-white text-[13px] font-semibold rounded-btn hover:opacity-90 disabled:opacity-60">
              Kaydet
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children }: { title: string; children: React.ReactNode; onClose?: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-16 bg-black/50">
      <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card w-full max-w-[460px] p-24">
        <h3 className="text-[16px] font-semibold text-on-surface mb-16">{title}</h3>
        {children}
      </div>
    </div>
  );
}

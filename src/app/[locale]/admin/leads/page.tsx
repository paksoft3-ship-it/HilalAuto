"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Clock, Phone, Trash2, RefreshCw } from "lucide-react";

export default function AdminLeads() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchLeads() {
    setLoading(true);
    const { data } = await supabase.from("hazaral_leads").select("*").order("created_at", { ascending: false });
    setLeads(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase.from("hazaral_leads").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
    } else {
      alert("Durum güncellenirken bir hata oluştu.");
    }
  }

  async function deleteLead(id: string) {
    if (!confirm("Bu talebi silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("hazaral_leads").delete().eq("id", id);
    if (!error) {
      setLeads(leads.filter(lead => lead.id !== id));
    } else {
      alert("Talep silinirken bir hata oluştu.");
    }
  }

  return (
    <div className="flex flex-col gap-32">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-16">
        <div>
          <h1 className="text-[24px] font-bold text-on-surface tracking-[-1px]">Talepler</h1>
          <p className="text-[14px] text-muted-text mt-4">Müşterilerden gelen araç alım ve iletişim talepleri.</p>
        </div>
        <button 
          onClick={fetchLeads}
          className="inline-flex items-center gap-8 px-16 py-8 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-btn text-[13px] font-medium text-on-surface hover:bg-surface transition-colors"
        >
          <RefreshCw size={14} /> Yenile
        </button>
      </div>

      <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[0.5px] border-border-default bg-surface">
                <th className="py-16 px-16 text-[12px] font-medium text-muted-text uppercase tracking-wider">Tarih</th>
                <th className="py-16 px-16 text-[12px] font-medium text-muted-text uppercase tracking-wider">İletişim</th>
                <th className="py-16 px-16 text-[12px] font-medium text-muted-text uppercase tracking-wider">Araç Bilgisi</th>
                <th className="py-16 px-16 text-[12px] font-medium text-muted-text uppercase tracking-wider">Kaynak</th>
                <th className="py-16 px-16 text-[12px] font-medium text-muted-text uppercase tracking-wider">Durum</th>
                <th className="py-16 px-16 text-[12px] font-medium text-muted-text uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-32 text-center text-[14px] text-muted-text">Yükleniyor...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-32 text-center text-[14px] text-muted-text">Henüz talep bulunmuyor.</td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-[0.5px] border-border-default last:border-0 hover:bg-surface transition-colors">
                    <td className="py-16 px-16 text-[13px] text-on-surface whitespace-nowrap">
                      <div className="flex items-center gap-6">
                        <Clock size={14} className="text-muted-text" />
                        {new Date(lead.created_at).toLocaleString("tr-TR")}
                      </div>
                    </td>
                    <td className="py-16 px-16 text-[13px] text-on-surface">
                      <div className="flex items-center gap-6">
                        <Phone size={14} className="text-muted-text" />
                        <a href={`tel:${lead.phone}`} className="hover:text-primary transition-colors">{lead.phone}</a>
                      </div>
                      {lead.city && <span className="block text-[11px] text-muted-text mt-4 ml-20">{lead.city}</span>}
                    </td>
                    <td className="py-16 px-16 text-[13px] text-on-surface">
                      {lead.brand ? (
                        <>
                          <div className="font-medium">{lead.brand} {lead.model_year}</div>
                          {lead.damage_type && <div className="text-[11px] text-muted-text mt-4">{lead.damage_type}</div>}
                        </>
                      ) : (
                        <span className="text-muted-text italic">Belirtilmedi</span>
                      )}
                    </td>
                    <td className="py-16 px-16 text-[13px] text-on-surface">
                      <span className="px-8 py-4 bg-surface border border-[0.5px] border-border-default rounded text-[11px] text-muted-text">
                        {lead.source === 'quick_quote' ? 'Hızlı Teklif' : 'İletişim'}
                      </span>
                    </td>
                    <td className="py-16 px-16">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className={`text-[12px] font-medium outline-none cursor-pointer py-4 px-8 rounded-full border border-[0.5px] ${
                          lead.status === 'new' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                          lead.status === 'contacted' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                          'bg-green-50 text-green-600 border-green-200'
                        }`}
                      >
                        <option value="new">Yeni</option>
                        <option value="contacted">İletişime Geçildi</option>
                        <option value="closed">Kapandı</option>
                      </select>
                    </td>
                    <td className="py-16 px-16 text-right">
                      <button 
                        onClick={() => deleteLead(lead.id)}
                        className="p-8 text-muted-text hover:text-red-500 transition-colors"
                        title="Sil"
                      >
                        <Trash2 size={16} />
                      </button>
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

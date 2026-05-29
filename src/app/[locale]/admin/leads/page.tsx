"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Clock, Phone, Trash2, RefreshCw, Eye, X } from "lucide-react";

export default function AdminLeads() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

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
                    <td className="py-16 px-16 text-right space-x-8">
                      <button 
                        onClick={() => setSelectedLead(lead)}
                        className="p-8 text-muted-text hover:text-primary transition-colors inline-flex"
                        title="İncele"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => deleteLead(lead.id)}
                        className="p-8 text-muted-text hover:text-red-500 transition-colors inline-flex"
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

      {/* Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-16 md:p-32 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-2xl border border-[0.5px] border-border-default overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between px-24 py-20 border-b border-[0.5px] border-border-default bg-surface-container-lowest">
              <h2 className="text-[18px] font-bold text-on-surface tracking-tight">Talep Detayları</h2>
              <button 
                onClick={() => setSelectedLead(null)}
                className="text-muted-text hover:text-on-surface transition-colors p-4"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-24 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                
                {/* Araç Bilgileri */}
                <div className="flex flex-col gap-12 bg-surface-container-lowest p-16 rounded-[12px] border border-[0.5px] border-border-default">
                  <h3 className="text-[14px] font-semibold text-on-surface border-b border-[0.5px] border-border-default pb-8 mb-4">Araç Bilgileri</h3>
                  <div className="flex flex-col gap-4">
                    <span className="text-[11px] uppercase tracking-wider text-muted-text">Marka / Model</span>
                    <span className="text-[14px] text-on-surface font-medium">{selectedLead.brand || '-'}</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="text-[11px] uppercase tracking-wider text-muted-text">Model Yılı</span>
                    <span className="text-[14px] text-on-surface font-medium">{selectedLead.model_year || '-'}</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="text-[11px] uppercase tracking-wider text-muted-text">Hasar Türü</span>
                    <span className="text-[14px] text-on-surface font-medium">{selectedLead.damage_type || '-'}</span>
                  </div>
                </div>

                {/* İletişim Bilgileri */}
                <div className="flex flex-col gap-12 bg-surface-container-lowest p-16 rounded-[12px] border border-[0.5px] border-border-default">
                  <h3 className="text-[14px] font-semibold text-on-surface border-b border-[0.5px] border-border-default pb-8 mb-4">İletişim Bilgileri</h3>
                  <div className="flex flex-col gap-4">
                    <span className="text-[11px] uppercase tracking-wider text-muted-text">Telefon Numarası</span>
                    <a href={`tel:${selectedLead.phone}`} className="text-[14px] text-primary hover:underline font-medium">{selectedLead.phone}</a>
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="text-[11px] uppercase tracking-wider text-muted-text">İl / İlçe (Ad Soyad)</span>
                    <span className="text-[14px] text-on-surface font-medium">{selectedLead.city || '-'}</span>
                  </div>
                </div>

                {/* Diğer Bilgiler */}
                <div className="flex flex-col gap-12 bg-surface-container-lowest p-16 rounded-[12px] border border-[0.5px] border-border-default md:col-span-2">
                  <h3 className="text-[14px] font-semibold text-on-surface border-b border-[0.5px] border-border-default pb-8 mb-4">Diğer Bilgiler</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-16">
                    <div className="flex flex-col gap-4">
                      <span className="text-[11px] uppercase tracking-wider text-muted-text">Talep Tarihi</span>
                      <span className="text-[13px] text-on-surface font-medium">{new Date(selectedLead.created_at).toLocaleString("tr-TR")}</span>
                    </div>
                    <div className="flex flex-col gap-4">
                      <span className="text-[11px] uppercase tracking-wider text-muted-text">Kaynak</span>
                      <span className="text-[13px] text-on-surface font-medium">{selectedLead.source === 'quick_quote' ? 'Hızlı Teklif' : 'İletişim Formu'}</span>
                    </div>
                    <div className="flex flex-col gap-4">
                      <span className="text-[11px] uppercase tracking-wider text-muted-text">Durum</span>
                      <select
                        value={selectedLead.status}
                        onChange={(e) => {
                          updateStatus(selectedLead.id, e.target.value);
                          setSelectedLead({ ...selectedLead, status: e.target.value });
                        }}
                        className={`text-[12px] font-medium outline-none cursor-pointer py-4 px-8 w-max rounded-full border border-[0.5px] ${
                          selectedLead.status === 'new' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                          selectedLead.status === 'contacted' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                          'bg-green-50 text-green-600 border-green-200'
                        }`}
                      >
                        <option value="new">Yeni</option>
                        <option value="contacted">İletişime Geçildi</option>
                        <option value="closed">Kapandı</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-24 py-16 border-t border-[0.5px] border-border-default bg-surface-container-lowest flex justify-end">
              <button 
                onClick={() => setSelectedLead(null)}
                className="px-24 py-12 bg-primary text-white text-[13px] font-medium rounded-btn hover:opacity-90 transition-opacity"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Car, FileText, TrendingUp, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    leads: 0,
    cars: 0,
    blogs: 0,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      // Get counts
      const [
        { count: leadsCount },
        { count: carsCount },
        { count: blogsCount },
        { data: leads }
      ] = await Promise.all([
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("cars").select("*", { count: "exact", head: true }),
        supabase.from("blogs").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5)
      ]);

      setStats({
        leads: leadsCount || 0,
        cars: carsCount || 0,
        blogs: blogsCount || 0,
      });
      setRecentLeads(leads || []);
      setLoading(false);
    }
    
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="animate-pulse flex flex-col gap-16"><div className="h-32 bg-border-default rounded w-1/4"></div><div className="h-64 bg-border-default rounded"></div></div>;
  }

  const statCards = [
    { label: "Toplam Talep", value: stats.leads, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Satılık Araçlar", value: stats.cars, icon: Car, color: "text-green-500", bg: "bg-green-50" },
    { label: "Blog Yazıları", value: stats.blogs, icon: FileText, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="flex flex-col gap-32">
      <div>
        <h1 className="text-[24px] font-bold text-on-surface tracking-[-1px]">Dashboard</h1>
        <p className="text-[14px] text-muted-text mt-4">Sistemin genel durumu ve özet istatistikler.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] p-24 flex items-center gap-16">
            <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0 ${stat.bg}`}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <div>
              <p className="text-[13px] text-muted-text">{stat.label}</p>
              <p className="text-[24px] font-bold text-on-surface">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-[14px] p-24">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-[16px] font-medium text-on-surface flex items-center gap-8">
            <TrendingUp size={18} className="text-primary" /> Son Talepler
          </h2>
        </div>
        
        {recentLeads.length === 0 ? (
          <div className="text-center py-32 text-muted-text text-[14px]">
            Henüz hiç talep yok.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[0.5px] border-border-default">
                  <th className="py-12 px-8 text-[12px] font-medium text-muted-text uppercase tracking-wider">Tarih</th>
                  <th className="py-12 px-8 text-[12px] font-medium text-muted-text uppercase tracking-wider">Müşteri</th>
                  <th className="py-12 px-8 text-[12px] font-medium text-muted-text uppercase tracking-wider">Araç</th>
                  <th className="py-12 px-8 text-[12px] font-medium text-muted-text uppercase tracking-wider">Durum</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-[0.5px] border-border-default last:border-0 hover:bg-surface transition-colors">
                    <td className="py-12 px-8 text-[13px] text-on-surface whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <Clock size={14} className="text-muted-text" />
                        {new Date(lead.created_at).toLocaleDateString("tr-TR")}
                      </div>
                    </td>
                    <td className="py-12 px-8 text-[13px] text-on-surface">
                      {lead.phone}
                    </td>
                    <td className="py-12 px-8 text-[13px] text-on-surface">
                      {lead.brand || "-"} {lead.model_year || ""}
                      {lead.damage_type && <span className="block text-[11px] text-muted-text">{lead.damage_type}</span>}
                    </td>
                    <td className="py-12 px-8">
                      <span className={`inline-flex items-center px-8 py-4 rounded-full text-[11px] font-medium ${
                        lead.status === 'new' ? 'bg-blue-50 text-blue-600' :
                        lead.status === 'contacted' ? 'bg-orange-50 text-orange-600' :
                        'bg-green-50 text-green-600'
                      }`}>
                        {lead.status === 'new' ? 'Yeni' : lead.status === 'contacted' ? 'İletişime Geçildi' : 'Kapandı'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

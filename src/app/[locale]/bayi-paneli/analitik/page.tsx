"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Listing } from "@/types/marketplace";
import { formatPrice } from "@/lib/dealer-utils";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Eye, MessageSquare, TrendingUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = ["#B22300", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const DAYS_OPTIONS = [7, 30, 90] as const;

export default function AnalitikPage() {
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [viewsChart, setViewsChart] = useState<{ date: string; views: number; contacts: number }[]>([]);
  const [deviceData, setDeviceData] = useState<{ name: string; value: number }[]>([]);
  const [referrerData, setReferrerData] = useState<{ source: string; views: number; contacts: number }[]>([]);
  const [cityData, setCityData] = useState<{ city: string; views: number; contacts: number }[]>([]);
  const [heatmap, setHeatmap] = useState<Record<string, number>>({}); // "day-hour" → count
  const [avgTime, setAvgTime] = useState(0);
  const [, setAvgScroll] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      return;
    }

    const { data: d } = await supabase.from("hazaral_dealers").select("id").eq("user_id", session.user.id).single();
    if (!d) {
      setLoading(false);
      return;
    }

    const since = new Date(Date.now() - range * 86400000).toISOString();

    // Listings
    const { data: ls } = await supabase.from("hazaral_listings").select("*").eq("dealer_id", d.id).eq("status", "active");
    setListings((ls as Listing[]) || []);

    // Views + engagement
    const { data: views } = await supabase
      .from("hazaral_listing_views")
      .select("created_at, device_type, referrer, viewer_city, time_on_page, scrolled_percent")
      .eq("dealer_id", d.id)
      .gte("created_at", since);

    const { data: contacts } = await supabase
      .from("hazaral_listing_contacts")
      .select("created_at, device_type, referrer")
      .eq("dealer_id", d.id)
      .gte("created_at", since);

    // Build daily chart
    const dayMap: Record<string, { views: number; contacts: number }> = {};
    for (let i = range - 1; i >= 0; i--) {
      const k = new Date(Date.now() - i * 86400000).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
      dayMap[k] = { views: 0, contacts: 0 };
    }
    for (const v of views || []) {
      const k = new Date(v.created_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
      if (dayMap[k]) dayMap[k].views++;
    }
    for (const c of contacts || []) {
      const k = new Date(c.created_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
      if (dayMap[k]) dayMap[k].contacts++;
    }
    setViewsChart(Object.entries(dayMap).map(([date, v]) => ({ date, ...v })));

    // Device breakdown
    const devMap: Record<string, number> = { mobile: 0, tablet: 0, desktop: 0 };
    for (const v of views || []) devMap[v.device_type || "desktop"]++;
    setDeviceData([
      { name: "Mobil", value: devMap.mobile },
      { name: "Tablet", value: devMap.tablet },
      { name: "Masaüstü", value: devMap.desktop },
    ].filter((d) => d.value > 0));

    // Referrer
    const refMap: Record<string, { views: number; contacts: number }> = {};
    const classify = (ref: string) => {
      if (!ref || ref === "direct") return "Direkt";
      if (ref.includes("google")) return "Google";
      if (ref.includes("instagram") || ref.includes("facebook")) return "Sosyal Medya";
      if (ref.includes("wa.me") || ref.includes("whatsapp")) return "WhatsApp";
      return "Diğer";
    };
    for (const v of views || []) {
      const src = classify(v.referrer || "");
      if (!refMap[src]) refMap[src] = { views: 0, contacts: 0 };
      refMap[src].views++;
    }
    for (const c of contacts || []) {
      const src = classify(c.referrer || "");
      if (!refMap[src]) refMap[src] = { views: 0, contacts: 0 };
      refMap[src].contacts++;
    }
    setReferrerData(Object.entries(refMap).map(([source, v]) => ({ source, ...v })).sort((a, b) => b.views - a.views));

    // City breakdown
    const cityMap: Record<string, { views: number; contacts: number }> = {};
    for (const v of views || []) {
      const c = v.viewer_city || "Bilinmiyor";
      if (!cityMap[c]) cityMap[c] = { views: 0, contacts: 0 };
      cityMap[c].views++;
    }
    setCityData(Object.entries(cityMap).map(([city, v]) => ({ city, ...v })).sort((a, b) => b.views - a.views).slice(0, 10));

    // Heatmap: day × hour
    const hm: Record<string, number> = {};
    for (const v of views || []) {
      const dt = new Date(v.created_at);
      const key = `${dt.getDay()}-${dt.getHours()}`;
      hm[key] = (hm[key] || 0) + 1;
    }
    setHeatmap(hm);

    // Avg time + scroll
    const validViews = (views || []).filter((v) => v.time_on_page > 0);
    setAvgTime(validViews.length > 0 ? Math.round(validViews.reduce((s, v) => s + v.time_on_page, 0) / validViews.length) : 0);
    const validScroll = (views || []).filter((v) => v.scrolled_percent > 0);
    setAvgScroll(validScroll.length > 0 ? Math.round(validScroll.reduce((s, v) => s + v.scrolled_percent, 0) / validScroll.length) : 0);

    setLoading(false);
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  const totalViews = viewsChart.reduce((s, r) => s + r.views, 0);
  const totalContacts = viewsChart.reduce((s, r) => s + r.contacts, 0);
  const convRate = totalViews > 0 ? ((totalContacts / totalViews) * 100).toFixed(1) : "0.0";

  const DAYS_TR = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
  const maxHeat = Math.max(...Object.values(heatmap), 1);

  if (loading) {
    return <div className="animate-pulse h-[400px] bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card" />;
  }

  return (
    <div className="flex flex-col gap-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
        <div>
          <h1 className="text-[22px] font-bold text-on-surface tracking-[-0.5px]">Analitik</h1>
          <p className="text-[13px] text-muted-text mt-4">İlanlarınızın performans verisi</p>
        </div>
        <div className="flex gap-4 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-btn p-4">
          {DAYS_OPTIONS.map((d) => (
            <button key={d} onClick={() => setRange(d)}
              className={cn("px-14 py-8 rounded text-[12px] font-medium transition-colors",
                range === d ? "bg-primary text-white" : "text-muted-text hover:text-on-surface"
              )}>
              {d} gün
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-14">
        <KPI icon={<Eye size={16} />} label="Görüntülenme" value={totalViews.toLocaleString("tr-TR")} bg="bg-blue-50" color="text-blue-600" />
        <KPI icon={<MessageSquare size={16} />} label="İletişim" value={totalContacts.toLocaleString("tr-TR")} bg="bg-green-50" color="text-green-600" />
        <KPI icon={<TrendingUp size={16} />} label="Dönüşüm" value={`%${convRate}`} bg="bg-primary/10" color="text-primary" />
        <KPI icon={<Clock size={16} />} label="Ort. Süre" value={`${avgTime}s`} bg="bg-purple-50" color="text-purple-600" />
      </div>

      {/* Views + Contacts chart */}
      <ChartBox title={`Günlük Aktivite (Son ${range} Gün)`}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={viewsChart} barGap={2}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={Math.floor(range / 7)} />
            <YAxis tick={{ fontSize: 10 }} width={26} />
            <Tooltip />
            <Bar dataKey="views" fill="#B22300" name="Görüntülenme" radius={[2, 2, 0, 0]} />
            <Bar dataKey="contacts" fill="#25D366" name="İletişim" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>

      {/* Device + Referrer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <ChartBox title="Cihaz Dağılımı">
          {deviceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend formatter={(v) => <span className="text-[11px]">{v}</span>} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <EmptyState />}
        </ChartBox>

        <ChartBox title="Trafik Kaynakları">
          {referrerData.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[0.5px] border-border-default">
                  {["Kaynak", "Görüntülenme", "İletişim"].map((h) => (
                    <th key={h} className="py-8 text-[10px] font-medium text-muted-text uppercase text-left pr-12">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {referrerData.map((r) => (
                  <tr key={r.source} className="border-b border-[0.5px] border-border-default last:border-0">
                    <td className="py-8 text-[12px] text-on-surface pr-12">{r.source}</td>
                    <td className="py-8 text-[12px] text-on-surface pr-12">{r.views}</td>
                    <td className="py-8 text-[12px] text-on-surface">{r.contacts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <EmptyState />}
        </ChartBox>
      </div>

      {/* Activity heatmap */}
      <ChartBox title="Saatlik Aktivite Haritası (GitHub tarzı)">
        <p className="text-[11px] text-muted-text mb-14">Hangi saatlerde en çok ziyaret alıyorsunuz?</p>
        <div className="overflow-x-auto">
          <div className="inline-flex gap-4 items-start">
            {/* Day labels */}
            <div className="flex flex-col gap-4 pt-20">
              {DAYS_TR.map((d) => (
                <div key={d} className="h-[16px] text-[9px] text-muted-text flex items-center justify-end w-[24px] pr-4">{d}</div>
              ))}
            </div>
            {/* Grid: hours 0-23 */}
            <div className="flex gap-4">
              {Array.from({ length: 24 }, (_, h) => (
                <div key={h} className="flex flex-col gap-4">
                  <div className="text-[9px] text-muted-text text-center h-[16px] flex items-end justify-center">{h % 4 === 0 ? `${h}:00` : ""}</div>
                  {Array.from({ length: 7 }, (_, day) => {
                    const val = heatmap[`${day}-${h}`] || 0;
                    const intensity = val === 0 ? 0 : Math.max(0.15, val / maxHeat);
                    return (
                      <div
                        key={day}
                        className="w-[16px] h-[16px] rounded-[3px]"
                        style={{ backgroundColor: val === 0 ? "#f0f0f0" : `rgba(178,35,0,${intensity})` }}
                        title={`${DAYS_TR[day]} ${h}:00 — ${val} görüntülenme`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-8 mt-10">
            <span className="text-[10px] text-muted-text">Az</span>
            {[0.15, 0.35, 0.6, 0.8, 1].map((v) => (
              <div key={v} className="w-[12px] h-[12px] rounded-[2px]" style={{ backgroundColor: `rgba(178,35,0,${v})` }} />
            ))}
            <span className="text-[10px] text-muted-text">Çok</span>
          </div>
        </div>
      </ChartBox>

      {/* City breakdown */}
      {cityData.length > 0 && (
        <ChartBox title="Ziyaretçi Şehirleri">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[0.5px] border-border-default">
                {["Şehir", "Görüntülenme", "İletişim", "Dönüşüm"].map((h) => (
                  <th key={h} className="py-8 text-[10px] font-medium text-muted-text uppercase text-left pr-16">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cityData.map((r) => {
                const c = r.views > 0 ? ((r.contacts / r.views) * 100).toFixed(1) : "0.0";
                return (
                  <tr key={r.city} className="border-b border-[0.5px] border-border-default last:border-0">
                    <td className="py-8 text-[12px] text-on-surface pr-16">{r.city}</td>
                    <td className="py-8 text-[12px] text-on-surface pr-16">{r.views}</td>
                    <td className="py-8 text-[12px] text-on-surface pr-16">{r.contacts}</td>
                    <td className="py-8 text-[11px] font-semibold">
                      <span className={cn(parseFloat(c) >= 5 ? "text-green-600" : parseFloat(c) >= 2 ? "text-amber-600" : "text-red-500")}>%{c}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ChartBox>
      )}

      {/* Per-listing performance */}
      {listings.length > 0 && (
        <ChartBox title="İlan Performansı">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[0.5px] border-border-default">
                  {["İlan", "Fiyat", "Görüntülenme", "WhatsApp", "Telefon", "Dönüşüm", "Ort. Zaman"].map((h) => (
                    <th key={h} className="py-10 px-10 text-[10px] font-medium text-muted-text uppercase text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listings.sort((a, b) => b.view_count - a.view_count).map((l) => {
                  const c = l.view_count > 0 ? (((l.whatsapp_click_count + l.phone_click_count) / l.view_count) * 100).toFixed(1) : "0.0";
                  return (
                    <tr key={l.id} className="border-b border-[0.5px] border-border-default last:border-0 hover:bg-surface">
                      <td className="py-10 px-10 text-[12px] font-medium text-on-surface max-w-[200px]">
                        <div className="truncate">{l.title}</div>
                      </td>
                      <td className="py-10 px-10 text-[12px] text-primary font-semibold">{formatPrice(l.asking_price)}</td>
                      <td className="py-10 px-10 text-[12px] text-on-surface">{l.view_count}</td>
                      <td className="py-10 px-10 text-[12px] text-on-surface">{l.whatsapp_click_count}</td>
                      <td className="py-10 px-10 text-[12px] text-on-surface">{l.phone_click_count}</td>
                      <td className="py-10 px-10">
                        <span className={cn("text-[11px] font-semibold",
                          parseFloat(c) >= 5 ? "text-green-600" : parseFloat(c) >= 2 ? "text-amber-600" : "text-red-500"
                        )}>%{c}</span>
                      </td>
                      <td className="py-10 px-10 text-[12px] text-muted-text">—</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ChartBox>
      )}
    </div>
  );
}

function KPI({ icon, label, value, bg, color }: { icon: React.ReactNode; label: string; value: string; bg: string; color: string }) {
  return (
    <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-16 flex items-center gap-12">
      <div className={cn("w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0", bg, color)}>{icon}</div>
      <div>
        <div className="text-[11px] text-muted-text">{label}</div>
        <div className="text-[20px] font-bold text-on-surface">{value}</div>
      </div>
    </div>
  );
}

function ChartBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-20">
      <h2 className="text-[14px] font-semibold text-on-surface mb-16">{title}</h2>
      {children}
    </div>
  );
}

function EmptyState() {
  return <p className="text-[12px] text-muted-text py-20 text-center">Henüz veri yok.</p>;
}

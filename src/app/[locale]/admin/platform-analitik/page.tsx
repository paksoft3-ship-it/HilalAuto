"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = ["#B22300", "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];
const DAYS_TR = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
const PLAN_PRICES: Record<string, number> = { basic: 4999, professional: 9999, premium: 19999 };
const GRADE_ORDER = ["A", "B", "C", "D", "E"];

export default function PlatformAnalitik() {
  const [range] = useState(30);
  const [loading, setLoading] = useState(true);

  // Data
  const [funnel, setFunnel] = useState<{ stage: string; count: number; rate: string }[]>([]);
  const [gradePerf, setGradePerf] = useState<{ grade: string; listings: number; avgViews: number; avgContacts: number; avgPrice: number }[]>([]);
  const [brandPerf, setBrandPerf] = useState<{ brand: string; views: number; contacts: number; conv: string }[]>([]);
  const [cityData, setCityData] = useState<{ city: string; views: number; contacts: number; conv: string }[]>([]);
  const [heatmap, setHeatmap] = useState<Record<string, number>>({});
  const [contactTypeBreakdown, setContactTypeBreakdown] = useState<{ name: string; value: number }[]>([]);
  const [deviceBreakdown, setDeviceBreakdown] = useState<{ name: string; value: number }[]>([]);
  const [revenue, setRevenue] = useState({ mrr: 0, activeCount: 0, pendingCount: 0, churnCount: 0 });
  const [alerts, setAlerts] = useState<string[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const since = new Date(Date.now() - range * 86400000).toISOString();

    const [
      { data: views },
      { data: contacts },
      { data: listings },
      { data: dealers },
    ] = await Promise.all([
      supabase.from("hazaral_listing_views").select("created_at, device_type, scrolled_percent, viewed_images_count, clicked_whatsapp, clicked_phone, viewer_city").gte("created_at", since),
      supabase.from("hazaral_listing_contacts").select("created_at, contact_type, dealer_id").gte("created_at", since),
      supabase.from("hazaral_listings").select("id, brand, damage_grade, asking_price, view_count, whatsapp_click_count, phone_click_count, city, status"),
      supabase.from("hazaral_dealers").select("subscription_status, subscription_plan, subscription_end"),
    ]);

    const viewsList = views || [];
    const contactsList = contacts || [];
    const listingsList = listings || [];
    const dealersList = dealers || [];

    // ── Funnel ────────────────────────────────────────────────
    const totalViews = viewsList.length;
    const scroll50 = viewsList.filter((v: { scrolled_percent: number }) => (v.scrolled_percent || 0) >= 50).length;
    const photos3 = viewsList.filter((v: { viewed_images_count: number }) => (v.viewed_images_count || 0) >= 3).length;
    const converted = contactsList.length;

    setFunnel([
      { stage: "Görüntülenme", count: totalViews, rate: "100%" },
      { stage: "%50 Kaydırma", count: scroll50, rate: totalViews > 0 ? `%${((scroll50 / totalViews) * 100).toFixed(0)}` : "—" },
      { stage: "3+ Fotoğraf", count: photos3, rate: totalViews > 0 ? `%${((photos3 / totalViews) * 100).toFixed(0)}` : "—" },
      { stage: "İletişim", count: converted, rate: totalViews > 0 ? `%${((converted / totalViews) * 100).toFixed(1)}` : "—" },
    ]);

    // ── Grade performance ──────────────────────────────────────
    const gradeMap: Record<string, { views: number; contacts: number; price: number; count: number }> = {};
    for (const l of listingsList.filter((l: { status: string }) => l.status === "active")) {
      const g = (l as { damage_grade?: string }).damage_grade || "?";
      if (!gradeMap[g]) gradeMap[g] = { views: 0, contacts: 0, price: 0, count: 0 };
      gradeMap[g].views += (l as { view_count: number }).view_count || 0;
      gradeMap[g].contacts += ((l as { whatsapp_click_count: number }).whatsapp_click_count || 0) + ((l as { phone_click_count: number }).phone_click_count || 0);
      gradeMap[g].price += (l as { asking_price: number }).asking_price || 0;
      gradeMap[g].count++;
    }
    setGradePerf(GRADE_ORDER.filter((g) => gradeMap[g]).map((g) => ({
      grade: g,
      listings: gradeMap[g].count,
      avgViews: Math.round(gradeMap[g].views / gradeMap[g].count),
      avgContacts: Math.round(gradeMap[g].contacts / gradeMap[g].count),
      avgPrice: Math.round(gradeMap[g].price / gradeMap[g].count),
    })));

    // ── Brand performance ──────────────────────────────────────
    const brandMap: Record<string, { views: number; contacts: number }> = {};
    for (const l of listingsList) {
      const b = (l as { brand: string }).brand || "?";
      if (!brandMap[b]) brandMap[b] = { views: 0, contacts: 0 };
      brandMap[b].views += (l as { view_count: number }).view_count || 0;
      brandMap[b].contacts += ((l as { whatsapp_click_count: number }).whatsapp_click_count || 0) + ((l as { phone_click_count: number }).phone_click_count || 0);
    }
    setBrandPerf(
      Object.entries(brandMap)
        .map(([brand, v]) => ({ brand, ...v, conv: v.views > 0 ? `%${((v.contacts / v.views) * 100).toFixed(1)}` : "0%" }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10)
    );

    // ── City breakdown ─────────────────────────────────────────
    const cityMap: Record<string, { views: number; contacts: number }> = {};
    for (const v of viewsList) {
      const c = (v as { viewer_city?: string }).viewer_city || "Bilinmiyor";
      if (!cityMap[c]) cityMap[c] = { views: 0, contacts: 0 };
      cityMap[c].views++;
    }
    setCityData(
      Object.entries(cityMap)
        .map(([city, v]) => ({ city, ...v, conv: v.views > 0 ? `%${((v.contacts / v.views) * 100).toFixed(1)}` : "0%" }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10)
    );

    // ── Heatmap ────────────────────────────────────────────────
    const hm: Record<string, number> = {};
    for (const v of viewsList) {
      const dt = new Date(v.created_at);
      const key = `${dt.getDay()}-${dt.getHours()}`;
      hm[key] = (hm[key] || 0) + 1;
    }
    setHeatmap(hm);

    // ── Contact types ──────────────────────────────────────────
    const ctMap: Record<string, number> = { whatsapp: 0, phone: 0, message: 0 };
    for (const c of contactsList) ctMap[(c as { contact_type: string }).contact_type] = (ctMap[(c as { contact_type: string }).contact_type] || 0) + 1;
    setContactTypeBreakdown([
      { name: "WhatsApp", value: ctMap.whatsapp },
      { name: "Telefon", value: ctMap.phone },
      { name: "Mesaj", value: ctMap.message },
    ].filter((d) => d.value > 0));

    // ── Device breakdown ───────────────────────────────────────
    const devMap: Record<string, number> = { mobile: 0, tablet: 0, desktop: 0 };
    for (const v of viewsList) devMap[(v as { device_type?: string }).device_type || "desktop"] = (devMap[(v as { device_type?: string }).device_type || "desktop"] || 0) + 1;
    setDeviceBreakdown([
      { name: "Mobil", value: devMap.mobile },
      { name: "Tablet", value: devMap.tablet },
      { name: "Masaüstü", value: devMap.desktop },
    ].filter((d) => d.value > 0));

    // ── Revenue ────────────────────────────────────────────────
    const active = dealersList.filter((d: { subscription_status: string }) => d.subscription_status === "active");
    const mrr = active.reduce((s: number, d: { subscription_plan?: string }) => s + (PLAN_PRICES[d.subscription_plan || ""] || 0), 0);
    const expired = dealersList.filter((d: { subscription_status: string; subscription_end?: string }) =>
      d.subscription_status === "active" && d.subscription_end && new Date(d.subscription_end) < new Date()
    ).length;
    setRevenue({
      mrr,
      activeCount: active.length,
      pendingCount: dealersList.filter((d: { subscription_status: string }) => d.subscription_status === "pending").length,
      churnCount: expired,
    });

    // ── Conversion alerts ──────────────────────────────────────
    const newAlerts: string[] = [];
    const highViewLowConv = listingsList.filter((l: { view_count: number; whatsapp_click_count: number; phone_click_count: number; status: string }) =>
      l.view_count >= 50 && (l.whatsapp_click_count + l.phone_click_count) === 0 && l.status === "active"
    ).length;
    if (highViewLowConv > 0) newAlerts.push(`${highViewLowConv} ilan 50+ görüntülenme aldı ama 0 iletişim — fiyat sorunu olabilir`);
    if (devMap.mobile > 0 && devMap.desktop > 0) {
      const mobViews = devMap.mobile;
      const deskViews = devMap.desktop;
      if (mobViews > deskViews * 2) newAlerts.push(`Ziyaretçilerin %${Math.round(mobViews/(mobViews+deskViews)*100)} oranı mobilden — mobil deneyimi optimize edin`);
    }
    setAlerts(newAlerts);

    setLoading(false);
  }, [range]);

  useEffect(() => { load(); }, [load]);

  const maxHeat = Math.max(...Object.values(heatmap), 1);

  if (loading) {
    return <div className="animate-pulse h-[400px] bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card" />;
  }

  return (
    <div className="flex flex-col gap-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-on-surface tracking-[-1px]">Platform Analitik</h1>
          <p className="text-[13px] text-muted-text mt-4">Son {range} gün · Tüm bayiler</p>
        </div>
        <button onClick={load} className="flex items-center gap-8 px-14 py-8 border border-[0.5px] border-border-default rounded-btn text-[12px] text-muted-text bg-surface-container-lowest hover:border-primary">
          <RefreshCw size={12} /> Yenile
        </button>
      </div>

      {/* Conversion alerts */}
      {alerts.length > 0 && (
        <div className="flex flex-col gap-8">
          {alerts.map((a, i) => (
            <div key={i} className="flex items-center gap-10 px-16 py-12 bg-amber-50 border border-amber-200 text-amber-700 rounded-card text-[13px]">
              <AlertCircle size={14} /> {a}
            </div>
          ))}
        </div>
      )}

      {/* Revenue */}
      <ChartBox title="Gelir Özeti (MRR)">
        <div className="grid grid-cols-4 gap-14">
          <Stat label="MRR" value={`${revenue.mrr.toLocaleString("tr-TR")} TL`} color="text-primary" />
          <Stat label="Aktif Bayi" value={revenue.activeCount} />
          <Stat label="Başvuru Bekliyor" value={revenue.pendingCount} />
          <Stat label="Yenilenmedi" value={revenue.churnCount} color="text-red-500" />
        </div>
      </ChartBox>

      {/* Funnel */}
      <ChartBox title="Dönüşüm Hunisi">
        <div className="flex flex-col gap-10">
          {funnel.map((f, i) => (
            <div key={f.stage} className="flex items-center gap-14">
              <div className="w-[120px] text-[12px] text-muted-text text-right shrink-0">{f.stage}</div>
              <div className="flex-1 bg-surface rounded-full h-[28px] relative overflow-hidden">
                <div
                  className="h-full rounded-full flex items-center px-12"
                  style={{
                    width: funnel[0].count > 0 ? `${(f.count / funnel[0].count) * 100}%` : "0%",
                    backgroundColor: i === 0 ? "#B22300" : i === funnel.length - 1 ? "#25D366" : "#0088FE",
                    minWidth: f.count > 0 ? "60px" : "0px",
                  }}
                >
                  <span className="text-white text-[10px] font-semibold">{f.count.toLocaleString("tr-TR")}</span>
                </div>
              </div>
              <div className="w-[50px] text-[11px] font-semibold text-muted-text shrink-0">{f.rate}</div>
            </div>
          ))}
        </div>
      </ChartBox>

      {/* Brand + Device */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <ChartBox title="Marka Performansı (Top 10 — Görüntülenme)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={brandPerf} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="brand" tick={{ fontSize: 10 }} width={70} />
              <Tooltip />
              <Bar dataKey="views" fill="#B22300" name="Görüntülenme" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="İletişim Türü & Cihaz">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <p className="text-[11px] text-muted-text mb-8">İletişim Türü</p>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={contactTypeBreakdown} cx="50%" cy="50%" outerRadius={55} dataKey="value">
                    {contactTypeBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend formatter={(v) => <span className="text-[10px]">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-[11px] text-muted-text mb-8">Cihaz</p>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={deviceBreakdown} cx="50%" cy="50%" outerRadius={55} dataKey="value">
                    {deviceBreakdown.map((_, i) => <Cell key={i} fill={COLORS[(i + 3) % COLORS.length]} />)}
                  </Pie>
                  <Legend formatter={(v) => <span className="text-[10px]">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartBox>
      </div>

      {/* Heatmap */}
      <ChartBox title="Platform Saatlik Aktivite">
        <div className="overflow-x-auto">
          <div className="inline-flex gap-4 items-start">
            <div className="flex flex-col gap-4 pt-20">
              {DAYS_TR.map((d) => (
                <div key={d} className="h-[16px] text-[9px] text-muted-text flex items-center justify-end w-[24px] pr-4">{d}</div>
              ))}
            </div>
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="flex flex-col gap-4">
                <div className="text-[9px] text-muted-text text-center h-[16px] flex items-end justify-center">{h % 4 === 0 ? `${h}:00` : ""}</div>
                {Array.from({ length: 7 }, (_, day) => {
                  const val = heatmap[`${day}-${h}`] || 0;
                  const intensity = val === 0 ? 0 : Math.max(0.15, val / maxHeat);
                  return (
                    <div key={day} className="w-[16px] h-[16px] rounded-[3px]"
                      style={{ backgroundColor: val === 0 ? "#f0f0f0" : `rgba(178,35,0,${intensity})` }}
                      title={`${DAYS_TR[day]} ${h}:00 — ${val}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </ChartBox>

      {/* Grade performance */}
      {gradePerf.length > 0 && (
        <ChartBox title="Otograde Derece Performansı">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[0.5px] border-border-default">
                  {["Derece", "İlan Sayısı", "Ort. Görüntülenme", "Ort. İletişim", "Ort. Fiyat"].map((h) => (
                    <th key={h} className="py-10 px-12 text-[10px] font-medium text-muted-text uppercase text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gradePerf.map((r) => (
                  <tr key={r.grade} className="border-b border-[0.5px] border-border-default last:border-0 hover:bg-surface">
                    <td className="py-10 px-12">
                      <span className="inline-flex items-center justify-center w-[28px] h-[28px] rounded-full text-white font-bold text-[12px]"
                        style={{ backgroundColor: ["#16a34a","#65a30d","#d97706","#ea580c","#B22300"][GRADE_ORDER.indexOf(r.grade)] }}>
                        {r.grade}
                      </span>
                    </td>
                    <td className="py-10 px-12 text-[12px] text-on-surface">{r.listings}</td>
                    <td className="py-10 px-12 text-[12px] text-on-surface">{r.avgViews}</td>
                    <td className="py-10 px-12 text-[12px] text-on-surface">{r.avgContacts}</td>
                    <td className="py-10 px-12 text-[12px] text-primary font-semibold">{r.avgPrice.toLocaleString("tr-TR")} TL</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartBox>
      )}

      {/* City */}
      {cityData.length > 0 && (
        <ChartBox title="Ziyaretçi Şehirleri">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[0.5px] border-border-default">
                {["Şehir", "Görüntülenme", "İletişim", "Dönüşüm"].map((h) => (
                  <th key={h} className="py-10 px-12 text-[10px] font-medium text-muted-text uppercase text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cityData.map((r) => (
                <tr key={r.city} className="border-b border-[0.5px] border-border-default last:border-0 hover:bg-surface">
                  <td className="py-10 px-12 text-[12px] text-on-surface">{r.city}</td>
                  <td className="py-10 px-12 text-[12px] text-on-surface">{r.views}</td>
                  <td className="py-10 px-12 text-[12px] text-on-surface">{r.contacts}</td>
                  <td className="py-10 px-12">
                    <span className={cn("text-[11px] font-semibold",
                      parseFloat(r.conv) >= 5 ? "text-green-600" : parseFloat(r.conv) >= 2 ? "text-amber-600" : "text-red-500"
                    )}>{r.conv}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ChartBox>
      )}
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

function Stat({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="text-center">
      <div className={cn("text-[22px] font-bold text-on-surface", color)}>{typeof value === "number" ? value.toLocaleString("tr-TR") : value}</div>
      <div className="text-[11px] text-muted-text mt-4">{label}</div>
    </div>
  );
}

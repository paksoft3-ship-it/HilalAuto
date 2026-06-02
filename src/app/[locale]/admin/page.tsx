"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "@/i18n/routing";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Car, Eye, TrendingUp,
  Building2, AlertTriangle, RefreshCw, Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PLAN_PRICES: Record<string, number> = {
  basic: 4999, professional: 9999, premium: 19999,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    activeListings: 0, pendingListings: 0,
    totalDealers: 0, activeDealers: 0, pendingDealers: 0, suspendedDealers: 0,
    viewsToday: 0, viewsWeek: 0, viewsMonth: 0,
    contactsToday: 0, contactsWeek: 0, contactsMonth: 0,
    mrr: 0,
    oldLeads: 0, oldCars: 0, oldBlogs: 0,
  });
  const [viewsChart, setViewsChart] = useState<{ date: string; views: number; contacts: number }[]>([]);
  const [, setDealerSignups] = useState<{ week: string; count: number }[]>([]);
  const [contactTypes, setContactTypes] = useState<{ type: string; count: number }[]>([]);
  const [alerts, setAlerts] = useState<{ type: string; message: string; href: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const load = useCallback(async () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString();

    const [
      { count: activeListings },
      { count: pendingListings },
      { data: dealers },
      { count: viewsToday },
      { count: viewsWeek },
      { count: viewsMonth },
      { count: contactsToday },
      { count: contactsWeek },
      { count: contactsMonth },
      { data: viewsRaw },
      { data: contactsRaw },
      { data: dealerRaw },
      { data: contactTypesRaw },
      { count: oldLeads },
      { count: oldCars },
      { count: oldBlogs },
    ] = await Promise.all([
      supabase.from("hazaral_listings").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("hazaral_listings").select("id", { count: "exact", head: true }).eq("status", "pending_review"),
      supabase.from("hazaral_dealers").select("id, subscription_status, subscription_plan"),
      supabase.from("hazaral_listing_views").select("id", { count: "exact", head: true }).gte("created_at", today),
      supabase.from("hazaral_listing_views").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
      supabase.from("hazaral_listing_views").select("id", { count: "exact", head: true }).gte("created_at", monthAgo),
      supabase.from("hazaral_listing_contacts").select("id", { count: "exact", head: true }).gte("created_at", today),
      supabase.from("hazaral_listing_contacts").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
      supabase.from("hazaral_listing_contacts").select("id", { count: "exact", head: true }).gte("created_at", monthAgo),
      supabase.from("hazaral_listing_views").select("created_at").gte("created_at", monthAgo).order("created_at"),
      supabase.from("hazaral_listing_contacts").select("created_at").gte("created_at", monthAgo),
      supabase.from("hazaral_dealers").select("created_at").gte("created_at", new Date(now.getTime() - 90 * 86400000).toISOString()).order("created_at"),
      supabase.from("hazaral_listing_contacts").select("contact_type").gte("created_at", monthAgo),
      supabase.from("hazaral_leads").select("id", { count: "exact", head: true }),
      supabase.from("hazaral_cars").select("id", { count: "exact", head: true }),
      supabase.from("hazaral_blogs").select("id", { count: "exact", head: true }),
    ]);

    const dealerList = dealers || [];
    const activeDealers = dealerList.filter((d: { subscription_status: string }) => d.subscription_status === "active").length;
    const pendingDealers = dealerList.filter((d: { subscription_status: string }) => d.subscription_status === "pending").length;
    const suspendedDealers = dealerList.filter((d: { subscription_status: string }) => d.subscription_status === "suspended").length;
    const mrr = dealerList
      .filter((d: { subscription_status: string }) => d.subscription_status === "active")
      .reduce((s: number, d: { subscription_plan?: string }) => s + (PLAN_PRICES[d.subscription_plan || ""] || 0), 0);

    setStats({
      activeListings: activeListings || 0,
      pendingListings: pendingListings || 0,
      totalDealers: dealerList.length,
      activeDealers, pendingDealers, suspendedDealers,
      viewsToday: viewsToday || 0, viewsWeek: viewsWeek || 0, viewsMonth: viewsMonth || 0,
      contactsToday: contactsToday || 0, contactsWeek: contactsWeek || 0, contactsMonth: contactsMonth || 0,
      mrr,
      oldLeads: oldLeads || 0, oldCars: oldCars || 0, oldBlogs: oldBlogs || 0,
    });

    // Views + contacts 30-day chart
    const dayMap: Record<string, { views: number; contacts: number }> = {};
    for (let i = 29; i >= 0; i--) {
      const k = new Date(now.getTime() - i * 86400000).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
      dayMap[k] = { views: 0, contacts: 0 };
    }
    for (const v of viewsRaw || []) {
      const k = new Date(v.created_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
      if (dayMap[k]) dayMap[k].views++;
    }
    for (const c of contactsRaw || []) {
      const k = new Date(c.created_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
      if (dayMap[k]) dayMap[k].contacts++;
    }
    setViewsChart(Object.entries(dayMap).map(([date, v]) => ({ date, ...v })));

    // Dealer signups per week
    const weekMap: Record<string, number> = {};
    for (const d of dealerRaw || []) {
      const dt = new Date(d.created_at);
      const wk = `H${Math.ceil(dt.getDate() / 7)} ${dt.toLocaleDateString("tr-TR", { month: "short" })}`;
      weekMap[wk] = (weekMap[wk] || 0) + 1;
    }
    setDealerSignups(Object.entries(weekMap).map(([week, count]) => ({ week, count })));

    // Contact types
    const typeMap: Record<string, number> = { whatsapp: 0, phone: 0, message: 0 };
    for (const c of contactTypesRaw || []) {
      typeMap[c.contact_type] = (typeMap[c.contact_type] || 0) + 1;
    }
    setContactTypes([
      { type: "WhatsApp", count: typeMap.whatsapp },
      { type: "Telefon", count: typeMap.phone },
      { type: "Mesaj", count: typeMap.message },
    ]);

    // Alerts
    const newAlerts: { type: string; message: string; href: string }[] = [];
    if ((pendingListings || 0) > 0) newAlerts.push({ type: "warning", message: `${pendingListings} ilan inceleme bekliyor`, href: "/admin/ilanlar" });
    if (pendingDealers > 0) newAlerts.push({ type: "info", message: `${pendingDealers} yeni bayi başvurusu`, href: "/admin/bayiler" });
    setAlerts(newAlerts);

    setLastRefresh(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [load]);

  if (loading) {
    return (
      <div className="flex flex-col gap-16">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[80px] animate-pulse bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card" />
        ))}
      </div>
    );
  }

  const convRate = stats.viewsMonth > 0
    ? ((stats.contactsMonth / stats.viewsMonth) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="flex flex-col gap-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-on-surface tracking-[-1px]">Dashboard</h1>
          <p className="text-[13px] text-muted-text mt-4 flex items-center gap-6">
            <Radio size={11} className="text-green-500 animate-pulse" />
            Son güncelleme: {lastRefresh.toLocaleTimeString("tr-TR")} · Her 60 saniyede yenilenir
          </p>
        </div>
        <button onClick={load} className="flex items-center gap-8 px-14 py-8 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-btn text-[12px] text-muted-text hover:text-on-surface hover:border-primary transition-colors">
          <RefreshCw size={13} /> Yenile
        </button>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="flex flex-col gap-8">
          {alerts.map((a, i) => (
            <Link key={i} href={a.href as never} className={cn(
              "flex items-center gap-10 px-16 py-12 rounded-card border text-[13px] font-medium hover:opacity-80 transition-opacity",
              a.type === "warning" ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-blue-50 border-blue-200 text-blue-700"
            )}>
              <AlertTriangle size={14} /> {a.message} →
            </Link>
          ))}
        </div>
      )}

      {/* Platform KPIs */}
      <div>
        <h2 className="text-[13px] font-semibold text-muted-text uppercase tracking-wider mb-12">Platform</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-14">
          <KpiCard icon={<Car size={16} />} label="Aktif İlan" value={stats.activeListings} sub={`${stats.pendingListings} bekliyor`} bg="bg-blue-50" color="text-blue-600" />
          <KpiCard icon={<Building2 size={16} />} label="Aktif Bayi" value={stats.activeDealers} sub={`${stats.pendingDealers} başvuru`} bg="bg-green-50" color="text-green-600" />
          <KpiCard icon={<TrendingUp size={16} />} label="MRR" value={`${stats.mrr.toLocaleString("tr-TR")} TL`} sub="Aylık gelir" bg="bg-primary/10" color="text-primary" />
          <KpiCard icon={<Eye size={16} />} label="Dönüşüm" value={`%${convRate}`} sub="Bu ay" bg="bg-purple-50" color="text-purple-600" />
        </div>
      </div>

      {/* Views */}
      <div>
        <h2 className="text-[13px] font-semibold text-muted-text uppercase tracking-wider mb-12">Görüntülenme & İletişim</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-10">
          {[
            { label: "Bugün (G)", value: stats.viewsToday, type: "views" },
            { label: "Bu Hafta (G)", value: stats.viewsWeek, type: "views" },
            { label: "Bu Ay (G)", value: stats.viewsMonth, type: "views" },
            { label: "Bugün (İ)", value: stats.contactsToday, type: "contacts" },
            { label: "Bu Hafta (İ)", value: stats.contactsWeek, type: "contacts" },
            { label: "Bu Ay (İ)", value: stats.contactsMonth, type: "contacts" },
          ].map((s) => (
            <div key={s.label} className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-14 text-center">
              <div className="text-[20px] font-bold text-on-surface">{s.value.toLocaleString("tr-TR")}</div>
              <div className="text-[10px] text-muted-text mt-4">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <ChartBox title="Platform Aktivitesi (30 Gün)">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={viewsChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={6} />
              <YAxis tick={{ fontSize: 9 }} width={24} />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#B22300" strokeWidth={2} dot={false} name="Görüntülenme" />
              <Line type="monotone" dataKey="contacts" stroke="#25D366" strokeWidth={2} dot={false} name="İletişim" />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="İletişim Türü (Bu Ay)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={contactTypes}>
              <XAxis dataKey="type" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={24} />
              <Tooltip />
              <Bar dataKey="count" fill="#B22300" radius={[4, 4, 0, 0]} name="Sayı" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>

      {/* Legacy stats */}
      <div>
        <h2 className="text-[13px] font-semibold text-muted-text uppercase tracking-wider mb-12">Legacy (Lead-Gen)</h2>
        <div className="grid grid-cols-3 gap-14">
          <MiniStat label="Talepler" value={stats.oldLeads} href="/admin/leads" />
          <MiniStat label="Eski Araç İlanları" value={stats.oldCars} href="/admin/cars" />
          <MiniStat label="Blog Yazıları" value={stats.oldBlogs} href="/admin/blogs" />
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, sub, bg, color }: {
  icon: React.ReactNode; label: string; value: string | number;
  sub?: string; bg: string; color: string;
}) {
  return (
    <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-16 flex items-center gap-12">
      <div className={cn("w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0", bg, color)}>{icon}</div>
      <div>
        <div className="text-[11px] text-muted-text">{label}</div>
        <div className="text-[18px] font-bold text-on-surface">{typeof value === "number" ? value.toLocaleString("tr-TR") : value}</div>
        {sub && <div className="text-[10px] text-muted-text">{sub}</div>}
      </div>
    </div>
  );
}

function ChartBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-20">
      <h3 className="text-[13px] font-semibold text-on-surface mb-14">{title}</h3>
      {children}
    </div>
  );
}

function MiniStat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href as never} className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-16 hover:border-primary transition-colors">
      <div className="text-[20px] font-bold text-on-surface">{value.toLocaleString("tr-TR")}</div>
      <div className="text-[12px] text-muted-text mt-4">{label}</div>
    </Link>
  );
}

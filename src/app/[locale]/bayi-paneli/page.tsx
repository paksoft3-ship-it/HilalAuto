"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Dealer, Listing } from "@/types/marketplace";
import { Link } from "@/i18n/routing";
import { formatPrice, getPlanLimit, daysBetween } from "@/lib/dealer-utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { Plus, Eye, MessageSquare, TrendingUp, Clock, ArrowRight, Zap, Car } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DealerDashboard() {
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [viewsData, setViewsData] = useState<{ date: string; views: number; contacts: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: d } = await supabase
        .from("hazaral_dealers")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (!d) return;
      setDealer(d as Dealer);

      // Listings
      const { data: ls } = await supabase
        .from("hazaral_listings")
        .select("*")
        .eq("dealer_id", d.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(5);
      setListings((ls as Listing[]) || []);

      // Views last 30 days grouped by day
      const since = new Date(Date.now() - 30 * 86400000).toISOString();
      const { data: views } = await supabase
        .from("hazaral_listing_views")
        .select("created_at")
        .eq("dealer_id", d.id)
        .gte("created_at", since)
        .order("created_at");

      const { data: contacts } = await supabase
        .from("hazaral_listing_contacts")
        .select("created_at")
        .eq("dealer_id", d.id)
        .gte("created_at", since);

      // Build 30-day chart data
      const map: Record<string, { views: number; contacts: number }> = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        const key = d.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
        map[key] = { views: 0, contacts: 0 };
      }
      for (const v of views || []) {
        const key = new Date(v.created_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
        if (map[key]) map[key].views++;
      }
      for (const c of contacts || []) {
        const key = new Date(c.created_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
        if (map[key]) map[key].contacts++;
      }
      setViewsData(Object.entries(map).map(([date, v]) => ({ date, ...v })));

      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-20">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-[100px] bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card animate-pulse" />
        ))}
      </div>
    );
  }

  if (!dealer) return null;

  const planLimit = getPlanLimit(dealer.subscription_plan);
  const activeCount = listings.length;
  const daysLeft = dealer.subscription_end ? daysBetween(new Date().toISOString(), dealer.subscription_end) : 0;

  const totalViews = viewsData.reduce((s, r) => s + r.views, 0);
  const totalContacts = viewsData.reduce((s, r) => s + r.contacts, 0);
  const convRate = totalViews > 0 ? ((totalContacts / totalViews) * 100).toFixed(1) : "0.0";

  return (
    <div className="flex flex-col gap-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
        <div>
          <h1 className="text-[22px] font-bold text-on-surface tracking-[-0.5px]">Dashboard</h1>
          <p className="text-[13px] text-muted-text mt-4">Hoşgeldiniz, {dealer.contact_name}</p>
        </div>
        <Link
          href="/bayi-paneli/ilan-ekle"
          className="inline-flex items-center gap-8 bg-primary text-white px-20 py-10 rounded-btn text-[13px] font-semibold hover:opacity-90"
        >
          <Plus size={15} /> Yeni İlan Ekle
        </Link>
      </div>

      {/* Subscription status bar */}
      {dealer.subscription_end && daysLeft <= 14 && (
        <div className="bg-amber-50 border border-amber-200 rounded-card p-14 flex flex-col md:flex-row md:items-center gap-12 text-[13px] text-amber-700">
          <div className="flex items-center gap-10">
            <Clock size={15} />
            Aboneliğiniz <strong>{daysLeft} gün</strong> içinde sona eriyor.
          </div>
          <Link href="/bayi-paneli/abonelik" className="md:ml-auto text-primary font-semibold hover:underline">
            Hemen yenile
          </Link>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-14">
        <KpiCard
          label="Aktif İlan"
          value={`${activeCount}${planLimit !== -1 ? ` / ${planLimit}` : ""}`}
          icon={<Car size={18} />}
          color="text-blue-600" bg="bg-blue-50"
          sub={planLimit !== -1 && activeCount >= planLimit ? "Limite ulaştınız" : undefined}
        />
        <KpiCard label="Görüntülenme" value={totalViews.toLocaleString("tr-TR")} icon={<Eye size={18} />} color="text-purple-600" bg="bg-purple-50" sub="Son 30 gün" />
        <KpiCard label="İletişim" value={totalContacts.toLocaleString("tr-TR")} icon={<MessageSquare size={18} />} color="text-green-600" bg="bg-green-50" sub="Son 30 gün" />
        <KpiCard label="Dönüşüm" value={`%${convRate}`} icon={<TrendingUp size={18} />} color="text-primary" bg="bg-primary/10" sub="İletişim / Görüntülenme" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <ChartCard title="Günlük Görüntülenme (30 gün)">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} />
              <YAxis tick={{ fontSize: 10 }} width={28} />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#B22300" strokeWidth={2} dot={false} name="Görüntülenme" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Günlük İletişim (30 gün)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} />
              <YAxis tick={{ fontSize: 10 }} width={28} />
              <Tooltip />
              <Bar dataKey="contacts" fill="#B22300" name="İletişim" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
        {[
          { href: "/bayi-paneli/ilan-ekle", label: "Yeni İlan Ekle", icon: Plus, color: "text-primary" },
          { href: "/bayi-paneli/ilanlarim", label: "İlanlarım", icon: Eye, color: "text-blue-600" },
          { href: "/bayi-paneli/mesajlar", label: "Mesajlar", icon: MessageSquare, color: "text-green-600" },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href as never}
            className="flex items-center gap-12 p-16 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card hover:border-primary transition-colors group"
          >
            <a.icon size={18} className={cn(a.color, "shrink-0")} />
            <span className="text-[13px] font-medium text-on-surface">{a.label}</span>
            <ArrowRight size={14} className="ml-auto text-muted-text group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>

      {/* Best performing listings */}
      {listings.length > 0 && (
        <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-20">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-[15px] font-semibold text-on-surface flex items-center gap-8">
              <Zap size={15} className="text-primary" /> En İyi Performanslı İlanlar
            </h2>
            <Link href="/bayi-paneli/ilanlarim" className="text-[12px] text-primary hover:underline">
              Tümünü Gör
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[0.5px] border-border-default">
                  {["İlan", "Fiyat", "Görüntülenme", "WhatsApp", "Dönüşüm"].map((h) => (
                    <th key={h} className="py-10 px-10 text-[11px] font-medium text-muted-text uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listings.map((l) => {
                  const conv = l.view_count > 0
                    ? ((l.whatsapp_click_count + l.phone_click_count) / l.view_count * 100).toFixed(1)
                    : "0.0";
                  return (
                    <tr key={l.id} className="border-b border-[0.5px] border-border-default last:border-0 hover:bg-surface">
                      <td className="py-10 px-10 text-[12px] text-on-surface font-medium max-w-[200px] truncate">{l.title}</td>
                      <td className="py-10 px-10 text-[12px] text-primary font-semibold">{formatPrice(l.asking_price)}</td>
                      <td className="py-10 px-10 text-[12px] text-on-surface">{l.view_count}</td>
                      <td className="py-10 px-10 text-[12px] text-on-surface">{l.whatsapp_click_count}</td>
                      <td className="py-10 px-10">
                        <span className={cn("text-[11px] font-semibold",
                          parseFloat(conv) >= 5 ? "text-green-600" :
                          parseFloat(conv) >= 2 ? "text-amber-600" : "text-red-500"
                        )}>%{conv}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value, icon, color, bg, sub }: {
  label: string; value: string; icon: React.ReactNode;
  color: string; bg: string; sub?: string;
}) {
  return (
    <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-16 flex items-center gap-14">
      <div className={cn("w-[42px] h-[42px] rounded-full flex items-center justify-center shrink-0", bg, color)}>{icon}</div>
      <div>
        <div className="text-[11px] text-muted-text">{label}</div>
        <div className="text-[20px] font-bold text-on-surface leading-tight">{value}</div>
        {sub && <div className="text-[10px] text-muted-text">{sub}</div>}
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-20">
      <h3 className="text-[13px] font-semibold text-on-surface mb-16">{title}</h3>
      {children}
    </div>
  );
}

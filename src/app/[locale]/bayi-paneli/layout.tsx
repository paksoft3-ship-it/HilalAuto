/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, Link } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";
import { Dealer } from "@/types/marketplace";
import { NotificationBell } from "@/components/dealer/NotificationBell";
import { CarLoader } from "@/components/ui/CarLoader";
import {
  LayoutDashboard, Car, Plus, MessageSquare, BarChart2,
  Bell, LogOut, Menu, X, AlertCircle, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/bayi-paneli", icon: LayoutDashboard, exact: true },
  { label: "İlanlarım", href: "/bayi-paneli/ilanlarim", icon: Car },
  { label: "İlan Ekle", href: "/bayi-paneli/ilan-ekle", icon: Plus },
  { label: "Mesajlar", href: "/bayi-paneli/mesajlar", icon: MessageSquare },
  { label: "Analitik", href: "/bayi-paneli/analitik", icon: BarChart2 },
  { label: "Bildirimler", href: "/bayi-paneli/bildirimler", icon: Bell },
];

export default function DealerPanelLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname?.includes("/giris");

  const refreshCounts = useCallback(async (dealerId: string, accessToken?: string) => {
    const [{ count: msgs }, notificationResponse] = await Promise.all([
      supabase.from("hazaral_dealer_messages").select("id", { count: "exact", head: true })
        .eq("dealer_id", dealerId).eq("is_read", false),
      accessToken
        ? fetch("/api/notifications?limit=5", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }).catch(() => null)
        : Promise.resolve(null),
    ]);

    setUnreadMessages(msgs || 0);

    if (notificationResponse?.ok) {
      const data = await notificationResponse.json();
      setUnreadNotifs(data.unreadCount || 0);
    }
  }, []);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        if (!isLoginPage) router.push("/bayi-paneli/giris" as any);
        setLoading(false);
        return;
      }

      const { data: dealerData } = await supabase
        .from("hazaral_dealers")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (!dealerData && !isLoginPage) {
        router.push("/bayi-ol" as any);
        setLoading(false);
        return;
      }

      setDealer(dealerData as Dealer);

      // Fetch unread counts
      if (dealerData) {
        await refreshCounts(dealerData.id, session.access_token);
      }

      setLoading(false);
    }

    checkAuth();

    // Poll every 60 seconds for new notifications (no Realtime setup required)
    const pollInterval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: d } = await supabase
        .from("hazaral_dealers")
        .select("id")
        .eq("user_id", session.user.id)
        .single();
      if (d) refreshCounts(d.id, session.access_token);
    }, 60000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session && !isLoginPage) router.push("/bayi-paneli/giris" as any);
    });

    return () => {
      subscription.unsubscribe();
      clearInterval(pollInterval);
    };
  }, [router, isLoginPage, refreshCounts]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/" as any);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <CarLoader label="Yükleniyor..." />
      </div>
    );
  }

  if (isLoginPage) return <>{children}</>;

  if (!dealer) return null;

  // Pending approval state
  if (dealer.subscription_status === "pending") {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-16">
        <div className="max-w-[480px] w-full bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-40 text-center">
          <div className="w-[64px] h-[64px] bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-20">
            <Clock size={28} className="text-amber-600" />
          </div>
          <h1 className="text-[22px] font-bold text-on-surface mb-12">Başvurunuz İnceleniyor</h1>
          <p className="text-[14px] text-muted-text leading-relaxed mb-20">
            Başvurunuz admin tarafından inceleniyor. Onaylandıktan sonra e-posta ile bildirim gönderilecek.
            Genellikle 24 saat içinde dönüş yapılır.
          </p>
          <button onClick={logout} className="text-[13px] text-muted-text hover:text-primary flex items-center gap-6 mx-auto">
            <LogOut size={14} /> Çıkış Yap
          </button>
        </div>
      </div>
    );
  }

  // Suspended state
  if (dealer.subscription_status === "suspended") {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-16">
        <div className="max-w-[480px] w-full bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-40 text-center">
          <div className="w-[64px] h-[64px] bg-red-100 rounded-full flex items-center justify-center mx-auto mb-20">
            <AlertCircle size={28} className="text-red-600" />
          </div>
          <h1 className="text-[22px] font-bold text-on-surface mb-12">Hesabınız Askıya Alındı</h1>
          <p className="text-[14px] text-muted-text leading-relaxed mb-20">
            Hesabınız askıya alınmış. Detaylı bilgi için bizimle iletişime geçin.
          </p>
          <button onClick={logout} className="text-[13px] text-muted-text hover:text-primary flex items-center gap-6 mx-auto">
            <LogOut size={14} /> Çıkış Yap
          </button>
        </div>
      </div>
    );
  }

  const badgeCount = (href: string) => {
    if (href.includes("mesajlar")) return unreadMessages;
    if (href.includes("bildirimler")) return unreadNotifs;
    return 0;
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-16 bg-surface-container-lowest border-b border-[0.5px] border-border-default sticky top-0 z-50">
        <span className="font-bold text-[16px] text-on-surface truncate">{dealer.company_name}</span>
        <div className="flex items-center gap-8">
          <NotificationBell unreadCount={unreadNotifs} onUnreadChange={setUnreadNotifs} />
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-8 text-on-surface">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 h-screen w-[240px] bg-surface-container-lowest border-r border-[0.5px] border-border-default flex flex-col z-40 transition-transform duration-300 md:translate-x-0",
        menuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand */}
        <div className="p-20 hidden md:block border-b border-[0.5px] border-border-default">
          <div className="font-bold text-[14px] text-on-surface truncate">{dealer.company_name}</div>
          <div className="text-[11px] text-muted-text mt-2 capitalize">{dealer.subscription_plan || "basic"} Plan</div>
        </div>

        <nav className="flex-1 py-16 flex flex-col gap-4 px-12 mt-60 md:mt-0 overflow-y-auto">
          {NAV.map((item) => {
            const isActive = item.exact
              ? pathname === item.href || pathname === `/${item.href}` || pathname?.endsWith(item.href)
              : (pathname?.includes(item.href.split("/").pop()!) ?? false);
            const count = badgeCount(item.href);

            return (
              <Link
                key={item.href}
                href={item.href as any}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex items-center gap-10 px-14 py-11 rounded-lg text-[13px] font-medium transition-colors relative",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-text hover:bg-surface hover:text-on-surface"
                )}
              >
                <item.icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                {item.label}
                {count > 0 && (
                  <span className="ml-auto w-[18px] h-[18px] bg-primary text-white text-[10px] rounded-full flex items-center justify-center">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-12 border-t border-[0.5px] border-border-default">
          <button
            onClick={logout}
            className="flex items-center gap-10 px-14 py-11 w-full rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} strokeWidth={1.5} /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-16 md:p-28 overflow-x-hidden min-w-0">
        <div className="hidden md:flex items-center justify-end mb-20">
          <NotificationBell unreadCount={unreadNotifs} onUnreadChange={setUnreadNotifs} />
        </div>
        {children}
      </main>

      {menuOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setMenuOpen(false)} />
      )}
    </div>
  );
}

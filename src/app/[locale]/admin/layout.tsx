/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard, Users, FileText, LogOut, Menu, X,
  Building2, ClipboardList, CreditCard, BarChart3, ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard",         href: "/admin",                   icon: LayoutDashboard },
  { label: "Bayiler",           href: "/admin/bayiler",           icon: Building2 },
  { label: "İlan Moderasyonu",  href: "/admin/ilanlar",           icon: ClipboardList },
  { label: "Abonelikler",       href: "/admin/abonelikler",       icon: CreditCard },
  { label: "Platform Analitik", href: "/admin/platform-analitik", icon: BarChart3 },
  { label: "Audit Logları",     href: "/admin/audit-loglari",     icon: ShieldCheck },
  { label: "Talepler",          href: "/admin/leads",             icon: Users },
  { label: "Blog Yönetimi",     href: "/admin/blogs",             icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname?.endsWith("/admin/login");

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && !isLoginPage) {
        // Find locale from pathname
        const match = pathname?.match(/^\/([a-z]{2})\//);
        const locale = match ? match[1] : "tr";
        router.push('/admin/login', { locale: locale as any });
      } else {
        setAuthenticated(!!session);
      }
      setLoading(false);
    }
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
      if (!session && !isLoginPage) {
        const match = pathname?.match(/^\/([a-z]{2})\//);
        const locale = match ? match[1] : "tr";
        router.push('/admin/login', { locale: locale as any });
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname, isLoginPage]);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest">
        <div className="w-[32px] h-[32px] border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!authenticated) {
    return null;
  }

  const locale = pathname?.match(/^\/([a-z]{2})\//)?.[1] || "tr";

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-16 bg-surface-container-lowest border-b border-[0.5px] border-border-default z-50 sticky top-0">
        <Link href="/admin" className="font-bold text-[20px] text-on-surface">
          Oto Grade Admin
        </Link>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-8 text-on-surface">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 h-screen w-[260px] bg-surface-container-lowest border-r border-[0.5px] border-border-default flex flex-col z-40 transition-transform duration-300 md:translate-x-0",
        menuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-24 hidden md:block">
          <Link href="/admin" className="font-bold text-[24px] text-on-surface tracking-[-1px]">
            Oto Grade Admin
          </Link>
        </div>
        
        <nav className="flex-1 py-16 flex flex-col gap-8 px-16 mt-60 md:mt-0">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.label}
                href={item.href as any}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex items-center gap-12 px-16 py-12 rounded-lg text-[14px] font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-text hover:bg-surface hover:text-on-surface"
                )}
              >
                <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-16 border-t border-[0.5px] border-border-default">
          <button
            onClick={handleLogout}
            className="flex items-center gap-12 px-16 py-12 w-full rounded-lg text-[14px] font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} strokeWidth={1.5} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-16 md:p-32 overflow-x-hidden">
        {children}
      </main>
      
      {/* Mobile overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}

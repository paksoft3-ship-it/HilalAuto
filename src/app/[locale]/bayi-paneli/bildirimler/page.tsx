"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Bell,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageSquare,
  Star,
  XCircle,
  Zap,
} from "lucide-react";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  listing_id: string | null;
  is_read: boolean;
  created_at: string;
};

const PAGE_SIZE = 20;

const TYPE_ICONS: Record<string, React.ReactNode> = {
  listing_approved: <Zap size={15} className="text-green-600" />,
  listing_rejected: <XCircle size={15} className="text-red-500" />,
  new_message: <MessageSquare size={15} className="text-blue-600" />,
  subscription_expiring: <Clock size={15} className="text-amber-600" />,
  subscription_expired: <AlertCircle size={15} className="text-red-500" />,
  listing_featured: <Star size={15} className="text-amber-500" />,
};

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return null;

  return {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  };
}

function notificationHref(notification: Notification) {
  if (notification.type === "new_message") return "/bayi-paneli/mesajlar";
  if (notification.listing_id) return `/bayi-paneli/ilan-duzenle/${notification.listing_id}`;
  return null;
}

export default function BildirimlerPage() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  async function load(nextPage = page) {
    setLoading(true);
    const headers = await getAuthHeaders();
    if (!headers) {
      setLoading(false);
      return;
    }

    const res = await fetch(`/api/notifications?page=${nextPage}&limit=${PAGE_SIZE}`, { headers });
    if (!res.ok) {
      setLoading(false);
      return;
    }

    const data = await res.json();
    setNotifs((data.notifications || []) as Notification[]);
    setTotal(data.total || 0);
    setUnreadCount(data.unreadCount || 0);
    setLoading(false);
  }

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function markRead(ids: string[]) {
    if (ids.length === 0) return;

    const headers = await getAuthHeaders();
    if (!headers) return;

    const res = await fetch("/api/notifications/mark-read", {
      method: "PATCH",
      headers,
      body: JSON.stringify({ ids }),
    });

    if (!res.ok) return;

    const data = await res.json();
    setUnreadCount(data.unreadCount || 0);
    setNotifs((items) => items.map((item) => (
      ids.includes(item.id) ? { ...item, is_read: true } : item
    )));
  }

  async function markAllRead() {
    const headers = await getAuthHeaders();
    if (!headers) return;

    const res = await fetch("/api/notifications/mark-read", {
      method: "PATCH",
      headers,
      body: JSON.stringify({ all: true }),
    });

    if (!res.ok) return;

    setUnreadCount(0);
    setNotifs((items) => items.map((item) => ({ ...item, is_read: true })));
  }

  async function handleClick(notification: Notification) {
    if (!notification.is_read) {
      await markRead([notification.id]);
    }

    const href = notificationHref(notification);
    if (href) router.push(href as never);
  }

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex max-w-[760px] flex-col gap-24">
      <div className="flex flex-col gap-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-[-0.5px] text-on-surface">
            Bildirimler
            {unreadCount > 0 && (
              <span className="ml-8 rounded-full bg-primary px-8 py-3 text-[14px] text-white">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="mt-4 text-[13px] text-muted-text">{total} bildirim</p>
        </div>

        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-8 text-[12px] text-muted-text hover:text-primary">
            <CheckCheck size={14} /> Tümünü Okundu İşaretle
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex animate-pulse flex-col gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-[76px] rounded-card border border-[0.5px] border-border-default bg-surface-container-lowest" />
          ))}
        </div>
      ) : notifs.length === 0 ? (
        <div className="rounded-card border border-[0.5px] border-border-default bg-surface-container-lowest py-48 text-center">
          <Bell size={32} className="mx-auto mb-12 text-muted-text opacity-50" />
          <p className="text-[14px] text-muted-text">Henüz bildiriminiz yok</p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-card border border-[0.5px] border-border-default bg-surface-container-lowest">
            {notifs.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleClick(notification)}
                className={cn(
                  "flex w-full cursor-pointer items-start gap-14 border-b border-[0.5px] border-border-default px-16 py-16 text-left transition-colors last:border-0 hover:bg-surface sm:px-20",
                  !notification.is_read && "bg-primary/5",
                )}
              >
                <span className="mt-1 shrink-0">
                  {TYPE_ICONS[notification.type] || <Bell size={15} className="text-muted-text" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-8">
                    <span className={cn(
                      "text-[13px]",
                      !notification.is_read ? "font-semibold text-on-surface" : "font-medium text-on-surface",
                    )}>
                      {notification.title}
                    </span>
                    <span className="shrink-0 text-[10px] text-muted-text">
                      {new Date(notification.created_at).toLocaleDateString("tr-TR")}
                    </span>
                  </span>
                  <span className="mt-2 block text-[12px] leading-relaxed text-muted-text">
                    {notification.body}
                  </span>
                </span>
                {!notification.is_read && <span className="mt-1 h-[8px] w-[8px] shrink-0 rounded-full bg-primary" />}
              </button>
            ))}
          </div>

          {pageCount > 1 && (
            <div className="flex items-center justify-between gap-12">
              <button
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={page === 1}
                className="flex items-center gap-6 rounded-btn border border-[0.5px] border-border-default bg-surface-container-lowest px-12 py-8 text-[12px] text-muted-text transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={14} /> Önceki
              </button>
              <span className="text-[12px] text-muted-text">
                Sayfa {page} / {pageCount}
              </span>
              <button
                onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
                disabled={page === pageCount}
                className="flex items-center gap-6 rounded-btn border border-[0.5px] border-border-default bg-surface-container-lowest px-12 py-8 text-[12px] text-muted-text transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sonraki <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

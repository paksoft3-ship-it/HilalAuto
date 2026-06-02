"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { AlertCircle, Bell, Clock, MessageSquare, Star, XCircle, Zap } from "lucide-react";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  listing_id: string | null;
  is_read: boolean;
  created_at: string;
};

type Props = {
  unreadCount: number;
  onUnreadChange: (count: number) => void;
};

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
  return "/bayi-paneli/bildirimler";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function NotificationBell({ unreadCount, onUnreadChange }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

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
    onUnreadChange(data.unreadCount || 0);
    setNotifications((items) => items.map((item) => (
      ids.includes(item.id) ? { ...item, is_read: true } : item
    )));
  }

  async function openDropdown() {
    setOpen((value) => !value);
    if (open) return;

    setLoading(true);
    const headers = await getAuthHeaders();
    if (!headers) {
      setLoading(false);
      return;
    }

    const res = await fetch("/api/notifications?limit=5", { headers });
    if (!res.ok) {
      setLoading(false);
      return;
    }

    const data = await res.json();
    const items = (data.notifications || []) as Notification[];
    setNotifications(items);
    onUnreadChange(data.unreadCount || 0);
    setLoading(false);

    const unreadIds = items.filter((item) => !item.is_read).map((item) => item.id);
    await markRead(unreadIds);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={openDropdown}
        aria-label="Bildirimler"
        className="relative flex h-[38px] w-[38px] items-center justify-center rounded-full border border-[0.5px] border-border-default bg-surface-container-lowest text-on-surface transition-colors hover:border-primary hover:text-primary"
      >
        <Bell size={18} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-4 text-[10px] font-semibold leading-none text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[46px] z-[80] w-[min(calc(100vw-32px),360px)] overflow-hidden rounded-card border border-[0.5px] border-border-default bg-surface-container-lowest shadow-lg">
          <div className="flex items-center justify-between border-b border-[0.5px] border-border-default px-16 py-12">
            <p className="text-[13px] font-semibold text-on-surface">Bildirimler</p>
            <Link
              href="/bayi-paneli/bildirimler"
              onClick={() => setOpen(false)}
              className="text-[12px] font-medium text-primary hover:underline"
            >
              Tümünü gör
            </Link>
          </div>

          {loading ? (
            <div className="p-16">
              <div className="h-[56px] animate-pulse rounded-lg bg-surface" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-16 py-28 text-center">
              <Bell size={24} className="mx-auto mb-8 text-muted-text opacity-50" />
              <p className="text-[13px] text-muted-text">Henüz bildiriminiz yok</p>
            </div>
          ) : (
            <div className="max-h-[360px] overflow-y-auto">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notificationHref(notification) as never}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-start gap-12 border-b border-[0.5px] border-border-default px-16 py-13 last:border-0 transition-colors hover:bg-surface",
                    !notification.is_read && "bg-primary/5",
                  )}
                >
                  <span className="mt-1 shrink-0">
                    {TYPE_ICONS[notification.type] || <Bell size={15} className="text-muted-text" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-8">
                      <span className={cn(
                        "line-clamp-1 text-[13px]",
                        notification.is_read ? "font-medium text-on-surface" : "font-semibold text-on-surface",
                      )}>
                        {notification.title}
                      </span>
                      <span className="shrink-0 text-[10px] text-muted-text">
                        {formatDate(notification.created_at)}
                      </span>
                    </span>
                    <span className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-muted-text">
                      {notification.body}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

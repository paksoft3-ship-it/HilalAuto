"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DealerMessage } from "@/types/marketplace";
import { MessageSquare, Phone, ExternalLink, CheckCheck } from "lucide-react";
import { externalRoutes } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface MsgWithListing extends DealerMessage {
  listing?: { title: string; slug: string } | null;
}

export default function MesajlarPage() {
  const [messages, setMessages] = useState<MsgWithListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [, setDealerId] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: d } = await supabase.from("hazaral_dealers").select("id").eq("user_id", session.user.id).single();
      if (!d) return;
      setDealerId(d.id);

      const { data } = await supabase
        .from("hazaral_dealer_messages")
        .select("*, listing:hazaral_listings(title, slug)")
        .eq("dealer_id", d.id)
        .order("created_at", { ascending: false });

      setMessages((data as MsgWithListing[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  async function markRead(id: string) {
    await supabase.from("hazaral_dealer_messages").update({ is_read: true }).eq("id", id);
    setMessages((ms) => ms.map((m) => m.id === id ? { ...m, is_read: true } : m));
  }

  const unread = messages.filter((m) => !m.is_read).length;
  const selected = messages.find((m) => m.id === selectedId);

  return (
    <div className="flex flex-col gap-20">
      <div>
        <h1 className="text-[22px] font-bold text-on-surface tracking-[-0.5px]">
          Mesajlar {unread > 0 && <span className="ml-8 text-[14px] bg-primary text-white px-8 py-3 rounded-full">{unread}</span>}
        </h1>
        <p className="text-[13px] text-muted-text mt-4">İlanlarınıza gelen mesajlar</p>
      </div>

      {loading ? (
        <div className="animate-pulse flex flex-col gap-10">
          {[1, 2, 3].map((i) => <div key={i} className="h-[70px] bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card" />)}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-48 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card">
          <MessageSquare size={32} className="text-muted-text mx-auto mb-12" />
          <p className="text-[14px] text-muted-text">Henüz mesaj yok.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Message list */}
          <div className="flex flex-col gap-0 lg:w-[340px] shrink-0 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card overflow-hidden">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => { setSelectedId(msg.id); if (!msg.is_read) markRead(msg.id); }}
                className={cn(
                  "w-full flex items-start gap-12 px-16 py-14 border-b border-[0.5px] border-border-default last:border-0 text-left hover:bg-surface transition-colors",
                  selectedId === msg.id && "bg-primary/5",
                  !msg.is_read && "bg-blue-50/50"
                )}
              >
                <div className={cn("w-[8px] h-[8px] rounded-full mt-2 shrink-0", !msg.is_read ? "bg-primary" : "bg-transparent")} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-8">
                    <span className={cn("text-[13px] truncate", !msg.is_read ? "font-semibold text-on-surface" : "font-medium text-muted-text")}>
                      {msg.sender_name}
                    </span>
                    <span className="text-[10px] text-muted-text shrink-0">
                      {new Date(msg.created_at).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                  {msg.listing && <div className="text-[11px] text-primary mt-1 truncate">{msg.listing.title}</div>}
                  <div className="text-[11px] text-muted-text mt-1 truncate">{msg.message}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Message detail */}
          <div className="flex-1 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-24">
            {!selected ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-text">
                <MessageSquare size={32} className="mb-12 opacity-50" />
                <p className="text-[13px]">Bir mesaj seçin</p>
              </div>
            ) : (
              <div className="flex flex-col gap-20">
                {/* Sender info */}
                <div className="flex items-start justify-between gap-12">
                  <div>
                    <h2 className="text-[16px] font-semibold text-on-surface">{selected.sender_name}</h2>
                    <a href={`tel:${selected.sender_phone}`} className="text-[13px] text-primary hover:underline flex items-center gap-6 mt-4">
                      <Phone size={13} /> {selected.sender_phone}
                    </a>
                    {selected.sender_email && (
                      <div className="text-[12px] text-muted-text mt-2">{selected.sender_email}</div>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-text">
                    {new Date(selected.created_at).toLocaleString("tr-TR")}
                  </span>
                </div>

                {/* Listing context */}
                {selected.listing && (
                  <div className="bg-surface border border-[0.5px] border-border-default rounded-lg p-12 flex items-center gap-10">
                    <span className="text-[12px] text-muted-text">İlan:</span>
                    <span className="text-[12px] font-medium text-on-surface flex-1 truncate">{selected.listing.title}</span>
                    <a href={`/ara/${selected.listing.slug}`} target="_blank" rel="noopener" className="text-muted-text hover:text-primary">
                      <ExternalLink size={13} />
                    </a>
                  </div>
                )}

                {/* Message body */}
                <div className="bg-surface rounded-xl border border-[0.5px] border-border-default p-16">
                  <p className="text-[13px] text-on-surface leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-10">
                  <a
                    href={externalRoutes.whatsapp(
                      selected.sender_phone.replace(/\D/g, ""),
                      `Merhaba ${selected.sender_name}, "${selected.listing?.title || "ilanınız"}" hakkındaki mesajınızı aldım.`
                    )}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-8 bg-[#25D366] text-white px-20 py-10 rounded-btn text-[13px] font-semibold hover:opacity-90"
                  >
                    WhatsApp ile Yanıtla
                  </a>
                  <a
                    href={`tel:${selected.sender_phone}`}
                    className="flex items-center gap-8 border border-[0.5px] border-border-default text-on-surface px-20 py-10 rounded-btn text-[13px] font-medium hover:border-primary hover:text-primary transition-colors"
                  >
                    <Phone size={14} /> Ara
                  </a>
                  {!selected.is_read && (
                    <button
                      onClick={() => markRead(selected.id)}
                      className="flex items-center gap-8 text-[13px] text-muted-text hover:text-on-surface ml-auto"
                    >
                      <CheckCheck size={14} /> Okundu İşaretle
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

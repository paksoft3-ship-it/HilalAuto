"use client";

import { useState } from "react";
import { Dealer, Listing } from "@/types/marketplace";
import { FaWhatsapp } from "react-icons/fa";
import { Phone, Send, Link2, Heart, Star, MapPin, Flag, EyeOff } from "lucide-react";
import { externalRoutes } from "@/lib/routes";
import {
  trackWhatsAppClick,
  trackPhoneReveal,
  trackMessageSent,
} from "@/lib/marketplace-tracker";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface ContactCardProps {
  listing: Listing;
  dealer: Dealer;
  sessionId: string;
}

export function ContactCard({ listing, dealer, sessionId }: ContactCardProps) {
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [msgForm, setMsgForm] = useState({ name: "", phone: "", message: "" });
  const [msgSending, setMsgSending] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
  const [msgError, setMsgError] = useState("");

  const phone = dealer.phone;
  const wa = dealer.whatsapp || dealer.phone.replace(/\D/g, "");
  const waMessage = `Merhaba, ${listing.title} ilanınız hakkında bilgi almak istiyorum. (İlan: ${listing.slug})`;

  async function handleWhatsApp() {
    await trackWhatsAppClick(listing.id, dealer.id);
    window.open(externalRoutes.whatsapp(wa, waMessage), "_blank", "noopener");
  }

  async function handlePhoneReveal() {
    if (!phoneRevealed) {
      await trackPhoneReveal(listing.id, dealer.id);
      setPhoneRevealed(true);
    }
  }

  async function handleFavorite() {
    if (isFavorite) {
      await supabase
        .from("hazaral_favorites")
        .delete()
        .eq("listing_id", listing.id)
        .eq("session_id", sessionId);
      setIsFavorite(false);
    } else {
      await supabase.from("hazaral_favorites").insert({
        listing_id: listing.id,
        session_id: sessionId,
      });
      setIsFavorite(true);
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleMessage(e: React.FormEvent) {
    e.preventDefault();
    setMsgSending(true);
    setMsgError("");
    try {
      await trackMessageSent(
        listing.id,
        dealer.id,
        msgForm.name,
        msgForm.phone,
        msgForm.message
      );
      setMsgSent(true);
    } catch {
      setMsgError("Mesaj gönderilemedi. Lütfen tekrar deneyin.");
    }
    setMsgSending(false);
  }

  return (
    <div className="flex flex-col gap-16">
      {/* Dealer info */}
      <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-20">
        <div className="flex items-center gap-12 mb-16">
          {dealer.logo_url ? (
            <img
              src={dealer.logo_url}
              alt={dealer.company_name}
              className="w-[48px] h-[48px] rounded-full object-cover border border-[0.5px] border-border-default"
            />
          ) : (
            <div className="w-[48px] h-[48px] rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[18px]">
              {dealer.company_name[0]}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[14px] text-on-surface truncate">
              {dealer.company_name}
            </div>
            {dealer.is_verified && (
              <div className="flex items-center gap-4 text-[11px] text-primary font-medium">
                <Star size={10} fill="currentColor" /> Onaylı Bayi
              </div>
            )}
            <div className="flex items-center gap-4 text-[11px] text-muted-text mt-2">
              <MapPin size={10} /> {dealer.city}
              {dealer.district && `, ${dealer.district}`}
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <button
          onClick={handleWhatsApp}
          className="w-full flex items-center justify-center gap-10 bg-[#25D366] hover:opacity-90 text-white py-14 rounded-btn text-[14px] font-semibold transition-opacity mb-10"
        >
          <FaWhatsapp size={20} /> WhatsApp ile Yaz
        </button>

        {/* Phone reveal */}
        <button
          onClick={handlePhoneReveal}
          className="w-full flex items-center justify-center gap-10 bg-surface-container-lowest border border-[0.5px] border-border-default hover:border-primary hover:text-primary text-on-surface py-12 rounded-btn text-[13px] font-medium transition-colors"
        >
          {phoneRevealed ? (
            <>
              <Phone size={15} />
              <a href={`tel:${phone}`} className="text-primary font-semibold">
                {phone}
              </a>
            </>
          ) : (
            <>
              <EyeOff size={15} /> Telefonu Göster
            </>
          )}
        </button>
      </div>

      {/* Message form */}
      <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-20">
        <h3 className="text-[14px] font-semibold text-on-surface mb-14 flex items-center gap-8">
          <Send size={15} className="text-primary" /> Mesaj Gönder
        </h3>

        {msgSent ? (
          <div className="bg-green-50 text-green-700 text-[13px] p-12 rounded-lg text-center">
            Mesajınız iletildi. Bayi en kısa sürede dönüş yapacak.
          </div>
        ) : (
          <form onSubmit={handleMessage} className="flex flex-col gap-10">
            <input
              type="text"
              placeholder="Ad Soyad"
              required
              value={msgForm.name}
              onChange={(e) => setMsgForm({ ...msgForm, name: e.target.value })}
              className="w-full px-14 py-10 bg-surface border border-[0.5px] border-border-default rounded-input text-[13px] text-on-surface outline-none focus:border-primary transition-colors"
            />
            <input
              type="tel"
              placeholder="Telefon"
              required
              value={msgForm.phone}
              onChange={(e) => setMsgForm({ ...msgForm, phone: e.target.value })}
              className="w-full px-14 py-10 bg-surface border border-[0.5px] border-border-default rounded-input text-[13px] text-on-surface outline-none focus:border-primary transition-colors"
            />
            <textarea
              placeholder="Mesajınız..."
              required
              rows={3}
              value={msgForm.message}
              onChange={(e) => setMsgForm({ ...msgForm, message: e.target.value })}
              className="w-full px-14 py-10 bg-surface border border-[0.5px] border-border-default rounded-input text-[13px] text-on-surface outline-none focus:border-primary transition-colors resize-none"
            />
            {msgError && <p className="text-[12px] text-red-600">{msgError}</p>}
            <button
              type="submit"
              disabled={msgSending}
              className="w-full bg-primary text-white py-10 rounded-btn text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {msgSending ? "Gönderiliyor..." : "Mesaj Gönder"}
            </button>
          </form>
        )}
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-8">
        <button
          onClick={handleCopyLink}
          className="flex-1 flex items-center justify-center gap-8 bg-surface-container-lowest border border-[0.5px] border-border-default hover:border-primary py-10 rounded-btn text-[12px] font-medium text-on-surface transition-colors"
        >
          <Link2 size={13} /> {copied ? "Kopyalandı!" : "Linki Kopyala"}
        </button>
        <button
          onClick={handleFavorite}
          className={cn(
            "flex items-center justify-center gap-8 bg-surface-container-lowest border border-[0.5px] px-16 py-10 rounded-btn text-[12px] font-medium transition-colors",
            isFavorite
              ? "border-red-400 text-red-500"
              : "border-border-default text-muted-text hover:border-red-300 hover:text-red-400"
          )}
          aria-label="Favorilere ekle"
        >
          <Heart size={13} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <button
          className="flex items-center justify-center gap-8 bg-surface-container-lowest border border-[0.5px] border-border-default hover:border-red-300 hover:text-red-400 px-16 py-10 rounded-btn text-[12px] font-medium text-muted-text transition-colors"
          title="İlanı şikayet et"
          aria-label="Şikayet et"
        >
          <Flag size={13} />
        </button>
      </div>
    </div>
  );
}

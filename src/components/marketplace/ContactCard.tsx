"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Dealer, Listing } from "@/types/marketplace";
import { FaWhatsapp } from "react-icons/fa";
import { Phone, Send, Link2, Heart, Star, MapPin, Flag, EyeOff, Tag } from "lucide-react";
import { externalRoutes } from "@/lib/routes";
import {
  trackWhatsAppClick,
  trackPhoneReveal,
  trackMessageSent,
  trackOfferSent,
} from "@/lib/marketplace-tracker";
import { fireGoogleAdsConversion } from "@/lib/gtag";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface ContactCardProps {
  listing: Listing;
  dealer: Dealer;
  sessionId: string;
  locale?: string;
}

export function ContactCard({ listing, dealer, sessionId }: ContactCardProps) {
  const t = useTranslations("contactCard");
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [msgForm, setMsgForm] = useState({ name: "", phone: "", message: "" });
  const [msgSending, setMsgSending] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
  const [msgError, setMsgError] = useState("");
  const [offerOpen, setOfferOpen] = useState(false);
  const [offerForm, setOfferForm] = useState({ name: "", phone: "", amount: "", note: "" });
  const [offerSending, setOfferSending] = useState(false);
  const [offerSent, setOfferSent] = useState(false);
  const [offerError, setOfferError] = useState("");

  const phone = dealer.phone;
  const wa = dealer.whatsapp || dealer.phone.replace(/\D/g, "");
  const text = {
    verified: t("verified"),
    whatsapp: t("whatsapp"),
    showPhone: t("showPhone"),
    messageTitle: t("messageTitle"),
    name: t("name"),
    phone: t("phone"),
    message: t("message"),
    sent: t("sent"),
    error: t("error"),
    sending: t("sending"),
    submit: t("submit"),
    copied: t("copied"),
    copy: t("copy"),
    favorite: t("favorite"),
    report: t("report"),
  };
  const waMessage = t("whatsappMessage", { title: listing.title, slug: listing.slug });

  async function handleWhatsApp() {
    await trackWhatsAppClick(listing.id, dealer.id);
    fireGoogleAdsConversion();
    window.open(externalRoutes.whatsapp(wa, waMessage), "_blank", "noopener");
  }

  async function handlePhoneReveal() {
    if (!phoneRevealed) {
      await trackPhoneReveal(listing.id, dealer.id);
      fireGoogleAdsConversion();
      setPhoneRevealed(true);
    }
  }

  async function handleOffer(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(offerForm.amount.replace(/\D/g, ""));
    if (!amount) {
      setOfferError(t("offerAmountInvalid"));
      return;
    }
    setOfferSending(true);
    setOfferError("");
    try {
      await trackOfferSent(
        listing.id,
        dealer.id,
        offerForm.name,
        offerForm.phone,
        amount,
        offerForm.note
      );
      fireGoogleAdsConversion();
      setOfferSent(true);
    } catch {
      setOfferError(text.error);
    }
    setOfferSending(false);
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
      fireGoogleAdsConversion();
      setMsgSent(true);
    } catch {
      setMsgError(text.error);
    }
    setMsgSending(false);
  }

  return (
    <div className="flex flex-col gap-16">
      {/* Dealer info */}
      <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-24">
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
                <Star size={10} fill="currentColor" /> {text.verified}
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
          className="w-full flex items-center justify-center gap-8 bg-[#25D366] hover:opacity-90 text-white px-16 py-12 rounded-btn text-[14px] font-semibold transition-opacity mb-8"
        >
          <FaWhatsapp size={20} /> {text.whatsapp}
        </button>

        {/* Make an offer — pazarlık is the norm in this market, so capture the
            buyer who thinks the price is close but not right. */}
        {offerSent ? (
          <div className="bg-green-50 text-green-700 text-[13px] p-12 rounded-lg text-center mb-8">
            {t("offerSent")}
          </div>
        ) : offerOpen ? (
          <form onSubmit={handleOffer} className="flex flex-col gap-8 mb-8 p-14 bg-surface border border-[0.5px] border-border-default rounded-card">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-on-surface">{t("offerTitle")}</span>
              <button
                type="button"
                onClick={() => setOfferOpen(false)}
                className="text-[12px] text-muted-text hover:text-on-surface"
              >
                {t("offerCancel")}
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder={t("offerAmount")}
                required
                value={offerForm.amount}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  setOfferForm({
                    ...offerForm,
                    amount: digits ? Number(digits).toLocaleString("tr-TR") : "",
                  });
                }}
                className="w-full px-12 py-10 pr-32 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-input text-[15px] font-semibold text-on-surface outline-none focus:border-primary transition-colors"
              />
              <span className="absolute right-12 top-1/2 -translate-y-1/2 text-[13px] text-muted-text">TL</span>
            </div>
            <input
              type="text"
              placeholder={text.name}
              required
              value={offerForm.name}
              onChange={(e) => setOfferForm({ ...offerForm, name: e.target.value })}
              className="w-full px-12 py-8 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-input text-[13px] text-on-surface outline-none focus:border-primary transition-colors"
            />
            <input
              type="tel"
              placeholder={text.phone}
              required
              value={offerForm.phone}
              onChange={(e) => setOfferForm({ ...offerForm, phone: e.target.value })}
              className="w-full px-12 py-8 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-input text-[13px] text-on-surface outline-none focus:border-primary transition-colors"
            />
            <input
              type="text"
              placeholder={t("offerNote")}
              value={offerForm.note}
              onChange={(e) => setOfferForm({ ...offerForm, note: e.target.value })}
              className="w-full px-12 py-8 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-input text-[13px] text-on-surface outline-none focus:border-primary transition-colors"
            />
            {offerError && <p className="text-[12px] text-red-600">{offerError}</p>}
            <button
              type="submit"
              disabled={offerSending}
              className="w-full bg-primary text-white py-12 rounded-btn text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {offerSending ? text.sending : t("offerSubmit")}
            </button>
            <p className="text-[11px] text-muted-text text-center">{t("offerHint")}</p>
          </form>
        ) : (
          <button
            onClick={() => setOfferOpen(true)}
            className="w-full flex items-center justify-center gap-8 bg-primary/10 border border-[0.5px] border-primary/30 hover:bg-primary/15 text-primary px-16 py-12 rounded-btn text-[14px] font-semibold transition-colors mb-8"
          >
            <Tag size={16} /> {t("offerCta")}
          </button>
        )}

        {/* Phone reveal */}
        <button
          onClick={handlePhoneReveal}
          className="w-full flex items-center justify-center gap-8 bg-surface-container-lowest border border-[0.5px] border-border-default hover:border-primary hover:text-primary text-on-surface px-16 py-12 rounded-btn text-[13px] font-medium transition-colors"
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
              <EyeOff size={15} /> {text.showPhone}
            </>
          )}
        </button>
      </div>

      {/* Message form */}
      <div className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-24">
        <h3 className="text-[14px] font-semibold text-on-surface mb-14 flex items-center gap-8">
          <Send size={15} className="text-primary" /> {text.messageTitle}
        </h3>

        {msgSent ? (
          <div className="bg-green-50 text-green-700 text-[13px] p-12 rounded-lg text-center">
            {text.sent}
          </div>
        ) : (
          <form onSubmit={handleMessage} className="flex flex-col gap-8">
            <input
              type="text"
              placeholder={text.name}
              required
              value={msgForm.name}
              onChange={(e) => setMsgForm({ ...msgForm, name: e.target.value })}
              className="w-full px-12 py-8 bg-surface border border-[0.5px] border-border-default rounded-input text-[13px] text-on-surface outline-none focus:border-primary transition-colors"
            />
            <input
              type="tel"
              placeholder={text.phone}
              required
              value={msgForm.phone}
              onChange={(e) => setMsgForm({ ...msgForm, phone: e.target.value })}
              className="w-full px-12 py-8 bg-surface border border-[0.5px] border-border-default rounded-input text-[13px] text-on-surface outline-none focus:border-primary transition-colors"
            />
            <textarea
              placeholder={text.message}
              required
              rows={3}
              value={msgForm.message}
              onChange={(e) => setMsgForm({ ...msgForm, message: e.target.value })}
              className="w-full px-12 py-8 bg-surface border border-[0.5px] border-border-default rounded-input text-[13px] text-on-surface outline-none focus:border-primary transition-colors resize-none"
            />
            {msgError && <p className="text-[12px] text-red-600">{msgError}</p>}
            <button
              type="submit"
              disabled={msgSending}
              className="w-full bg-primary text-white py-12 rounded-btn text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {msgSending ? text.sending : text.submit}
            </button>
          </form>
        )}
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-8">
        <button
          onClick={handleCopyLink}
          className="flex-1 flex items-center justify-center gap-8 bg-surface-container-lowest border border-[0.5px] border-border-default hover:border-primary py-8 rounded-btn text-[12px] font-medium text-on-surface transition-colors"
        >
          <Link2 size={13} /> {copied ? text.copied : text.copy}
        </button>
        <button
          onClick={handleFavorite}
          className={cn(
            "flex items-center justify-center gap-8 bg-surface-container-lowest border border-[0.5px] px-16 py-8 rounded-btn text-[12px] font-medium transition-colors",
            isFavorite
              ? "border-red-400 text-red-500"
              : "border-border-default text-muted-text hover:border-red-300 hover:text-red-400"
          )}
          aria-label={text.favorite}
        >
          <Heart size={13} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <button
          className="flex items-center justify-center gap-8 bg-surface-container-lowest border border-[0.5px] border-border-default hover:border-red-300 hover:text-red-400 px-16 py-8 rounded-btn text-[12px] font-medium text-muted-text transition-colors"
          title={text.report}
          aria-label={text.report}
        >
          <Flag size={13} />
        </button>
      </div>
    </div>
  );
}

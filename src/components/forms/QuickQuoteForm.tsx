"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Loader2 } from "lucide-react";
import { externalRoutes } from "@/lib/routes";
import { DAMAGE_TYPES, WHATSAPP_NUMBER } from "@/lib/constants";
import { trackFormSubmit, trackLeadSuccess, trackWhatsApp } from "@/lib/tracking";
import { fireGoogleAdsConversion } from "@/lib/gtag";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => String(CURRENT_YEAR - i));

export function QuickQuoteForm() {
  const t = useTranslations("form");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    brand: "",
    year: "",
    damage: "",
    city: "",
    phone: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.brand || !formData.year || !formData.damage || !formData.city || !formData.phone) {
      setErrorMsg(t("errorEmpty", { default: "Lütfen tüm alanları doldurun." }));
      return;
    }

    setIsLoading(true);
    trackFormSubmit("quick_quote");

    try {
      const res = await fetch("/api/quick-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t("errorGeneric", { default: "Bir hata oluştu." }));
      }

      trackLeadSuccess(data.id || "quick_quote");
      fireGoogleAdsConversion();
      trackWhatsApp("quick_quote_form");

      // Success! Format WhatsApp message and redirect
      const message = t("whatsappMessage", {
        default: "Merhaba, {brand} ({year}) aracım için teklif almak istiyorum. Hasar: {damage}, Şehir: {city}. Telefonum: {phone}",
        brand: formData.brand,
        year: formData.year,
        damage: formData.damage,
        city: formData.city,
        phone: formData.phone
      });
      window.open(externalRoutes.whatsapp(WHATSAPP_NUMBER, message), "_blank");
      
      // Optionally clear form
      setFormData({ brand: "", year: "", damage: "", city: "", phone: "" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg(t("errorGeneric", { default: "Bir hata oluştu." }));
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-12"
      aria-label={t("ariaLabel", { default: "Hızlı teklif formu" })}
    >
      {/* Brand */}
      <div>
        <label htmlFor="qq-brand" className="sr-only">
          {t("brand", { default: "Araç Markası" })}
        </label>
        <input
          id="qq-brand"
          type="text"
          placeholder={t("brand", { default: "Araç Markası" })}
          autoComplete="off"
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          className="w-full bg-surface-container-lowest border border-[0.5px] border-border-default rounded-input px-16 py-12 text-[14px] text-on-surface placeholder:text-soft-text outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Year */}
      <div className="relative">
        <label htmlFor="qq-year" className="sr-only">
          {t("year", { default: "Model Yılı" })}
        </label>
        <select
          id="qq-year"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          className="w-full appearance-none bg-surface-container-lowest border border-[0.5px] border-border-default rounded-input px-16 py-12 pr-44 text-[14px] text-on-surface outline-none focus:border-primary transition-colors cursor-pointer"
        >
          <option value="" disabled>
            {t("year", { default: "Model Yılı" })}
          </option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 text-muted-text text-[10px]">
          ▼
        </span>
      </div>

      {/* Damage type */}
      <div className="relative">
        <label htmlFor="qq-damage" className="sr-only">
          {t("damage", { default: "Hasar Türü" })}
        </label>
        <select
          id="qq-damage"
          value={formData.damage}
          onChange={(e) => setFormData({ ...formData, damage: e.target.value })}
          className="w-full appearance-none bg-surface-container-lowest border border-[0.5px] border-border-default rounded-input px-16 py-12 pr-44 text-[14px] text-on-surface outline-none focus:border-primary transition-colors cursor-pointer"
        >
          <option value="" disabled>
            {t("damage", { default: "Hasar Türü" })}
          </option>
          {DAMAGE_TYPES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 text-muted-text text-[10px]">
          ▼
        </span>
      </div>

      {/* City */}
      <div>
        <label htmlFor="qq-city" className="sr-only">
          {t("city", { default: "İl / İlçe" })}
        </label>
        <input
          id="qq-city"
          type="text"
          placeholder={t("city", { default: "İl / İlçe" })}
          autoComplete="off"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="w-full bg-surface-container-lowest border border-[0.5px] border-border-default rounded-input px-16 py-12 text-[14px] text-on-surface placeholder:text-soft-text outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="qq-phone" className="sr-only">
          {t("phone", { default: "Telefon Numaranız" })}
        </label>
        <input
          id="qq-phone"
          type="tel"
          placeholder={t("phone", { default: "Telefon Numaranız" })}
          autoComplete="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full bg-surface-container-lowest border border-[0.5px] border-border-default rounded-input px-16 py-12 text-[14px] text-on-surface placeholder:text-soft-text outline-none focus:border-primary transition-colors"
        />
      </div>

      {errorMsg && (
        <div className="text-error text-[13px] font-medium">{errorMsg}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-8 bg-primary text-on-primary py-16 rounded-btn font-medium text-[14px] hover:opacity-90 transition-opacity mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden />
            {t("loading", { default: "İşleniyor..." })}
          </>
        ) : (
          <>
            {t("submit", { default: "Teklifimi Al" })}
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}

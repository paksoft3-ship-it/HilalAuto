"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { externalRoutes } from "@/lib/routes";
import { DAMAGE_TYPES, WHATSAPP_NUMBER } from "@/lib/constants";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => String(CURRENT_YEAR - i));

export function QuickQuoteForm() {
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
      setErrorMsg("Lütfen tüm alanları doldurun.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/quick-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Bir hata oluştu.");
      }

      // Success! Format WhatsApp message and redirect
      const message = `Merhaba, ${formData.brand} (${formData.year}) aracım için teklif almak istiyorum. Hasar: ${formData.damage}, Şehir: ${formData.city}. Telefonum: ${formData.phone}`;
      window.open(externalRoutes.whatsapp(WHATSAPP_NUMBER, message), "_blank");
      
      // Optionally clear form
      setFormData({ brand: "", year: "", damage: "", city: "", phone: "" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Bir hata oluştu.");
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
      aria-label="Hızlı teklif formu"
    >
      {/* Brand */}
      <div>
        <label htmlFor="qq-brand" className="sr-only">
          Araç Markası
        </label>
        <input
          id="qq-brand"
          type="text"
          placeholder="Araç Markası"
          autoComplete="off"
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          className="w-full bg-surface-container-lowest border border-[0.5px] border-border-default rounded-input px-16 py-12 text-[14px] text-on-surface placeholder:text-soft-text outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Year */}
      <div className="relative">
        <label htmlFor="qq-year" className="sr-only">
          Model Yılı
        </label>
        <select
          id="qq-year"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          className="w-full appearance-none bg-surface-container-lowest border border-[0.5px] border-border-default rounded-input px-16 py-12 pr-44 text-[14px] text-on-surface outline-none focus:border-primary transition-colors cursor-pointer"
        >
          <option value="" disabled>
            Model Yılı
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
          Hasar Türü
        </label>
        <select
          id="qq-damage"
          value={formData.damage}
          onChange={(e) => setFormData({ ...formData, damage: e.target.value })}
          className="w-full appearance-none bg-surface-container-lowest border border-[0.5px] border-border-default rounded-input px-16 py-12 pr-44 text-[14px] text-on-surface outline-none focus:border-primary transition-colors cursor-pointer"
        >
          <option value="" disabled>
            Hasar Türü
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
          İl / İlçe
        </label>
        <input
          id="qq-city"
          type="text"
          placeholder="İl / İlçe"
          autoComplete="off"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="w-full bg-surface-container-lowest border border-[0.5px] border-border-default rounded-input px-16 py-12 text-[14px] text-on-surface placeholder:text-soft-text outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="qq-phone" className="sr-only">
          Telefon Numaranız
        </label>
        <input
          id="qq-phone"
          type="tel"
          placeholder="Telefon Numaranız"
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
            İşleniyor...
          </>
        ) : (
          <>
            Teklifimi Al
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}

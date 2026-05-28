"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { routes } from "@/lib/routes";
import { DAMAGE_TYPES } from "@/lib/constants";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => String(CURRENT_YEAR - i));

export function QuickQuoteForm() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "tr";
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(routes.quote(locale));
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
          defaultValue=""
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
          defaultValue=""
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
          className="w-full bg-surface-container-lowest border border-[0.5px] border-border-default rounded-input px-16 py-12 text-[14px] text-on-surface placeholder:text-soft-text outline-none focus:border-primary transition-colors"
        />
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-8 bg-primary text-on-primary py-16 rounded-btn font-medium text-[14px] hover:opacity-90 transition-opacity mt-4"
      >
        Teklifimi Al
        <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
      </button>
    </form>
  );
}

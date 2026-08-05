"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { BellRing, Check } from "lucide-react";

type Props = {
  /** Current search filters, already normalised to the alert API's keys. */
  filters: Record<string, string>;
  /** Human-readable summary of the active filters, shown in the box. */
  summary: string;
};

/**
 * Turns a search into a standing demand channel: damaged-car buyers (repairers,
 * parts dealers) buy repeatedly, so an email alert brings them back without ad spend.
 */
export function SearchAlertBox({ filters, summary }: Props) {
  const t = useTranslations("searchAlert");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, filters, locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("error"));
      } else {
        setDone(true);
      }
    } catch {
      setError(t("error"));
    }
    setSending(false);
  }

  if (done) {
    return (
      <div className="flex items-center gap-10 bg-green-50 border border-[0.5px] border-green-200 rounded-card px-16 py-12 text-[13px] text-green-700">
        <Check size={16} className="shrink-0" />
        {t("success")}
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-8 bg-primary/5 border border-[0.5px] border-primary/25 hover:bg-primary/10 text-primary px-16 py-12 rounded-card text-[13px] font-medium transition-colors"
      >
        <BellRing size={15} /> {t("cta")}
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="bg-surface-container-lowest border border-[0.5px] border-border-default rounded-card p-16 flex flex-col gap-10"
    >
      <div className="flex items-start justify-between gap-8">
        <div>
          <p className="text-[13px] font-semibold text-on-surface flex items-center gap-6">
            <BellRing size={14} className="text-primary" /> {t("title")}
          </p>
          <p className="text-[11px] text-muted-text mt-2">{summary}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[12px] text-muted-text hover:text-on-surface shrink-0"
        >
          {t("cancel")}
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-8">
        <input
          type="email"
          required
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-12 py-10 bg-surface border border-[0.5px] border-border-default rounded-input text-[13px] text-on-surface outline-none focus:border-primary transition-colors"
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-primary text-white px-24 py-10 rounded-btn text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 whitespace-nowrap"
        >
          {sending ? t("sending") : t("submit")}
        </button>
      </div>
      {error && <p className="text-[12px] text-red-600">{error}</p>}
      <p className="text-[11px] text-muted-text">{t("hint")}</p>
    </form>
  );
}

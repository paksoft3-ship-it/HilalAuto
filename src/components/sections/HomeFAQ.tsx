"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function HomeFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  // Previously hardcoded Turkish, so the /en homepage rendered Turkish FAQs.
  const t = useTranslations("homeFaq");

  const FAQ_ITEMS = [1, 2, 3, 4].map((i) => ({
    q: t(`q${i}` as never),
    a: t(`a${i}` as never),
  }));

  // Matches the visible accordion exactly, as Google requires.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section
      className="py-60 bg-[#FAFAFA] border-t-[0.5px] border-[#EEEEEE]"
      aria-label={t("title")}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-[1240px] mx-auto px-16 md:px-24">
        <div className="text-center mb-44">
          <span className="text-[11px] font-medium text-primary uppercase tracking-wider">
            {t("badge")}
          </span>
          <h2 className="text-[32px] font-medium text-[#111111] tracking-[-1.5px] mt-8">
            {t("title")}
          </h2>
        </div>

        <div className="max-w-[800px] mx-auto flex flex-col gap-12">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="bg-white border-[0.5px] border-[#EEEEEE] rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full px-24 py-16 flex items-center justify-between text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[14px] font-medium text-[#111111]">{item.q}</span>
                  {isOpen
                    ? <X size={18} className="text-primary shrink-0" aria-hidden />
                    : <Plus size={18} className="text-primary shrink-0" aria-hidden />
                  }
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <p className="px-24 pb-16 text-[13px] text-[#888888] leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

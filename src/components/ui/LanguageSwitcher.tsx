"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const toggleLocale = () => {
    const nextLocale = locale === "tr" ? "en" : "tr";
    // @ts-expect-error - next-intl types can be tricky with dynamic params
    router.replace({ pathname, params }, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-6 px-12 py-8 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-btn text-[13px] font-medium text-on-surface hover:border-primary hover:text-primary transition-colors"
      aria-label="Toggle language"
    >
      <Globe size={14} />
      <span>{locale === "tr" ? "EN" : "TR"}</span>
    </button>
  );
}

"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useParams, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

export function LanguageSwitcher({ className, compact = false }: LanguageSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations("languageSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const toggleLocale = () => {
    const nextLocale = locale === "tr" ? "en" : "tr";
    const routeParams = Object.fromEntries(
      Object.entries(params).filter(([key]) => key !== "locale")
    );
    const query = Object.fromEntries(searchParams.entries());

    router.replace(
      {
        pathname,
        params: routeParams,
        query,
      } as never,
      { locale: nextLocale }
    );
  };

  const nextLanguage = locale === "tr" ? t("english") : t("turkish");

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className={cn(
        "flex items-center gap-4 text-[#888888] hover:text-[#111111] transition-colors",
        compact ? "px-8" : "px-12 py-8 bg-surface-container-lowest border border-[0.5px] border-border-default rounded-btn text-on-surface hover:border-primary hover:text-primary",
        className
      )}
      aria-label={t("switchTo", { language: nextLanguage })}
    >
      <Globe size={compact ? 15 : 14} aria-hidden />
      <span className={cn("font-medium uppercase", compact ? "text-[12px]" : "text-[13px]")}>
        {locale === "tr" ? "EN" : "TR"}
      </span>
    </button>
  );
}

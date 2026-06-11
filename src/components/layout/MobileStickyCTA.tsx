"use client";

import { Link } from "@/i18n/routing";
import { Phone, PlusCircle } from "lucide-react";
import { externalRoutes } from "@/lib/routes";
import { PHONE_NUMBER, WHATSAPP_NUMBER } from "@/lib/constants";
import { FaWhatsapp } from "react-icons/fa";
import { useTranslations } from "next-intl";

export function MobileStickyCTA() {
  const t = useTranslations("nav");

  return (
    <div
      className="fixed bottom-0 left-0 w-full z-[100] md:hidden bg-white border-t-[0.5px] border-[#EEEEEE] h-[60px] px-8"
      role="navigation"
      aria-label={t("quickActions")}
    >
      <div className="grid grid-cols-3 h-full items-center gap-8">
        {/* Call */}
        <a
          href={externalRoutes.phone(PHONE_NUMBER)}
          className="flex flex-col items-center justify-center gap-4 h-full text-[#111111]"
          aria-label={t("call")}
        >
          <Phone size={20} strokeWidth={1.5} aria-hidden />
          <span className="text-[11px] font-medium">{t("call")}</span>
        </a>

        {/* WhatsApp */}
        <a
          href={externalRoutes.whatsapp(WHATSAPP_NUMBER)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-4 h-full text-whatsapp-green"
          aria-label={t("whatsapp")}
        >
          <FaWhatsapp size={20} aria-hidden />
          <span className="text-[11px] font-medium">{t("whatsapp")}</span>
        </a>

        {/* İlan Ver */}
        <Link
          href={"/bayi-paneli/ilan-ekle" as never}
          className="flex flex-col items-center justify-center gap-4 bg-primary text-white h-[44px] rounded-lg mx-4"
          aria-label={t("postListing")}
        >
          <PlusCircle size={18} aria-hidden />
          <span className="text-[11px] font-medium">{t("postListing")}</span>
        </Link>
      </div>
    </div>
  );
}

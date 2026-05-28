"use client";

import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";
import { routes, externalRoutes } from "@/lib/routes";
import { PHONE_NUMBER, WHATSAPP_NUMBER } from "@/lib/constants";
import { FaWhatsapp } from 'react-icons/fa';

export function MobileStickyCTA() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "tr";

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[0.5px] border-border-default"
      role="navigation"
      aria-label="Hızlı işlem çubuğu"
    >
      <div className="grid grid-cols-3 gap-0">
        <a
          href={externalRoutes.phone(PHONE_NUMBER)}
          className="flex flex-col items-center justify-center gap-4 py-12 text-text-muted hover:text-accent hover:bg-bg-surface transition-colors border-r border-[0.5px] border-border-default"
          aria-label="Bizi arayın"
        >
          <Phone size={18} strokeWidth={1.5} aria-hidden />
          <span className="text-[11px] font-medium">Ara</span>
        </a>
        <a
          href={externalRoutes.whatsapp(WHATSAPP_NUMBER)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-4 py-12 text-whatsapp hover:bg-bg-surface transition-colors border-r border-[0.5px] border-border-default"
          aria-label="WhatsApp ile yazın"
        >
          <FaWhatsapp size={18} strokeWidth={1.5} aria-hidden />
          <span className="text-[11px] font-medium">WhatsApp</span>
        </a>
        <Link
          href={routes.quote(locale)}
          className="flex flex-col items-center justify-center gap-4 py-12 bg-accent text-white hover:opacity-90 transition-opacity"
          aria-label="Ücretsiz teklif alın"
        >
          <ArrowRight size={18} strokeWidth={1.5} aria-hidden />
          <span className="text-[11px] font-medium">Teklif Al</span>
        </Link>
      </div>
    </div>
  );
}

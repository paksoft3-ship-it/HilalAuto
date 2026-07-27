"use client";

import { useEffect } from "react";
import { trackPhoneClick, trackWhatsApp } from "@/lib/tracking";

/**
 * Global click listener that reports every tel: and WhatsApp anchor click to
 * the dataLayer, so phone/WhatsApp conversions can be tracked from GTM without
 * wiring every individual CTA. Covers server-component links too.
 */
export function ContactClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = e.target as HTMLElement | null;
      const anchor = el?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      const location = window.location.pathname;
      if (href.startsWith("tel:")) {
        trackPhoneClick(location);
      } else if (href.includes("wa.me") || href.includes("api.whatsapp.com")) {
        trackWhatsApp(location);
      }
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

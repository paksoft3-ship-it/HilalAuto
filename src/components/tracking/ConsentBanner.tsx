"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";

const STORAGE_KEY = "og_consent";

function updateConsent(granted: boolean) {
  if (typeof window === "undefined") return;
  const state = {
    ad_storage: granted ? "granted" : "denied",
    ad_user_data: granted ? "granted" : "denied",
    ad_personalization: granted ? "granted" : "denied",
    analytics_storage: granted ? "granted" : "denied",
  };
  const w = window as unknown as { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] };
  if (typeof w.gtag === "function") {
    // window.gtag is defined by ConsentScript before GTM loads
    w.gtag("consent", "update", state);
  } else {
    // Consent Mode requires an `arguments` object, not a plain array
    w.dataLayer = w.dataLayer ?? [];
    const push = function () {
      // eslint-disable-next-line prefer-rest-params
      (w.dataLayer as unknown[]).push(arguments);
    } as unknown as (...args: unknown[]) => void;
    push("consent", "update", state);
  }
}

export function ConsentBanner({ locale = "tr" }: { locale?: string }) {
  const [visible, setVisible] = useState(false);
  const en = locale === "en";

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // storage unavailable — keep banner hidden rather than nag every load
    }
  }, []);

  function choose(granted: boolean) {
    try {
      localStorage.setItem(STORAGE_KEY, granted ? "granted" : "denied");
    } catch {}
    updateConsent(granted);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[200] p-16 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-[720px] rounded-xl border border-[0.5px] border-border-default bg-surface-container-lowest shadow-lg p-20 flex flex-col sm:flex-row sm:items-center gap-16">
        <p className="flex-1 text-[13px] text-on-surface leading-relaxed">
          {en
            ? "We use cookies for analytics and advertising measurement. You can accept or reject non-essential cookies."
            : "Analiz ve reklam ölçümü için çerezler kullanıyoruz. Zorunlu olmayan çerezleri kabul edebilir veya reddedebilirsiniz."}{" "}
          <Link href={"/cerez-politikasi" as never} className="text-primary underline">
            {en ? "Cookie Policy" : "Çerez Politikası"}
          </Link>
        </p>
        <div className="flex gap-8 shrink-0">
          <button
            onClick={() => choose(false)}
            className="px-16 py-10 rounded-btn border border-[0.5px] border-border-default text-[13px] font-medium text-on-surface hover:bg-surface transition-colors"
          >
            {en ? "Reject" : "Reddet"}
          </button>
          <button
            onClick={() => choose(true)}
            className="px-16 py-10 rounded-btn bg-primary text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
          >
            {en ? "Accept" : "Kabul Et"}
          </button>
        </div>
      </div>
    </div>
  );
}

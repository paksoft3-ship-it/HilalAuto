"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const BUYER_STEPS = [
  {
    num: "01",
    title: "Grade Arama",
    desc: "Aradığınız hasar durumuna (Grade) göre binlerce ilan arasından filtreleme yapın.",
  },
  {
    num: "02",
    title: "İlan İncele",
    desc: "Onaylı bayiler tarafından sağlanan detaylı fotoğrafları ve hasar raporlarını inceleyin.",
  },
  {
    num: "03",
    title: "İletişim Kur",
    desc: "Bayi ile doğrudan iletişime geçin, pazarlığınızı yapın ve aracınızı güvenle satın alın.",
  },
];

const DEALER_STEPS = [
  {
    num: "01",
    title: "Hesap Oluştur",
    desc: "Bayi başvurusu yapın, belgelerinizi yükleyin, 24 saat içinde onay alın.",
  },
  {
    num: "02",
    title: "İlan Oluştur",
    desc: "Aracı grade'leyin, fotoğraf yükleyin, fiyat belirleyin ve ilanı yayınlayın.",
  },
  {
    num: "03",
    title: "Müşteri Bul",
    desc: "Binlerce potansiyel alıcıya ulaşın, mesajları yönetin, satışı tamamlayın.",
  },
];

export function HowItWorksTabs() {
  const [tab, setTab] = useState<"buyer" | "dealer">("buyer");
  const steps = tab === "buyer" ? BUYER_STEPS : DEALER_STEPS;

  return (
    <>
      {/* Tab toggle */}
      <div className="mt-32 flex border-[0.5px] border-[#EEEEEE] rounded-lg p-4 bg-[#F3F3F3] w-fit mx-auto">
        <button
          onClick={() => setTab("buyer")}
          className={cn(
            "px-24 py-8 rounded-md text-[13px] font-medium transition-colors",
            tab === "buyer"
              ? "bg-white text-[#111111] border-[0.5px] border-[#EEEEEE] shadow-sm"
              : "text-[#888888] hover:text-[#111111]"
          )}
          aria-pressed={tab === "buyer"}
        >
          Alıcılar İçin
        </button>
        <button
          onClick={() => setTab("dealer")}
          className={cn(
            "px-24 py-8 rounded-md text-[13px] font-medium transition-colors",
            tab === "dealer"
              ? "bg-white text-[#111111] border-[0.5px] border-[#EEEEEE] shadow-sm"
              : "text-[#888888] hover:text-[#111111]"
          )}
          aria-pressed={tab === "dealer"}
        >
          Bayiler İçin
        </button>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mt-44">
        {steps.map(({ num, title, desc }) => (
          <div
            key={num}
            className="bg-white border-[0.5px] border-[#EEEEEE] rounded-xl p-24"
          >
            <span className="inline-block px-12 py-4 bg-[#FFF2EF] text-primary rounded-full text-[12px] font-medium mb-16">
              {num}
            </span>
            <h3 className="text-[16px] font-medium text-[#111111] mb-8">{title}</h3>
            <p className="text-[13px] text-[#888888] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function HowItWorksTabs() {
  const t = useTranslations("marketplaceHome");
  const [tab, setTab] = useState<"buyer" | "dealer">("buyer");
  const buyerSteps = [
    { num: "01", title: t("buyerStep1Title"), desc: t("buyerStep1Desc") },
    { num: "02", title: t("buyerStep2Title"), desc: t("buyerStep2Desc") },
    { num: "03", title: t("buyerStep3Title"), desc: t("buyerStep3Desc") },
  ];
  const dealerSteps = [
    { num: "01", title: t("dealerStep1Title"), desc: t("dealerStep1Desc") },
    { num: "02", title: t("dealerStep2Title"), desc: t("dealerStep2Desc") },
    { num: "03", title: t("dealerStep3Title"), desc: t("dealerStep3Desc") },
  ];
  const steps = tab === "buyer" ? buyerSteps : dealerSteps;

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
          {t("buyerTab")}
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
          {t("dealerTab")}
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

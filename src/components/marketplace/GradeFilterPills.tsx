"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { GRADE_COLORS } from "@/lib/grades";
import type { DamageGrade } from "@/types/marketplace";

const GRADES: DamageGrade[] = ["A", "B", "C", "D", "E"];

export function GradeFilterPills() {
  const router = useRouter();
  const t = useTranslations("marketplaceHome");
  const [active, setActive] = useState<DamageGrade | null>(null);

  function handleClick(grade: DamageGrade) {
    const next = active === grade ? null : grade;
    setActive(next);
    if (next) {
      router.push((`/ara?grade=${next}`) as never);
    } else {
      router.push("/ara" as never);
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-12 mt-24">
      <span className="text-[12px] font-medium text-[#888888]">{t("gradeFilter")}</span>
      {GRADES.map((grade) => {
        const color = GRADE_COLORS[grade];
        const isActive = active === grade;
        return (
          <button
            key={grade}
            onClick={() => handleClick(grade)}
            className="px-12 py-4 rounded-full border-[0.5px] text-[11px] font-medium transition-colors"
            style={{
              borderColor: color,
              backgroundColor: isActive ? color : "transparent",
              color: isActive ? "#ffffff" : color,
            }}
            aria-pressed={isActive}
            aria-label={t("gradeFilterAria", { grade })}
          >
            {t("gradeButton", { grade })}
          </button>
        );
      })}
    </div>
  );
}

import { DamageGrade, GRADE_COLORS, GRADE_DESCRIPTIONS } from "@/types/marketplace";
import { cn } from "@/lib/utils";

interface GradeBadgeProps {
  grade: DamageGrade | null | undefined;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-[24px] h-[24px] text-[11px]",
  md: "w-[32px] h-[32px] text-[13px]",
  lg: "w-[48px] h-[48px] text-[18px]",
};

export function GradeBadge({ grade, size = "md", showTooltip = false, className }: GradeBadgeProps) {
  if (!grade) return null;

  const color = GRADE_COLORS[grade];

  return (
    <div className={cn("relative group inline-block", className)}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-bold text-white shrink-0",
          sizeClasses[size]
        )}
        style={{ backgroundColor: color.bg }}
        title={showTooltip ? undefined : color.label}
        aria-label={`Otograde Derecesi: ${color.label}`}
      >
        {grade}
      </div>

      {showTooltip && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-8 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <div className="bg-[#0D0D0D] text-white text-[11px] px-10 py-6 rounded-md whitespace-nowrap shadow-lg">
            <div className="font-semibold mb-2">{color.label}</div>
            <div className="text-[#AAAAAA]">{GRADE_DESCRIPTIONS[grade]}</div>
          </div>
          <div className="w-0 h-0 mx-auto border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#0D0D0D]" />
        </div>
      )}
    </div>
  );
}

// Grade legend bar for listing detail pages
export function GradeBar({ activeGrade }: { activeGrade: DamageGrade | null | undefined }) {
  const grades: DamageGrade[] = ["A", "B", "C", "D", "E"];

  return (
    <div className="flex items-center gap-4">
      {grades.map((g) => {
        const color = GRADE_COLORS[g];
        const isActive = g === activeGrade;
        return (
          <div key={g} className="flex flex-col items-center gap-4">
            <div
              className={cn(
                "w-[28px] h-[28px] rounded-full flex items-center justify-center text-[11px] font-bold text-white transition-transform",
                isActive ? "scale-125 ring-2 ring-offset-2" : "opacity-40"
              )}
              style={{
                backgroundColor: color.bg,
                outlineColor: isActive ? color.bg : undefined,
              }}
            >
              {g}
            </div>
          </div>
        );
      })}
    </div>
  );
}

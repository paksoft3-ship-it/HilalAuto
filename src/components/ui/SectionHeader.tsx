import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: "left" | "center";
  className?: string;
  dark?: boolean;
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  align = "left",
  className,
  dark = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-16",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {badge && (
        <Badge variant={dark ? "muted" : "accent"}>{badge}</Badge>
      )}
      <h2
        className={cn(
          "text-section-title-mobile md:text-section-title font-medium tracking-heading",
          dark ? "text-white" : "text-text-primary"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "text-[14px] leading-relaxed max-w-[560px]",
            dark ? "text-[#AAAAAA]" : "text-text-muted"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

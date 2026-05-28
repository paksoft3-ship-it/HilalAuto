import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "accent" | "muted" | "success";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-bg-surface text-text-primary border border-[0.5px] border-border-default",
  accent:
    "bg-accent-light text-accent border border-[0.5px] border-accent-border",
  muted:
    "bg-bg-surface text-text-muted border border-[0.5px] border-border-default",
  success:
    "bg-green-50 text-green-700 border border-[0.5px] border-green-200",
};

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-4 px-12 py-4 rounded-pill text-[11px] font-medium uppercase tracking-wider",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

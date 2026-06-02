import { cn } from "@/lib/utils";

interface DamageBadgeProps {
  type: string;
  className?: string;
}

// Map damage type keywords to colour tokens
function getColor(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("total") || t.includes("pert")) return "bg-red-100 text-red-700 border-red-200";
  if (t.includes("yanık") || t.includes("yanmış") || t.includes("yangın")) return "bg-orange-100 text-orange-700 border-orange-200";
  if (t.includes("sel") || t.includes("su")) return "bg-blue-100 text-blue-700 border-blue-200";
  if (t.includes("ön hasar")) return "bg-yellow-100 text-yellow-700 border-yellow-200";
  if (t.includes("arka hasar")) return "bg-yellow-100 text-yellow-700 border-yellow-200";
  if (t.includes("yan hasar")) return "bg-yellow-100 text-yellow-700 border-yellow-200";
  if (t.includes("çekme")) return "bg-purple-100 text-purple-700 border-purple-200";
  if (t.includes("hurda")) return "bg-gray-100 text-gray-600 border-gray-200";
  return "bg-surface border-border-default text-muted-text";
}

export function DamageBadge({ type, className }: DamageBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-8 py-3 rounded-full text-[11px] font-medium border border-[0.5px]",
        getColor(type),
        className
      )}
    >
      {type}
    </span>
  );
}

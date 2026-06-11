import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { findDamageFilterOption } from "@/lib/listing-filters";

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

function normalize(value: string): string {
  return value
    .toLocaleLowerCase("tr")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

function damageKey(type: string): string | null {
  const option = findDamageFilterOption(type);
  if (option) return option.slug;

  const normalized = normalize(type);
  if (normalized.includes("on ") || normalized.includes("onden") || normalized.includes("front")) return "front";
  if (normalized.includes("arka") || normalized.includes("rear")) return "rear";
  if (normalized.includes("yan ") || normalized.includes("yandan") || normalized.includes("side")) return "side";
  if (normalized.includes("tramer")) return "tramer";
  return null;
}

export function DamageBadge({ type, className }: DamageBadgeProps) {
  const t = useTranslations("damageTypeLabels");
  const key = damageKey(type);

  return (
    <span
      className={cn(
        "inline-flex items-center px-8 py-3 rounded-full text-[11px] font-medium border border-[0.5px]",
        getColor(type),
        className
      )}
    >
      {key ? t(key) : type}
    </span>
  );
}

// Shared utilities for the dealer portal

const TR_MAP: Record<string, string> = {
  ı: "i", ğ: "g", ü: "u", ş: "s", ö: "o", ç: "c",
  İ: "i", Ğ: "g", Ü: "u", Ş: "s", Ö: "o", Ç: "c",
};

function toSlug(str: string): string {
  return str
    .split("")
    .map((c) => TR_MAP[c] ?? c)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateListingSlug(year: number, brand: string, model: string): string {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${year}-${toSlug(brand)}-${toSlug(model)}-${suffix}`;
}

export function generateDealerSlug(companyName: string, city: string): string {
  const base = `${toSlug(companyName)}-${toSlug(city)}`;
  const suffix = Math.random().toString(36).slice(2, 5);
  return `${base}-${suffix}`;
}

export function autoTitle(
  year: number,
  brand: string,
  model: string,
  damageTypes: string[]
): string {
  const damage = damageTypes.slice(0, 2).join(", ");
  return `${year} ${brand} ${model}${damage ? ` — ${damage}` : ""}`;
}

export function formatPrice(n: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(n);
}

export function daysBetween(a: string, b: string = new Date().toISOString()): number {
  return Math.max(0, Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

export function getPlanLimit(plan: string | null): number {
  if (plan === "professional") return 15;
  if (plan === "premium") return -1; // unlimited
  return 5; // basic / default
}

export function canAddListing(
  activePlan: string | null,
  currentCount: number,
  subscriptionStatus: string
): { allowed: boolean; reason: string } {
  if (subscriptionStatus !== "active") {
    return { allowed: false, reason: "Aboneliğiniz aktif değil." };
  }
  const limit = getPlanLimit(activePlan);
  if (limit !== -1 && currentCount >= limit) {
    return { allowed: false, reason: `Planınız en fazla ${limit} ilan eklemenize izin veriyor.` };
  }
  return { allowed: true, reason: "" };
}

export const CURRENT_YEAR = new Date().getFullYear();
export const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => CURRENT_YEAR - i);

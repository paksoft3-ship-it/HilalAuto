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

// Free-launch mode: paid plans are disabled, so there are no listing limits
// and no subscription checks. Restore the plan-based logic from git history
// when pricing is reintroduced.
export function getPlanLimit(): number {
  return -1; // unlimited
}

export function canAddListing(): { allowed: boolean; reason: string } {
  return { allowed: true, reason: "" };
}

export const CURRENT_YEAR = new Date().getFullYear();
export const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => CURRENT_YEAR - i);

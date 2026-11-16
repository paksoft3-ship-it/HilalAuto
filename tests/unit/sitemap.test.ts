import { beforeEach, describe, expect, it, vi } from "vitest";

// A thenable query builder: .select().in().eq().not() all return the builder, awaiting it yields { data }.
function builder(rows: unknown[]) {
  const b: Record<string, unknown> = {};
  for (const m of ["select", "in", "eq", "not", "order"]) b[m] = () => b;
  b.then = (resolve: (v: unknown) => unknown) => resolve({ data: rows, error: null });
  return b;
}

const tables: Record<string, unknown[]> = {};
vi.mock("@/lib/supabase", () => ({ supabase: { from: (t: string) => builder(tables[t] ?? []) } }));
vi.mock("@/lib/indexable-facets", () => ({
  getIndexableDamageFacets: async () => [{ slug: "kazali" }],
  getIndexableCityFacets: async () => [{ slug: "istanbul" }],
}));

const load = async () => (await import("@/app/sitemap")).default();

describe("sitemap", () => {
  beforeEach(() => {
    tables.hazaral_listings = [
      { slug: "2017-toyota-rav4-abc123", created_at: "2026-11-15T10:00:00Z", updated_at: "2026-11-15T12:00:00Z" },
    ];
    tables.hazaral_blogs = [{ slug: "hurda-rehberi", locale: "tr", created_at: "2026-10-01T00:00:00Z" }];
    tables.hazaral_dealers = [{ slug: "otograde", updated_at: "2026-11-01T00:00:00Z" }];
  });

  it("emits the Turkish marketplace at /ilanlar and English at /en/listings — never the old /ara", async () => {
    const urls = (await load()).map((e) => e.url);
    expect(urls).toContain("https://otograde.com/ilanlar");
    expect(urls).toContain("https://otograde.com/en/listings");
    expect(urls.filter((u) => /otograde\.com(\/en)?\/ara(\/|\?|$)/.test(u))).toEqual([]);
  });

  it("lists each active listing once per locale with the real updated_at", async () => {
    const entries = await load();
    const tr = entries.find((e) => e.url === "https://otograde.com/ilanlar/2017-toyota-rav4-abc123");
    const en = entries.find((e) => e.url === "https://otograde.com/en/listings/2017-toyota-rav4-abc123");
    expect(tr).toBeTruthy();
    expect(en).toBeTruthy();
    expect(new Date(tr!.lastModified as Date).toISOString()).toBe("2026-11-15T12:00:00.000Z");
  });

  it("emits facet and city URLs in /ilanlar form", async () => {
    const urls = (await load()).map((e) => e.url);
    expect(urls).toContain("https://otograde.com/ilanlar?damage_type=kazali");
    expect(urls).toContain("https://otograde.com/en/listings?damage_type=kazali");
    expect(urls).toContain("https://otograde.com/sehir/istanbul");
    expect(urls).toContain("https://otograde.com/en/cities/istanbul");
  });

  it("has no duplicate URLs", async () => {
    const urls = (await load()).map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("every localised pair carries tr / en / x-default alternates that point at each other", async () => {
    const entries = await load();
    const home = entries.find((e) => e.url === "https://otograde.com/ilanlar")!;
    expect(home.alternates?.languages).toMatchObject({
      tr: "https://otograde.com/ilanlar",
      en: "https://otograde.com/en/listings",
      "x-default": "https://otograde.com/ilanlar",
    });
  });

  it("only lists absolute https URLs on the canonical host", async () => {
    for (const e of await load()) expect(e.url).toMatch(/^https:\/\/otograde\.com(\/|$)/);
  });

  it("is regenerated periodically (not frozen at build time)", async () => {
    const mod = await import("@/app/sitemap");
    expect((mod as { revalidate?: number }).revalidate).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from "vitest";
import { autoTitle, daysBetween, formatPrice, generateDealerSlug, generateListingSlug } from "@/lib/dealer-utils";

describe("generateListingSlug", () => {
  it("is year-brand-model-suffix and URL safe", () => {
    const slug = generateListingSlug(2017, "Mercedes-Benz", "A 180 AMG");
    expect(slug).toMatch(/^2017-mercedes-benz-a-180-amg-[a-z0-9]{1,6}$/);
  });

  it("transliterates Turkish characters (capital İ included)", () => {
    const slug = generateListingSlug(2012, "Şişli İş", "Çekme Öz");
    expect(slug).toMatch(/^2012-sisli-is-cekme-oz-[a-z0-9]+$/);
  });

  it("produces distinct slugs for the same car (collision resistance)", () => {
    const slugs = new Set(Array.from({ length: 500 }, () => generateListingSlug(2020, "Audi", "A3")));
    expect(slugs.size).toBeGreaterThan(495);
  });
});

describe("generateDealerSlug", () => {
  it("combines company and city", () => {
    expect(generateDealerSlug("Oto Gökhan Ltd.", "İzmir")).toMatch(/^oto-gokhan-ltd-izmir-[a-z0-9]+$/);
  });
});

describe("autoTitle", () => {
  it("uses at most two damage types", () => {
    expect(autoTitle(2012, "Audi", "A7", ["Motor Arızalı", "Ağır Hasarlı", "Pert"])).toBe(
      "2012 Audi A7 — Motor Arızalı, Ağır Hasarlı",
    );
  });
  it("omits the dash when there is no damage type", () => {
    expect(autoTitle(2012, "Audi", "A7", [])).toBe("2012 Audi A7");
  });
});

describe("formatPrice", () => {
  it("formats lira without decimals", () => {
    const out = formatPrice(1165000);
    expect(out).toContain("1.165.000");
    expect(out).toMatch(/₺|TRY/);
    expect(out).not.toContain(",");
  });
});

describe("daysBetween", () => {
  it("counts whole days and never goes negative", () => {
    expect(daysBetween("2026-11-01T00:00:00Z", "2026-11-15T12:00:00Z")).toBe(14);
    expect(daysBetween("2026-11-15T00:00:00Z", "2026-11-01T00:00:00Z")).toBe(0);
  });
});

import { describe, expect, it } from "vitest";
import {
  DAMAGE_FILTER_OPTIONS,
  findDamageFilterOption,
  getDamageMatchValues,
  parseDamageFilters,
} from "@/lib/listing-filters";

describe("findDamageFilterOption", () => {
  it("resolves by slug, label and case/diacritic-insensitive label", () => {
    expect(findDamageFilterOption("kazali")?.slug).toBe("kazali");
    expect(findDamageFilterOption("Kazalı")?.slug).toBe("kazali");
    expect(findDamageFilterOption("KAZALI")?.slug).toBe("kazali");
    expect(findDamageFilterOption("pert")?.slug).toBe("pert");
  });
  it("returns undefined for empty or unknown values", () => {
    expect(findDamageFilterOption("")).toBeUndefined();
    expect(findDamageFilterOption("   ")).toBeUndefined();
    expect(findDamageFilterOption("uzay-gemisi")).toBeUndefined();
  });
  it("every option is reachable by its own slug and has match values", () => {
    for (const o of DAMAGE_FILTER_OPTIONS) {
      expect(findDamageFilterOption(o.slug)?.slug).toBe(o.slug);
      expect(o.matchValues.length).toBeGreaterThan(0);
    }
  });
  it("option slugs are unique", () => {
    const slugs = DAMAGE_FILTER_OPTIONS.map((o) => o.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("parseDamageFilters", () => {
  it("parses a comma list, dedupes and skips blanks", () => {
    const f = parseDamageFilters("kazali, pert,, kazali ,");
    expect(f.map((x) => x.slug)).toEqual(["kazali", "pert"]);
  });
  it("keeps unknown values as free-text filters instead of dropping them", () => {
    const [f] = parseDamageFilters("Dolu Hasarlı");
    expect(f.label).toBe("Dolu Hasarlı");
    expect(f.matchValues).toEqual(["Dolu Hasarlı"]);
  });
  it("returns [] for empty input", () => {
    expect(parseDamageFilters("")).toEqual([]);
  });
});

describe("getDamageMatchValues", () => {
  it("unions match values without duplicates", () => {
    const v = getDamageMatchValues("kazali,kazali");
    expect(new Set(v).size).toBe(v.length);
    expect(v.length).toBeGreaterThan(0);
  });
});

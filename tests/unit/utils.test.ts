import { describe, expect, it } from "vitest";
import { cn, formatPhone, getAbsoluteUrl, slugify } from "@/lib/utils";

describe("slugify", () => {
  it("transliterates lowercase Turkish letters", () => {
    expect(slugify("çalışır yürür")).toBe("calisir-yurur");
    expect(slugify("şoför ağır hasarlı")).toBe("sofor-agir-hasarli");
  });

  it("handles the Turkish capital dotted İ (slugs are built from city/brand names)", () => {
    expect(slugify("İstanbul")).toBe("istanbul");
    expect(slugify("İzmir")).toBe("izmir");
    expect(slugify("DİYARBAKIR")).toBe("diyarbakir");
  });

  it("collapses separators and trims dashes", () => {
    expect(slugify("  Audi   A6 -- 3.0  ")).toBe("audi-a6-3-0");
    expect(slugify("---x---")).toBe("x");
  });

  it("returns an empty string for input with no usable characters", () => {
    expect(slugify("???")).toBe("");
  });
});

describe("formatPhone", () => {
  it("keeps digits only", () => {
    expect(formatPhone("+90 (552) 567-71 64")).toBe("905525677164");
  });
});

describe("getAbsoluteUrl", () => {
  it("prefixes the site URL and tolerates a missing slash", () => {
    expect(getAbsoluteUrl("/ilanlar")).toBe("https://otograde.com/ilanlar");
    expect(getAbsoluteUrl("ilanlar")).toBe("https://otograde.com/ilanlar");
  });
});

describe("cn", () => {
  it("drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });
});

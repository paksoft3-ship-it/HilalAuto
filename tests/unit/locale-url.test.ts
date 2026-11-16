import { describe, expect, it } from "vitest";
import { localeUrl } from "@/lib/locale-url";

describe("localeUrl (localePrefix: as-needed)", () => {
  it("Turkish has no prefix", () => {
    expect(localeUrl("tr", "/ilanlar")).toBe("https://otograde.com/ilanlar");
    expect(localeUrl("tr", "/")).toBe("https://otograde.com");
  });
  it("English is prefixed, and the root has no trailing slash", () => {
    expect(localeUrl("en", "/listings")).toBe("https://otograde.com/en/listings");
    expect(localeUrl("en", "/")).toBe("https://otograde.com/en");
  });
  it("adds a missing leading slash", () => {
    expect(localeUrl("tr", "blog")).toBe("https://otograde.com/blog");
  });
});

import { expect, test, type Page } from "@playwright/test";
import { assertNotProduction } from "./_guard";

// These drive the real controls (client-side router.push / router.replace) rather than
// page.goto(), because that is where a string "/ara?x=y" used to leak past the /ilanlar rename.
test.beforeAll(({}, info) => assertNotProduction(info.project.use.baseURL));

const noOldPath = (url: string) => expect(new URL(url).pathname, `landed on the old path: ${url}`).not.toMatch(/\/ara(\/|$)/);

// Records every top-level navigation request so a hop through /ara or /en/ara is caught
// even if the URL ends up right.
function trackDocumentRequests(page: Page) {
  const seen: string[] = [];
  page.on("request", (r) => { if (r.isNavigationRequest()) seen.push(r.url()); });
  return seen;
}

test.describe("homepage hero", () => {
  test("grade pill goes to /ilanlar?grade=A (TR)", async ({ page }) => {
    const nav = trackDocumentRequests(page);
    await page.goto("/");
    await page.getByRole("button", { name: "Grade A filtresi" }).click();
    await page.waitForURL(/\/ilanlar\?grade=A/);
    noOldPath(page.url());
    expect(nav.filter((u) => /\/ara(\?|\/|$)/.test(new URL(u).pathname + new URL(u).search))).toEqual([]);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("grade pill goes to /en/listings?grade=A (EN)", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "Grade A filter" }).click();
    await page.waitForURL(/\/en\/listings\?grade=A/);
    noOldPath(page.url());
  });

  test("search bar submit carries brand, city and price to /ilanlar (TR)", async ({ page }) => {
    const nav = trackDocumentRequests(page);
    await page.goto("/");
    await page.getByLabel("Araç markası veya modeli").fill("Audi");
    await page.getByLabel("Şehir", { exact: false }).first().fill("İstanbul");
    await page.getByRole("button", { name: "Araç ara" }).click();
    await page.waitForURL(/\/ilanlar\?/);
    const q = new URL(page.url()).searchParams;
    expect(q.get("brand")).toBe("Audi");
    expect(q.get("city")).toBe("İstanbul");
    noOldPath(page.url());
    expect(nav.some((u) => new URL(u).pathname === "/ara")).toBe(false);
  });

  test("search bar submit goes to /en/listings (EN)", async ({ page }) => {
    await page.goto("/en");
    await page.getByLabel("Vehicle make or model").fill("BMW");
    await page.getByRole("button", { name: "Search vehicles" }).click();
    await page.waitForURL(/\/en\/listings\?brand=BMW/);
    noOldPath(page.url());
  });

  test("category cards on the homepage link straight to /ilanlar facets", async ({ page }) => {
    await page.goto("/");
    const href = await page.locator("a[href*='damage_type=pert']").first().getAttribute("href");
    expect(href).toBe("/ilanlar?damage_type=pert");
  });
});

test.describe("/ilanlar filters (client-side router.replace)", () => {
  test("ticking a damage-type filter updates the URL on /ilanlar, never via /ara", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "filters sit in a drawer on phones");
    const nav = trackDocumentRequests(page);
    await page.goto("/ilanlar");
    const box = page.getByRole("checkbox", { name: /Kazalı/ }).first();
    // The checkbox is controlled by the URL (updated after a server round trip), so click and wait on the URL
    // instead of check(), which expects the state to flip immediately.
    await box.click();
    await page.waitForURL(/\/ilanlar\?.*damage_type=kazali/);
    noOldPath(page.url());
    expect(nav.some((u) => new URL(u).pathname === "/ara")).toBe(false);

    await expect(box).toBeChecked();
    await box.click();
    await page.waitForURL((u) => !u.search.includes("damage_type"));
    expect(new URL(page.url()).pathname).toBe("/ilanlar");
  });

  test("the same filter on /en/listings stays on /en/listings", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "filters sit in a drawer on phones");
    await page.goto("/en/listings");
    await page.getByRole("checkbox", { name: /Accident/i }).first().click();
    await page.waitForURL(/\/en\/listings\?.*damage_type=/);
    noOldPath(page.url());
  });

  test("filtered URLs can be reloaded and shared", async ({ page }) => {
    await page.goto("/ilanlar?damage_type=pert&grade=C");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.reload();
    expect(new URL(page.url()).search).toContain("damage_type=pert");
  });
});

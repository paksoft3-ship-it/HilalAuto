import { expect, test } from "@playwright/test";
import { assertNotProduction } from "./_guard";

test.beforeAll(({}, info) => assertNotProduction(info.project.use.baseURL));

test("marketplace lists cards, filters by damage type and opens a detail page", async ({ page }) => {
  await page.goto("/ilanlar");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const card = page.locator("a[href*='/ilanlar/']").filter({ hasText: /₺/ }).first();
  test.skip((await card.count()) === 0, "no active listing in this environment");

  await page.goto("/ilanlar?damage_type=kazali");
  await expect(page).toHaveURL(/damage_type=kazali/);

  await page.goto("/ilanlar");
  await page.locator("a[href*='/ilanlar/']").filter({ hasText: /₺/ }).first().click();
  await expect(page).toHaveURL(/\/ilanlar\/[a-z0-9-]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  // The detail page also renders favorite buttons on the "similar listings" cards.
  await expect(page.getByRole("button", { name: /Favorilere ekle|Favorilerden kaldır/i }).first()).toBeVisible();
});

// On phones the switcher lives inside the hamburger menu.
async function openMenuIfCollapsed(page: import("@playwright/test").Page) {
  const toggle = page.getByRole("button", { name: /Menüyü aç|Open menu/i });
  if (await toggle.isVisible()) await toggle.click();
}

test("language switcher keeps the page and the query string (TR -> EN -> TR)", async ({ page }) => {
  await page.goto("/ilanlar?damage_type=kazali");
  await openMenuIfCollapsed(page);
  await page.getByRole("button", { name: /İngilizce diline geç/i }).filter({ visible: true }).first().click();
  await expect(page).toHaveURL(/\/en\/listings\?damage_type=kazali/);
  await openMenuIfCollapsed(page);
  await page.getByRole("button", { name: /Switch to Turkish/i }).filter({ visible: true }).first().click();
  await expect(page).toHaveURL(/\/ilanlar\?damage_type=kazali/);
});

test("homepage category and 'view all' links land on /ilanlar without a redirect hop", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page.locator("a[href*='damage_type=']").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  expect(hrefs.length).toBeGreaterThan(0);
  for (const h of hrefs) expect(h, "facet link").toMatch(/^\/ilanlar\?damage_type=/);
});

test("English pages link to English URLs only (no Turkish slugs under /en)", async ({ page }) => {
  await page.goto("/en");
  const hrefs = await page.locator("a[href^='/en']").evaluateAll((as) => as.map((a) => a.getAttribute("href") as string));
  expect(hrefs.length).toBeGreaterThan(10);
  for (const h of hrefs) expect(h, "EN link").not.toMatch(/^\/en\/(sehir|ara|teklif-al|hizmet)(\/|\?|$)/);
});

test("mobile: no horizontal scroll on key pages", async ({ page }) => {
  for (const p of ["/", "/ilanlar", "/blog", "/teklif-al"]) {
    await page.goto(p);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${p} overflows horizontally by ${overflow}px`).toBeLessThanOrEqual(1);
  }
});

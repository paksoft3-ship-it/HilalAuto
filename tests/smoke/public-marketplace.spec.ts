import { expect, test } from "@playwright/test";

test("marketplace and favorites pages render", async ({ page }) => {
  await page.goto("/tr/ara");
  await expect(page.getByRole("heading", { name: /Hasarlı Araç İlanları/i })).toBeVisible();
  await expect(page.getByText(/Kazalı, pert, hasarlı ve hurda araçlar/i)).toBeVisible();

  await page.goto("/tr/favoriler");
  await expect(page.getByRole("heading", { name: /Kaydedilen İlanlar/i })).toBeVisible();
});

test("listing detail renders if at least one active listing exists", async ({ page }) => {
  await page.goto("/tr/ara");
  const firstListing = page.locator("a[href*='/ara/']").filter({ hasText: /TL/ }).first();

  if (await firstListing.count() === 0) {
    test.skip(true, "No active listing is available in this environment.");
  }

  await firstListing.click();
  await expect(page.getByRole("heading").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Favorilere ekle|Favorilerden kaldır/i })).toBeVisible();
});

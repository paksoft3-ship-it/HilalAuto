import { expect, test } from "@playwright/test";

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const dealerEmail = process.env.E2E_DEALER_EMAIL;
const dealerPassword = process.env.E2E_DEALER_PASSWORD;

test.describe("admin smoke", () => {
  test.skip(!adminEmail || !adminPassword, "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run admin smoke tests.");

  test("admin can log in and open critical pages", async ({ page }) => {
    await page.goto("/tr/admin/login");
    await page.getByPlaceholder("E-posta adresi").fill(adminEmail!);
    await page.getByPlaceholder("Şifre").fill(adminPassword!);
    await page.getByRole("button", { name: /Giriş Yap/i }).click();

    await expect(page.getByRole("heading", { name: /Dashboard/i })).toBeVisible();

    for (const path of ["/tr/admin/bayiler", "/tr/admin/ilanlar", "/tr/admin/abonelikler", "/tr/admin/audit-loglari"]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
    }
  });
});

test.describe("dealer smoke", () => {
  test.skip(!dealerEmail || !dealerPassword, "Set E2E_DEALER_EMAIL and E2E_DEALER_PASSWORD to run dealer smoke tests.");

  test("dealer can log in and reach listing/subscription flows", async ({ page }) => {
    await page.goto("/tr/bayi-paneli/giris");
    await page.getByPlaceholder("E-posta").fill(dealerEmail!);
    await page.getByPlaceholder("Şifre").fill(dealerPassword!);
    await page.getByRole("button", { name: /Giriş Yap/i }).click();

    await expect(page.getByRole("heading", { name: /Dashboard|Başvurunuz|Hesabınız/i })).toBeVisible();

    await page.goto("/tr/bayi-paneli/ilan-ekle");
    await expect(page.getByRole("heading", { name: /Yeni İlan Ekle/i })).toBeVisible();
    await expect(page.getByText(/Araç Bilgileri/i).first()).toBeVisible();

    await page.goto("/tr/bayi-paneli/abonelik");
    await expect(page.getByRole("heading", { name: /Abonelik/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Planı Seç|Planı Yenile/i }).first()).toBeVisible();
  });
});

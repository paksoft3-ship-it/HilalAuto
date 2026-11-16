import { expect, test } from "@playwright/test";
import { assertNotProduction } from "./_guard";

test.beforeAll(({}, info) => assertNotProduction(info.project.use.baseURL));

async function firstListingPath(request: import("@playwright/test").APIRequestContext) {
  const html = await (await request.get("/ilanlar")).text();
  const m = html.match(/href="(\/ilanlar\/[a-z0-9-]+)"/);
  return m?.[1] ?? null;
}

test.describe("URL migration /ara -> /ilanlar", () => {
  test("old URLs 308 to the new path in a single hop and keep the query string", async ({ request }) => {
    const cases: [string, string][] = [
      ["/ara", "/ilanlar"],
      ["/ara/some-slug", "/ilanlar/some-slug"],
      ["/ara?damage_type=kazali", "/ilanlar?damage_type=kazali"],
      ["/ara?grade=A&sort=newest", "/ilanlar?grade=A&sort=newest"],
      ["/tr/ara", "/ilanlar"],
      ["/satilik-araclar", "/ilanlar"],
      ["/hizmet/pert-arac-alimi", "/ilanlar?damage_type=pert"],
    ];
    for (const [from, to] of cases) {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status(), from).toBe(308);
      expect(new URL(res.headers()["location"], "http://x").pathname + new URL(res.headers()["location"], "http://x").search, from).toBe(to);
    }
  });

  test("the new URLs respond 200 and the English site is unchanged", async ({ request }) => {
    for (const p of ["/ilanlar", "/ilanlar?damage_type=pert", "/en/listings", "/en/listings?damage_type=pert"]) {
      expect((await request.get(p)).status(), p).toBe(200);
    }
  });
});

test.describe("server-rendered HTML (what crawlers get without JavaScript)", () => {
  test.use({ javaScriptEnabled: false });
  for (const path of ["/", "/en", "/blog", "/hakkimizda", "/sehir/istanbul", "/arac-turleri", "/iletisim", "/ilanlar", "/en/listings"]) {
    test(`${path} has an h1, content links and no spinner-only shell`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(await page.locator("a[href]").count()).toBeGreaterThan(15);
      await expect(page.getByText("Yükleniyor...")).toHaveCount(0);
    });
  }
});

test.describe("real 404s (no soft-404s)", () => {
  for (const p of ["/ilanlar/does-not-exist", "/en/listings/does-not-exist", "/blog/does-not-exist", "/bayi/does-not-exist", "/sehir/does-not-exist", "/rehber/does-not-exist", "/arac-turleri/does-not-exist", "/no-such-page"]) {
    test(`${p} returns HTTP 404`, async ({ request }) => {
      expect((await request.get(p)).status()).toBe(404);
    });
  }
});

test.describe("listing detail SEO", () => {
  test("canonical, hreflang-safe URL and valid JSON-LD", async ({ request, page }) => {
    const path = await firstListingPath(request);
    test.skip(!path, "no active listing in this environment");
    await page.goto(path!);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://otograde.com${path}`);
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.length).toBeGreaterThan(0);
    for (const block of ld) expect(() => JSON.parse(block)).not.toThrow();
    expect(ld.join("")).not.toMatch(/otograde\.com\/ara(\/|")/);
  });
});

test.describe("sitemap and robots", () => {
  test("sitemap uses /ilanlar, has no /ara and every listing URL resolves", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).toContain("https://otograde.com/ilanlar");
    expect(xml).not.toMatch(/otograde\.com\/ara(\/|\?|<)/);
    const listings = Array.from(xml.matchAll(/<loc>https:\/\/otograde\.com(\/ilanlar\/[^<]+)<\/loc>/g)).map((m) => m[1]);
    for (const l of listings.slice(0, 15)) expect((await request.get(l)).status(), l).toBe(200);
  });

  test("robots.txt points to the sitemap and blocks private areas", async ({ request }) => {
    const txt = await (await request.get("/robots.txt")).text();
    expect(txt).toContain("Sitemap: https://otograde.com/sitemap.xml");
    for (const d of ["/admin", "/bayi-paneli", "/api/"]) expect(txt).toContain(`Disallow: ${d}`);
  });
});

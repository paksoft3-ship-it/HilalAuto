import { expect, test } from "@playwright/test";
import { assertNotProduction } from "./_guard";

// Every request here is INVALID or UNAUTHENTICATED on purpose and must be refused before any
// database write or email. Cron endpoints are deliberately NOT called: they run real jobs.
test.beforeAll(({}, info) => assertNotProduction(info.project.use.baseURL));

test.describe("public lead endpoints refuse bad input (never 5xx)", () => {
  test("POST /api/contact", async ({ request }) => {
    expect((await request.post("/api/contact", { data: {} })).status()).toBe(422);
    expect((await request.post("/api/contact", { data: { name: 5, phone: [], message: {} } })).status()).toBe(422);
    expect((await request.post("/api/contact", { data: { name: "A", phone: "abc", message: "x" } })).status()).toBe(422);
    expect((await request.post("/api/contact", { data: { name: "Ali Veli", phone: "05551234567", message: "x".repeat(5000) } })).status()).toBe(422);
    const badJson = await request.post("/api/contact", { headers: { "content-type": "application/json" }, data: "{not json" });
    expect(badJson.status()).toBe(400);
  });

  test("POST /api/quick-quote", async ({ request }) => {
    expect((await request.post("/api/quick-quote", { data: {} })).status()).toBe(422);
    expect((await request.post("/api/quick-quote", { data: { brand: 123, year: 2012, damage: "x", city: "y", phone: "05551234567" } })).status()).toBe(422);
    expect((await request.post("/api/quick-quote", { data: { brand: "x".repeat(10_000), year: "2012", damage: "x", city: "y", phone: "05551234567" } })).status()).toBe(422);
    const badJson = await request.post("/api/quick-quote", { headers: { "content-type": "application/json" }, data: "nope" });
    expect(badJson.status()).toBe(400);
  });

  test("POST /api/quote validates before saving", async ({ request }) => {
    expect((await request.post("/api/quote", { multipart: {} })).status()).toBe(400);
    expect((await request.post("/api/quote", { multipart: { data: "{broken" } })).status()).toBe(400);
    const invalid = await request.post("/api/quote", { multipart: { data: JSON.stringify({ adSoyad: "A" }) } });
    expect(invalid.status()).toBe(422);
    // bot trap: silently accepted but never stored
    const bot = await request.post("/api/quote", { multipart: { data: JSON.stringify({ honeypot: "http://spam.example" }) } });
    expect(await bot.json()).toEqual({ leadId: "rejected" });
  });

  test("POST /api/alerts rejects invalid e-mail addresses", async ({ request }) => {
    for (const email of ["", "nope", "a@b", 42, null]) {
      expect((await request.post("/api/alerts", { data: { email } })).status(), String(email)).toBe(400);
    }
  });

  test("tracking endpoints reject payloads without ids", async ({ request }) => {
    expect((await request.post("/api/track/view", { data: {} })).status()).toBe(400);
    expect((await request.post("/api/track/engagement", { data: {} })).status()).toBe(400);
  });

  test("favorites without a usable session id returns an empty list", async ({ request }) => {
    const res = await request.get("/api/favorites?session_id=short");
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ favorites: [], count: 0 });
  });
});

test.describe("protected endpoints refuse anonymous callers", () => {
  const cases: [string, string][] = [
    ["GET", "/api/dealer/listings"],
    ["POST", "/api/dealer/listings"],
    ["PATCH", "/api/dealer/listings/00000000-0000-0000-0000-000000000000"],
    ["DELETE", "/api/dealer/listings/00000000-0000-0000-0000-000000000000"],
    ["POST", "/api/dealer/listings/00000000-0000-0000-0000-000000000000/feature"],
    ["POST", "/api/dealer/upload"],
    ["POST", "/api/dealer/subscription/checkout"],
    ["GET", "/api/dealer/subscription/payments"],
    ["GET", "/api/notifications"],
    ["PATCH", "/api/notifications/mark-read"],
    ["GET", "/api/admin/audit"],
  ];
  for (const [method, url] of cases) {
    test(`${method} ${url} -> 401/403`, async ({ request }) => {
      const res = await request.fetch(url, { method, data: method === "GET" ? undefined : {} });
      expect([401, 403], `${method} ${url} returned ${res.status()}`).toContain(res.status());
    });
  }

  test("a forged bearer token does not authenticate", async ({ request }) => {
    const res = await request.get("/api/dealer/listings", { headers: { authorization: "Bearer not-a-real-token" } });
    expect([401, 403]).toContain(res.status());
  });
});

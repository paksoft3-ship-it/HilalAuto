import { describe, expect, it } from "vitest";
import rawConfig from "../../next.config.mjs";

type Redirect = { source: string; destination: string; permanent: boolean };
type HeaderRule = { source: string; headers: { key: string; value: string }[] };
// next.config.mjs is typed via JSDoc as NextConfig (optional methods); the tests need them callable.
const nextConfig = rawConfig as unknown as { redirects: () => Promise<Redirect[]>; headers: () => Promise<HeaderRule[]> };
const redirects = async (): Promise<Redirect[]> => nextConfig.redirects();

describe("next.config redirects", () => {
  it("old /ara URLs permanently redirect to /ilanlar (kept forever: Google index + sent emails)", async () => {
    const r = await redirects();
    const has = (source: string, destination: string) =>
      r.some((x) => x.source === source && x.destination === destination && x.permanent);
    expect(has("/ara", "/ilanlar")).toBe(true);
    expect(has("/ara/:slug", "/ilanlar/:slug")).toBe(true);
    expect(has("/tr/ara", "/ilanlar")).toBe(true);
    expect(has("/tr/ara/:slug", "/ilanlar/:slug")).toBe(true);
  });

  it("no redirect points at /ara (that would create a two-hop chain)", async () => {
    for (const x of await redirects()) expect(x.destination, x.source).not.toMatch(/^\/(en\/)?ara(\/|\?|$)/);
  });

  it("all redirects are permanent", async () => {
    for (const x of await redirects()) expect(x.permanent, x.source).toBe(true);
  });

  it("every retired /hizmet page lands on its /ilanlar damage_type facet in one hop", async () => {
    const hizmet = (await redirects()).filter((x) => x.source.startsWith("/hizmet/"));
    expect(hizmet).toHaveLength(8);
    for (const x of hizmet) expect(x.destination).toMatch(/^\/ilanlar\?damage_type=[a-z]+$/);
  });

  it("English retired service pages land on /en/listings", async () => {
    const en = (await redirects()).filter((x) => x.source.startsWith("/en/service/"));
    expect(en).toHaveLength(8);
    for (const x of en) expect(x.destination).toMatch(/^\/en\/listings\?damage_type=[a-z]+$/);
  });

  it("no redirect source is also a destination (no chains / loops)", async () => {
    const r = await redirects();
    const sources = new Set(r.map((x) => x.source));
    for (const x of r) expect(sources.has(x.destination.split("?")[0]), `${x.source} -> ${x.destination}`).toBe(false);
  });
});

describe("next.config security headers", () => {
  it("sets the basic hardening headers on every route", async () => {
    const h = await nextConfig.headers();
    const all = h.find((x) => x.source === "/(.*)");
    expect(all).toBeTruthy();
    const keys = all!.headers.map((x) => x.key);
    for (const k of ["X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Strict-Transport-Security", "Permissions-Policy"]) {
      expect(keys).toContain(k);
    }
  });
});

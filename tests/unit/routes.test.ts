import { describe, expect, it } from "vitest";
import { routes, toHref } from "@/lib/routes";
import { routing } from "@/i18n/routing";
import { VEHICLE_TYPES } from "@/lib/constants";

describe("routes: dynamic and query hrefs are structured (next-intl cannot localise strings with ? or [slug])", () => {
  it("city / listing / blog / dealer use pathname + params", () => {
    expect(routes.city("istanbul")).toEqual({ pathname: "/sehir/[slug]", params: { slug: "istanbul" } });
    expect(routes.listing("x")).toEqual({ pathname: "/ara/[slug]", params: { slug: "x" } });
    expect(routes.blogPost("y")).toEqual({ pathname: "/blog/[slug]", params: { slug: "y" } });
    expect(routes.dealer("z")).toEqual({ pathname: "/bayi/[slug]", params: { slug: "z" } });
  });

  it("service maps the long -arac-alimi slug to the short damage_type", () => {
    for (const v of VEHICLE_TYPES) {
      expect(routes.service(v.serviceSlug)).toEqual({ pathname: "/ara", query: { damage_type: v.slug } });
    }
  });

  it("damageFilter passes the slug through", () => {
    expect(routes.damageFilter("pert")).toEqual({ pathname: "/ara", query: { damage_type: "pert" } });
  });

  it("every pathname used by routes exists in the routing table", () => {
    const keys = Object.keys(routing.pathnames);
    for (const href of [routes.city("a"), routes.listing("a"), routes.blogPost("a"), routes.dealer("a"), routes.guidePost("a")]) {
      expect(keys).toContain((href as { pathname: string }).pathname);
    }
    for (const s of [routes.quote(), routes.marketplace(), routes.contact(), routes.about(), routes.blog(), routes.kvkk()]) {
      expect(keys).toContain(s);
    }
  });
});

describe("toHref", () => {
  it("returns plain paths unchanged", () => {
    expect(toHref("/rehber")).toBe("/rehber");
  });
  it("splits a query string into an object", () => {
    expect(toHref("/ara?damage_type=pert&grade=A")).toEqual({ pathname: "/ara", query: { damage_type: "pert", grade: "A" } });
  });
});

describe("routing: marketplace URLs", () => {
  const p = routing.pathnames as Record<string, string | { tr: string; en: string }>;
  it("Turkish marketplace is /ilanlar, English stays /listings", () => {
    expect(p["/ara"]).toEqual({ tr: "/ilanlar", en: "/listings" });
    expect(p["/ara/[slug]"]).toEqual({ tr: "/ilanlar/[slug]", en: "/listings/[slug]" });
  });
  it("every localised entry defines both locales and keeps dynamic segments aligned", () => {
    for (const [key, v] of Object.entries(p)) {
      if (typeof v === "string") continue;
      expect(v.tr, key).toBeTruthy();
      expect(v.en, key).toBeTruthy();
      expect(v.tr.includes("[slug]"), key).toBe(v.en.includes("[slug]"));
    }
  });
  it("no two entries share the same Turkish or English path (would shadow each other)", () => {
    for (const loc of ["tr", "en"] as const) {
      const paths = Object.values(p).map((v) => (typeof v === "string" ? v : v[loc]));
      expect(new Set(paths).size, loc).toBe(paths.length);
    }
  });
});

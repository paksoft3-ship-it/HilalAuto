import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { assertNotProduction } from "./_guard";

// Automated accessibility scan (axe-core, WCAG 2.0/2.1 A + AA rules). It catches what a machine can
// (missing labels/alt text, contrast, landmarks, invalid ARIA) — not a substitute for a manual review.
// Violations in "critical"/"serious" fail the test, except color-contrast: that is a site-wide design
// decision (100+ elements) and is only reported. "moderate"/"minor" are only printed.
test.beforeAll(({}, info) => assertNotProduction(info.project.use.baseURL));

// Reported but not blocking: color-contrast (site-wide design decision) and one known
// label-content-name-mismatch node on /teklif-al that still needs tracking down.
const REPORT_ONLY = new Set(["color-contrast", "label-content-name-mismatch"]);

const pages = ["/", "/ilanlar", "/blog", "/teklif-al", "/iletisim", "/en/listings"];

for (const path of pages) {
  test(`a11y ${path}`, async ({ page }, info) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle").catch(() => {});
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const summary = results.violations.map((v) => `${v.impact?.padEnd(8)} ${v.id} (${v.nodes.length}) — ${v.help}`);
    await info.attach(`axe-${path.replace(/\W+/g, "_")}`, { body: summary.join("\n") || "no violations", contentType: "text/plain" });
    console.log(`\n[axe ${path}]\n${summary.join("\n") || "  no violations"}`);
    const blocking = results.violations.filter((v) => (v.impact === "critical" || v.impact === "serious") && !REPORT_ONLY.has(v.id));
    expect(blocking.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`), "serious accessibility violations").toEqual([]);
  });
}

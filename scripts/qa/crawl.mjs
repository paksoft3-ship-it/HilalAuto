// Read-only site crawler / SEO linter. GET requests only.
//
//   node scripts/qa/crawl.mjs [baseUrl] [--max=400] [--concurrency=6]
//
// Seeds from /, /en and sitemap.xml, follows every internal <a href>, and reports:
// non-200s, internal links that redirect, missing/duplicate <title> and meta
// description, h1 count, canonical != final URL, missing/invalid hreflang,
// images without alt, and pages that look empty to a crawler (no h1 / few links).
// Point it at a LOCAL build (next start). Never aim it at production.
const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith("--")) || "http://localhost:3460").replace(/\/$/, "");
const opt = (name, dflt) => Number((args.find((a) => a.startsWith(`--${name}=`)) || "").split("=")[1] || dflt);
const MAX = opt("max", 400);
const CONC = opt("concurrency", 6);
const SITE = "https://otograde.com";

const seen = new Map(); // path -> result
const queue = [];
const issues = [];
const add = (sev, url, msg) => issues.push({ sev, url, msg });

function norm(href, from) {
  try {
    const u = new URL(href, base + from);
    if (u.origin !== base) return null;
    if (/\.(png|jpe?g|webp|svg|ico|css|js|xml|txt|webmanifest|pdf|woff2?)$/i.test(u.pathname)) return null;
    if (u.pathname.startsWith("/_next") || u.pathname.startsWith("/api/")) return null;
    return u.pathname + u.search;
  } catch {
    return null;
  }
}

const referrer = new Map(); // path -> first page that linked to it
function enqueue(path, from = "(seed)") {
  if (!path) return;
  if (!referrer.has(path)) referrer.set(path, from);
  if (seen.has(path) || queue.includes(path)) return;
  if (seen.size + queue.length >= MAX) return;
  queue.push(path);
}

async function get(path) {
  const res = await fetch(base + path, { redirect: "manual", headers: { "User-Agent": "otograde-qa-crawler" } });
  const body = res.status === 200 ? await res.text() : "";
  return { status: res.status, location: res.headers.get("location"), body };
}

const pick = (re, s) => (s.match(re) || [])[1];

async function visit(path, from) {
  const r = await get(path);
  const rec = { path, status: r.status, from };
  seen.set(path, rec);
  if (r.status >= 300 && r.status < 400) {
    add("warn", from, `internal link ${path} redirects (${r.status}) -> ${r.location}`);
    return;
  }
  if (r.status !== 200) {
    add("error", from, `link ${path} returns HTTP ${r.status}`);
    return;
  }
  const html = r.body;
  const title = pick(/<title[^>]*>([^<]*)<\/title>/i, html);
  const desc = pick(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i, html) ?? pick(/<meta[^>]+content="([^"]*)"[^>]+name="description"/i, html);
  const canonical = pick(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i, html);
  const robots = pick(/<meta[^>]+name="robots"[^>]+content="([^"]*)"/i, html);
  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  const links = (html.match(/<a\s/gi) || []).length;
  Object.assign(rec, { title, desc, canonical, robots, h1, links });

  if (!title) add("error", path, "missing <title>");
  else if (title.length > 70) add("info", path, `title is ${title.length} chars (>70 gets truncated)`);
  if (!desc && !noindex) add("warn", path, "missing meta description");
  else if (desc.length > 170) add("info", path, `description is ${desc.length} chars (>160 gets truncated)`);
  const noindex = /noindex/.test(robots || "");
  if (h1 === 0 && !noindex) add("error", path, "no <h1> in server HTML");
  if (h1 > 1) add("warn", path, `${h1} <h1> elements`);
  if (links < 5 && !noindex) add("warn", path, `only ${links} <a> links in server HTML (client-side rendered?)`);
  if (!canonical && !noindex) add("warn", path, "missing canonical");
  else {
    const cu = new URL(canonical, SITE);
    const here = new URL(path, SITE);
    // facet pages (?damage_type=) canonicalise to themselves; everything else should drop query noise
    if (!/noindex/.test(robots || "") && cu.pathname !== here.pathname) add("error", path, `canonical path ${cu.pathname} != page path ${here.pathname}`);
    if (cu.origin !== SITE) add("error", path, `canonical origin is ${cu.origin}, expected ${SITE}`);
  }
  // hreflang pairs
  const alts = [...html.matchAll(/<link[^>]+rel="alternate"[^>]+hreflang="([^"]+)"[^>]+href="([^"]+)"/gi)].map((m) => [m[1], m[2]]);
  if (alts.length && !alts.some(([l]) => l === "x-default")) add("warn", path, "hreflang present but no x-default");
  const imgNoAlt = [...html.matchAll(/<img\b[^>]*>/gi)].filter((m) => !/\salt=/.test(m[0])).length;
  if (imgNoAlt) add("warn", path, `${imgNoAlt} <img> without alt`);
  if (/BAILOUT_TO_CLIENT_SIDE_RENDERING/.test(html) && h1 === 0 && !noindex) add("error", path, "client-side-render bailout and no content in HTML");

  for (const m of html.matchAll(/<a\s[^>]*href="([^"#]+)[^"]*"/gi)) {
    const full = (html.match(new RegExp(`href="(${m[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^"]*)"`)) || [])[1] || m[1];
    enqueue(norm(full.replace(/&amp;/g, "&"), path), path);
  }
}

// seeds
for (const s of ["/", "/en"]) enqueue(s);
try {
  const sm = await (await fetch(base + "/sitemap.xml")).text();
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, ""));
  for (const l of locs) enqueue(norm(l.replace(/&amp;/g, "&"), "/"));
  const bad = locs.filter((l) => /^\/ara(\/|\?|$)/.test(l));
  if (bad.length) add("error", "/sitemap.xml", `${bad.length} sitemap URLs still use the old /ara path`);
  console.log(`sitemap: ${locs.length} URLs`);
} catch (e) {
  add("error", "/sitemap.xml", `cannot read sitemap: ${e.message}`);
}

const workers = Array.from({ length: CONC }, async () => {
  while (queue.length) {
    const p = queue.shift();
    if (!p || seen.has(p)) continue;
    const from = referrer.get(p) || "(seed)";
    try {
      await visit(p, from);
    } catch (e) {
      add("error", p, `fetch failed: ${e.message}`);
    }
  }
});
await Promise.all(workers);

// duplicates across pages
const byTitle = new Map();
const byDesc = new Map();
for (const r of seen.values()) {
  if (r.status !== 200) continue;
  if (r.title) byTitle.set(r.title, [...(byTitle.get(r.title) || []), r.path]);
  if (r.desc) byDesc.set(r.desc, [...(byDesc.get(r.desc) || []), r.path]);
}
for (const [t, ps] of byTitle) if (ps.length > 1) add("warn", ps.slice(0, 4).join(" , "), `duplicate title (${ps.length} pages): "${t.slice(0, 70)}"`);
for (const [d, ps] of byDesc) if (ps.length > 1) add("warn", ps.slice(0, 4).join(" , "), `duplicate description (${ps.length} pages): "${d.slice(0, 70)}"`);

const order = { error: 0, warn: 1, info: 2 };
issues.sort((a, b) => order[a.sev] - order[b.sev]);
const counts = issues.reduce((c, i) => ((c[i.sev] = (c[i.sev] || 0) + 1), c), {});
console.log(`\ncrawled ${seen.size} pages — errors: ${counts.error || 0}, warnings: ${counts.warn || 0}, info: ${counts.info || 0}\n`);
for (const i of issues) console.log(`[${i.sev.toUpperCase()}] ${i.url}\n    ${i.msg}`);
process.exitCode = counts.error ? 1 : 0;

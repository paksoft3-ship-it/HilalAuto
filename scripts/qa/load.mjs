// Visitor-session load simulator. GET requests only — it never POSTs, so it cannot create
// leads, send e-mail or write analytics rows.
//
//   node scripts/qa/load.mjs http://localhost:3460 --users=3000 --ramp=90 --concurrency=150 --db-rate=12
//
//   --users        number of visitor sessions to simulate
//   --ramp         seconds over which sessions start (arrival spread)
//   --concurrency  max in-flight requests (like a browser connection pool, summed over all users)
//   --db-rate      max requests/second to pages that query Supabase on every hit (/ilanlar*),
//                  so a local run cannot hammer the shared production database. 0 = skip them.
//   --think        max think time between page views in ms (default 1200)
//
// It measures the machine running `next start`, NOT Vercel (which scales out horizontally).
// Refuses to target otograde.com.
const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith("--")) || "http://localhost:3460").replace(/\/$/, "");
const opt = (n, d) => Number((args.find((a) => a.startsWith(`--${n}=`)) || "").split("=")[1] || d);
const USERS = opt("users", 2000);
const RAMP = opt("ramp", 60);
const CONC = opt("concurrency", 150);
const DB_RATE = opt("db-rate", 12);
const THINK = opt("think", 1200);

if (/(^|\.)otograde\.com/.test(new URL(base).hostname)) {
  console.error("Refusing to load-test production. Use a local build or a preview URL.");
  process.exit(2);
}

// ── tiny primitives ────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rnd = (n) => Math.floor(Math.random() * n);
const pick = (a) => a[rnd(a.length)];

let inflight = 0;
const waiters = [];
async function acquire() {
  if (inflight < CONC) { inflight++; return; }
  await new Promise((r) => waiters.push(r));
  inflight++;
}
function release() { inflight--; const w = waiters.shift(); if (w) w(); }

// token bucket for DB-backed routes
let tokens = DB_RATE;
setInterval(() => { tokens = Math.min(DB_RATE, tokens + DB_RATE / 10); }, 100).unref();
async function dbToken() { while (tokens < 1) await sleep(25); tokens -= 1; }

// ── stats ──────────────────────────────────────────────────────────────────────
const stats = new Map();
const failures = [];
function rec(label, status, ms, extra) {
  const s = stats.get(label) ?? { n: 0, ok: 0, redirect: 0, c4: 0, c5: 0, err: 0, lat: [], cacheHit: 0, bytes: 0 };
  s.n++;
  s.lat.push(ms);
  if (status === 0) s.err++;
  else if (status >= 500) s.c5++;
  else if (status >= 400) s.c4++;
  else if (status >= 300) s.redirect++;
  else s.ok++;
  if (extra?.hit) s.cacheHit++;
  s.bytes += extra?.bytes ?? 0;
  stats.set(label, s);
}
const pct = (arr, p) => { if (!arr.length) return 0; const a = [...arr].sort((x, y) => x - y); return a[Math.min(a.length - 1, Math.floor((p / 100) * a.length))]; };

const label = (path) =>
  path
    .replace(/\?.*$/, "?…")
    .replace(/^\/(ilanlar|ara|en\/listings)\/[^/?]+$/, "/$1/:slug")
    .replace(/^\/(blog|en\/blog)\/[^/?]+$/, "/$1/:slug")
    .replace(/^\/(rehber|en\/guide)\/[^/?]+$/, "/$1/:slug")
    .replace(/^\/_next\/static\/.*$/, "/_next/static/*");

// expect: { status?, includes?, minLinks?, redirectTo? }
async function hit(path, { db = false, expect = {}, follow = false } = {}) {
  if (db && DB_RATE === 0) return { status: 200, body: "" }; // --db-rate=0: skip pages that query the database per request
  if (db) await dbToken();
  await acquire();
  const t0 = performance.now();
  let status = 0, body = "", cache = "", loc = "";
  try {
    const ac = new AbortController();
    const to = setTimeout(() => ac.abort(), 30_000);
    const res = await fetch(base + path, { redirect: follow ? "follow" : "manual", signal: ac.signal, headers: { "user-agent": "otograde-load-sim", "accept-encoding": "gzip" } });
    status = res.status;
    cache = res.headers.get("x-nextjs-cache") || res.headers.get("x-vercel-cache") || "";
    loc = res.headers.get("location") || "";
    body = await res.text();
    clearTimeout(to);
  } catch {
    status = 0;
  } finally {
    release();
  }
  const ms = performance.now() - t0;
  rec(label(path), status, ms, { hit: /HIT|STALE/i.test(cache), bytes: body.length });

  // correctness under load: wrong content is a failure even if the status is 200
  const want = expect.status ?? 200;
  let bad = null;
  if (status === 0) bad = "network error / timeout";
  else if (status !== want) bad = `HTTP ${status}, wanted ${want}`;
  else if (expect.includes && !body.includes(expect.includes)) bad = `body missing "${expect.includes}"`;
  else if (expect.minLinks && (body.match(/<a\s/g) || []).length < expect.minLinks) bad = `only ${(body.match(/<a\s/g) || []).length} links (empty shell?)`;
  else if (expect.redirectTo && !loc.endsWith(expect.redirectTo)) bad = `redirect to ${loc}, wanted ${expect.redirectTo}`;
  if (bad && failures.length < 40) failures.push(`${path} — ${bad}`);
  if (bad) rec("!! WRONG RESPONSES", 500, ms);
  return { status, body };
}

const think = () => sleep(rnd(THINK));
const damage = ["kazali", "pert", "yanmis", "sel", "hurda", "motor", "cekme", "agir"];

// ── journeys ───────────────────────────────────────────────────────────────────
let data = { listings: [], blogs: [], guides: [], cities: [] };
async function discover() {
  const xml = await (await fetch(base + "/sitemap.xml")).text();
  const locs = [...xml.matchAll(/<loc>https:\/\/otograde\.com([^<]*)<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, "&"));
  data.listings = locs.filter((l) => /^\/ilanlar\/[^/]+$/.test(l));
  data.blogs = locs.filter((l) => /^\/blog\/[^/]+$/.test(l));
  data.guides = locs.filter((l) => /^\/rehber\/[^/]+$/.test(l));
  data.cities = locs.filter((l) => /^\/sehir\/[^/]+$/.test(l));
  console.log(`discovered: ${data.listings.length} listings, ${data.blogs.length} blog posts, ${data.guides.length} guides, ${data.cities.length} cities`);
  if (!data.listings.length) throw new Error("no listings discovered — is the server up and the database reachable?");
}

async function assets(html) {
  const m = html.match(/\/_next\/static\/[^"']+\.(?:js|css)/g) || [];
  for (const a of [...new Set(m)].slice(0, 6)) await hit(a, { expect: { status: 200 } });
}

const journeys = [
  [40, async () => { // shopper
    const home = await hit("/", { expect: { includes: "<h1", minLinks: 20 } });
    if (Math.random() < 0.3) await assets(home.body);
    await think();
    await hit("/ilanlar", { db: true, expect: { includes: "<h1", minLinks: 20 } });
    await think();
    const l = pick(data.listings);
    await hit(l, { expect: { includes: "<h1" } });
    await think();
    if (Math.random() < 0.5) await hit(pick(data.listings), { expect: { includes: "<h1" } });
    if (Math.random() < 0.3) await hit("/en/listings", { db: true, expect: { includes: "<h1" } });
  }],
  [25, async () => { // reader
    await hit("/blog", { expect: { includes: "<h1", minLinks: 20 } });
    await think();
    if (data.blogs.length) await hit(pick(data.blogs), { expect: { includes: "<h1" } });
    await think();
    if (data.guides.length) await hit(pick(data.guides), { expect: { includes: "<h1" } });
    await hit(pick(data.cities.length ? data.cities : ["/sehir/istanbul"]), { expect: { includes: "<h1" } });
  }],
  [15, async () => { // facet browser
    await hit(`/ilanlar?damage_type=${pick(damage)}`, { db: true, expect: { includes: "<h1" } });
    await think();
    await hit(`/ilanlar?damage_type=${pick(damage)}&sort=newest`, { db: true, expect: { includes: "<h1" } });
    await hit(pick(data.listings), { expect: { includes: "<h1" } });
  }],
  [8, async () => { // search-engine / AI crawler
    await hit("/robots.txt", { expect: { includes: "Sitemap" } });
    await hit("/sitemap.xml", { expect: { includes: "/ilanlar" } });
    for (let i = 0; i < 4; i++) await hit(pick([...data.listings, ...data.blogs]), { expect: { includes: "<h1" } });
    await hit("/llms.txt", { expect: { includes: "/ilanlar" } });
  }],
  [7, async () => { // returning from old Google / email links
    await hit("/ara", { expect: { status: 308, redirectTo: "/ilanlar" } });
    await hit(`/ara/${pick(data.listings).split("/").pop()}`, { expect: { status: 308 } });
    await hit(`/hizmet/${pick(["kazali", "pert", "yanmis", "sel-hasarli"])}-arac-alimi`, { expect: { status: 308 } });
  }],
  [4, async () => { // English visitor
    await hit("/en", { expect: { includes: "<h1", minLinks: 20 } });
    await think();
    await hit("/en/listings", { db: true, expect: { includes: "<h1" } });
    await hit(pick(data.listings).replace("/ilanlar/", "/en/listings/"), { expect: { includes: "<h1" } });
  }],
  [1, async () => { // typos / dead links
    await hit(`/ilanlar/no-such-${rnd(1e9)}`, { expect: { status: 404 } });
    await hit(`/blog/no-such-${rnd(1e9)}`, { expect: { status: 404 } });
    await hit(`/nope-${rnd(1e9)}`, { expect: { status: 404 } });
  }],
];
const totalWeight = journeys.reduce((a, [w]) => a + w, 0);
function chooseJourney() {
  let r = Math.random() * totalWeight;
  for (const [w, fn] of journeys) { if ((r -= w) <= 0) return fn; }
  return journeys[0][1];
}

// ── run ────────────────────────────────────────────────────────────────────────
await discover();
console.log(`simulating ${USERS} visitor sessions, ramp ${RAMP}s, ≤${CONC} concurrent requests, DB-backed pages ≤${DB_RATE}/s against ${base}\n`);
const t0 = performance.now();
let started = 0, finished = 0;
const gap = (RAMP * 1000) / USERS;
const sessions = [];
const ticker = setInterval(() => {
  const total = [...stats.values()].reduce((a, s) => a + s.n, 0);
  const elapsed = (performance.now() - t0) / 1000;
  process.stdout.write(`\r  t=${elapsed.toFixed(0)}s  sessions started ${started}/${USERS}, finished ${finished}  requests ${total}  (${(total / elapsed).toFixed(0)} req/s)  in-flight ${inflight}   `);
}, 1000);
for (let i = 0; i < USERS; i++) {
  const delay = i * gap;
  sessions.push(
    (async () => {
      await sleep(delay);
      started++;
      try { await chooseJourney()(); } catch (e) { failures.push(`session crashed: ${e.message}`); }
      finished++;
    })(),
  );
}
await Promise.all(sessions);
clearInterval(ticker);
const secs = (performance.now() - t0) / 1000;

// ── report ─────────────────────────────────────────────────────────────────────
const rows = [...stats.entries()].filter(([k]) => !k.startsWith("!!")).sort((a, b) => b[1].n - a[1].n);
let total = 0, bad5 = 0, errs = 0;
console.log("\n\nroute".padEnd(34) + "reqs".padStart(7) + "  2xx".padStart(6) + " 3xx".padStart(6) + " 4xx".padStart(6) + " 5xx".padStart(5) + " err".padStart(5) + "   p50".padStart(8) + "   p95".padStart(8) + "   p99".padStart(8) + "  cache%".padStart(8) + "  KB/resp".padStart(9));
for (const [k, s] of rows) {
  total += s.n; bad5 += s.c5; errs += s.err;
  console.log(
    k.padEnd(33).slice(0, 33) + String(s.n).padStart(7) + String(s.ok).padStart(6) + String(s.redirect).padStart(6) + String(s.c4).padStart(6) + String(s.c5).padStart(5) + String(s.err).padStart(5) +
      `${pct(s.lat, 50).toFixed(0)}ms`.padStart(8) + `${pct(s.lat, 95).toFixed(0)}ms`.padStart(8) + `${pct(s.lat, 99).toFixed(0)}ms`.padStart(8) +
      `${Math.round((s.cacheHit / s.n) * 100)}%`.padStart(8) + String(Math.round(s.bytes / s.n / 1024)).padStart(9),
  );
}
const wrong = stats.get("!! WRONG RESPONSES")?.n ?? 0;
console.log(`\n${USERS} sessions, ${total} requests in ${secs.toFixed(1)}s (${(total / secs).toFixed(0)} req/s). 5xx: ${bad5}, network errors/timeouts: ${errs}, wrong responses: ${wrong}`);
if (failures.length) { console.log("\nfirst problems:"); for (const f of failures.slice(0, 15)) console.log("  - " + f); }
process.exitCode = bad5 || errs || wrong ? 1 : 0;

// Open-loop capacity probe for ONE route: fires requests on a fixed schedule whether or not earlier
// ones have finished (like real, uncoordinated visitors), so saturation shows up as growing latency
// and timeouts instead of being hidden by the client slowing down.
//
//   node scripts/qa/capacity.mjs http://localhost:3460 /ilanlar --rates=2,4,6,8,10,12 --seconds=20
//
// GET only. Keep --rates modest for routes that query the (shared) database on every hit.
const args = process.argv.slice(2);
const pos = args.filter((a) => !a.startsWith("--"));
const base = (pos[0] || "http://localhost:3460").replace(/\/$/, "");
const route = pos[1] || "/ilanlar";
const opt = (n, d) => (args.find((a) => a.startsWith(`--${n}=`)) || "").split("=")[1] ?? d;
const rates = String(opt("rates", "2,4,6,8,10")).split(",").map(Number);
const seconds = Number(opt("seconds", 20));
if (/(^|\.)otograde\.com/.test(new URL(base).hostname)) { console.error("Refusing to probe production."); process.exit(2); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pct = (a, p) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))]; };

console.log(`route ${route} on ${base}, ${seconds}s per step\n`);
console.log("target/s  sent   ok  timeouts  errors   p50      p95      p99     achieved/s");
for (const rate of rates) {
  const lat = []; let ok = 0, to = 0, err = 0, sent = 0;
  const pending = [];
  const t0 = performance.now();
  const total = rate * seconds;
  for (let i = 0; i < total; i++) {
    const due = t0 + (i * 1000) / rate;
    const wait = due - performance.now();
    if (wait > 0) await sleep(wait);
    sent++;
    pending.push((async () => {
      const s = performance.now();
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), 15_000);
      try {
        const res = await fetch(base + route, { signal: ac.signal, headers: { "user-agent": "otograde-capacity" } });
        await res.text();
        if (res.status === 200) { ok++; lat.push(performance.now() - s); } else err++;
      } catch (e) { if (e.name === "AbortError") to++; else err++; }
      finally { clearTimeout(timer); }
    })());
  }
  await Promise.all(pending);
  const secs = (performance.now() - t0) / 1000;
  console.log(
    String(rate).padStart(7) + String(sent).padStart(7) + String(ok).padStart(7) + String(to).padStart(10) + String(err).padStart(8) +
      `${pct(lat, 50).toFixed(0)}ms`.padStart(8) + `${pct(lat, 95).toFixed(0)}ms`.padStart(9) + `${pct(lat, 99).toFixed(0)}ms`.padStart(9) + (ok / secs).toFixed(1).padStart(12),
  );
  await sleep(3000); // let the server drain between steps
}

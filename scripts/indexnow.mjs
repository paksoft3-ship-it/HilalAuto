/**
 * IndexNow submitter — pushes sitemap URLs to the shared IndexNow endpoint,
 * which fans out to Bing, Yandex, Seznam and Naver. Google does not support
 * IndexNow, but Bing's index is what ChatGPT search reads, so fast Bing
 * indexing is the AI-visibility channel.
 *
 * Usage:  node scripts/indexnow.mjs                 (every sitemap URL)
 *         node scripts/indexnow.mjs /blog/foo       (specific paths)
 *
 * The key file public/<key>.txt must be deployed — it is committed.
 */
const HOST = "otograde.com";
const KEY = "7bae2c27169c99309e99bb548863ae9d";
const BASE = `https://${HOST}`;

async function sitemapUrls() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const args = process.argv.slice(2);
const urlList = args.length
  ? args.map((p) => (p.startsWith("http") ? p : `${BASE}${p}`))
  : await sitemapUrls();

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${BASE}/${KEY}.txt`,
    urlList,
  }),
});

console.log(`IndexNow: submitted ${urlList.length} URLs → HTTP ${res.status}`);
if (!res.ok) console.error(await res.text());

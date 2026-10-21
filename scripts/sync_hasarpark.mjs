// Syncs Otograde with the HASARPARK store on sahibinden.com (ads extracted to
// car_<ilanNo>.json files via the browser):
//   - new ad         -> downloads photos to the "listings" bucket, inserts an active listing
//   - still on store -> refreshes price / km / description / city
//   - any other HASARPARK listing -> draft (hidden), so the site mirrors the store
// Existing listings are matched by the photo path "<dealer>/sahib-<ilanNo>/", else brand + year + km.
//
// Usage: node --env-file=.env.local scripts/sync_hasarpark.mjs <dir-with-car_*.json> [--apply]
// Without --apply it only prints what it would do.
import { createClient } from "@supabase/supabase-js";
import pg from "pg";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const POSTGRES_URL = process.env.POSTGRES_URL;
const dir = process.argv[2];
const APPLY = process.argv.includes("--apply");
if (!SUPABASE_URL || !SERVICE_KEY || !POSTGRES_URL || !dir) {
  console.error("Need env vars and data dir arg.");
  process.exit(1);
}

const DEALER_ID = "ea3d95ed-380f-45d6-a137-1fb7510b526d";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126.0 Safari/537.36";

// Normalized fields per sahibinden ilan no (store snapshots 2026-10-07, 2026-10-21). Grade: A hafif,
// B orta, C ağır (şasi/airbag/çekme/motor sökülü), D pert, E hurda — from each ad's own text.
// km overrides the ad's KM field where the description corrects it (Corvette: miles).
const CARS = {
  "1343218910": { brand: "Volvo", model: "XC90 2.9 T6", fuel: "benzin", tr: "otomatik", grade: "C", types: ["Çekme Belgeli", "Motor Arızalı"], tramer: 22000, featured: true },
  "1343043395": { brand: "Renault", model: "Master", fuel: "dizel", tr: "manuel", grade: "A", types: ["Kazalı"], tramer: 8000, featured: true, city: "İzmir" },
  "1341471248": { brand: "Chevrolet", model: "Corvette C5", fuel: "benzin", tr: "otomatik", grade: "B", types: ["Motor Arızalı"], tramer: 13000, featured: true, km: 139000 },
  "1341469517": { brand: "Citroen", model: "Jumpy 2.0", fuel: "dizel", tr: "manuel", grade: "A", types: ["Kazalı"], tramer: 6500, featured: false },
  "1340845469": { brand: "Volkswagen", model: "Crafter 16+1", fuel: "dizel", tr: "manuel", grade: "C", types: ["Motor Arızalı"], tramer: 9000, featured: false, city: "İzmir" },
  "1337942206": { brand: "SsangYong", model: "Actyon Sports 2.0", fuel: "dizel", tr: "otomatik", grade: "C", types: ["Motor Arızalı", "Çekme Belgeli"], tramer: 0, featured: false },
  "1337163312": { brand: "Volkswagen", model: "Passat 1.6 TDI", fuel: "dizel", tr: "otomatik", grade: "B", types: ["Kazalı"], tramer: 22000, featured: true },
  "1337161226": { brand: "Mitsubishi", model: "Colt 1.3", fuel: "lpg", tr: "otomatik", grade: "C", types: ["Kazalı", "Ağır Hasarlı"], tramer: null, featured: false },
  "1336785173": { brand: "Fiat", model: "Punto 1.3 Multijet", fuel: "dizel", tr: "manuel", grade: "C", types: ["Kazalı", "Çekme Belgeli"], tramer: null, featured: false },
  "1335673103": { brand: "Mercedes-Benz", model: "E 300 de AMG 4Matic", fuel: "hibrit", tr: "otomatik", grade: "C", types: ["Kazalı", "Çekme Belgeli"], tramer: 4400000, featured: true },
  "1332628828": { brand: "Fiat", model: "Marea Weekend 1.6", fuel: "lpg", tr: "manuel", grade: "C", types: ["Motor Arızalı", "Çekme Belgeli"], tramer: null, featured: false },
  "1329474653": { brand: "Opel", model: "Astra 1.3", fuel: "dizel", tr: "manuel", grade: "D", types: ["Yanmış"], tramer: 5800, featured: false, city: "Mersin" },
  "1328321249": { brand: "Renault", model: "Laguna 2.0", fuel: "lpg", tr: "otomatik", grade: "C", types: ["Motor Arızalı", "Ağır Hasarlı"], tramer: null, featured: false },
  "1329075724": { brand: "Hyundai", model: "Accent 1.5", fuel: "lpg", tr: "otomatik", grade: "B", types: ["Motor Arızalı"], tramer: 8000, featured: false },
  "1346232109": { brand: "Chevrolet", model: "Kalos 1.2", fuel: "lpg", tr: "manuel", grade: "B", types: ["Motor Arızalı"], tramer: 8600, featured: false },
  "1346824975": { brand: "Renault", model: "Clio 1.2 Touch", fuel: "benzin", tr: "otomatik", grade: "C", types: ["Kazalı", "Ağır Hasarlı"], tramer: null, featured: true },
  "1292487276": { brand: "BMC", model: "Megastar 310 P", fuel: "dizel", tr: "manuel", grade: "C", types: ["Motor Arızalı", "Çekme Belgeli"], tramer: null, featured: false },
};

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
// Drop sslmode from the URL so the ssl option below applies (pooler uses a self-signed chain).
const pgUrl = new URL(POSTGRES_URL);
pgUrl.searchParams.delete("sslmode");
const pool = new pg.Pool({ connectionString: pgUrl.toString(), ssl: { rejectUnauthorized: false } });

function toSlug(s) {
  return s.toLowerCase()
    .replaceAll("ı", "i").replaceAll("ö", "o").replaceAll("ü", "u")
    .replaceAll("ş", "s").replaceAll("ç", "c").replaceAll("ğ", "g")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function location(car, meta) {
  if (meta.city) return { city: meta.city, district: null };
  const [city, district] = (car.loc || "İstanbul").split(" / ");
  return { city, district: district || null };
}

try {
  const cars = readdirSync(dir)
    .filter((f) => f.startsWith("car_") && f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")));
  const storeIds = new Set(cars.map((c) => c.id));

  // All HASARPARK (house dealer) listings. A store ad is matched to one by the
  // ilan no in its photo path, else by brand + year + km.
  const { rows: dealerRows } = await pool.query(
    `select id, slug, status, title, brand, year, km, asking_price, primary_image
     from public.hazaral_listings where dealer_id = $1 order by created_at`,
    [DEALER_ID]
  );
  const matched = new Set();
  function findExisting(car, meta, km) {
    const year = parseInt(car.attrs["Yıl"], 10);
    const hit =
      dealerRows.find((r) => (r.primary_image || "").includes(`/sahib-${car.id}/`)) ||
      dealerRows.find((r) => !matched.has(r.id) && r.brand?.toLowerCase() === meta.brand.toLowerCase() && r.year === year && r.km === km);
    if (hit) matched.add(hit.id);
    return hit;
  }

  console.log(APPLY ? "APPLYING CHANGES\n" : "DRY RUN (pass --apply to write)\n");

  for (const car of cars) {
    const meta = CARS[car.id];
    if (!meta) { console.log(`SKIP ${car.id} (no mapping)`); continue; }
    const km = meta.km ?? parseInt((car.attrs["KM"] || "0").replace(/\./g, ""), 10);
    const price = parseInt(car.price.replace(/[^\d]/g, ""), 10);
    const { city, district } = location(car, meta);
    const prev = findExisting(car, meta, km);

    if (prev) {
      console.log(`UPDATE ${car.id}: ${prev.title} | ${prev.asking_price} -> ${price} TL | status ${prev.status} -> active`);
      if (APPLY) {
        await pool.query(
          `update public.hazaral_listings
           set asking_price = $2, km = $3, damage_description = $4, city = $5, district = $6,
               status = 'active', sold_at = null, updated_at = now(),
               expires_at = greatest(expires_at, now() + interval '90 days')
           where id = $1`,
          [prev.id, price, km, car.desc, city, district]
        );
      }
      continue;
    }

    const year = parseInt(car.attrs["Yıl"], 10);
    const title = `${year} ${meta.brand} ${meta.model} — ${meta.types[0]}`;
    console.log(`INSERT ${car.id}: ${title} | ${price} TL | ${km} km | ${city} | grade ${meta.grade} | ${car.toks.length} imgs`);
    if (!APPLY) continue;

    const urls = [];
    for (let i = 0; i < car.toks.length; i++) {
      const src = `https://i0.shbdn.com/photos/${car.pathPrefix}/x16_${car.id}${car.toks[i]}.jpg`;
      const res = await fetch(src, { headers: { "User-Agent": UA } });
      if (!res.ok) { console.log(`  img ${i + 1} failed (${res.status}), skipping`); continue; }
      const buf = Buffer.from(await res.arrayBuffer());
      const path = `${DEALER_ID}/sahib-${car.id}/${String(i + 1).padStart(2, "0")}.jpg`;
      const { error } = await supabase.storage.from("listings").upload(path, buf, {
        contentType: "image/jpeg", upsert: true,
      });
      if (error) throw new Error(`upload ${path}: ${error.message}`);
      urls.push(supabase.storage.from("listings").getPublicUrl(path).data.publicUrl);
    }
    if (!urls.length) { console.log(`  SKIP ${car.id} (no images downloadable)`); continue; }

    const slug = `${year}-${toSlug(meta.brand)}-${toSlug(meta.model)}-${Math.random().toString(36).slice(2, 8)}`;
    const row = {
      dealer_id: DEALER_ID, slug, status: "active", title,
      brand: meta.brand, model: meta.model, year,
      fuel_type: meta.fuel, transmission: meta.tr, km, color: null,
      city, district,
      damage_type: meta.types, damage_grade: meta.grade,
      damage_description: car.desc,
      has_tramer: meta.tramer !== 0, tramer_amount: meta.tramer || null,
      asking_price: price, is_price_negotiable: false,
      is_featured: meta.featured,
      featured_until: meta.featured ? new Date(Date.now() + 90 * 86400000).toISOString() : null,
      images: urls, primary_image: urls[0],
      locale: "tr", plate_hidden: true,
      expires_at: new Date(Date.now() + 90 * 86400000).toISOString(),
    };
    const cols = Object.keys(row);
    const res = await pool.query(
      `insert into public.hazaral_listings (${cols.join(", ")}) values (${cols.map((_, i) => `$${i + 1}`).join(", ")}) returning slug`,
      Object.values(row)
    );
    console.log(`  OK -> /ara/${res.rows[0].slug} (${urls.length} imgs)`);
  }

  // The site mirrors the store: any other HASARPARK listing still shown is hidden
  // as draft (404s, leaves the sitemap; reversible).
  for (const r of dealerRows) {
    if (matched.has(r.id) || !["active", "sold", "expired"].includes(r.status)) continue;
    console.log(`REMOVE ${r.title} (/ara/${r.slug}, ${r.status}) not on HASARPARK store`);
    if (APPLY) {
      await pool.query(
        `update public.hazaral_listings set status = 'draft', is_featured = false, featured_until = null, updated_at = now() where id = $1`,
        [r.id]
      );
    }
  }

  if (APPLY) {
    await pool.query(
      `update public.hazaral_dealers set total_listings = (select count(*) from public.hazaral_listings where dealer_id = $1 and status = 'active') where id = $1`,
      [DEALER_ID]
    );
  }
  console.log("\nDone.");
} catch (e) {
  console.error("FAILED:", e.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}

// Imports the HASARPARK sahibinden.com listings (extracted to JSON files) into
// Otograde: downloads x16 photos from the sahibinden CDN, uploads them to the
// "listings" storage bucket and inserts one active listing per car.
//
// Usage: node scripts/import_hasarpark.mjs <dir-with-car_*.json>
import { createClient } from "@supabase/supabase-js";
import pg from "pg";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const POSTGRES_URL = process.env.POSTGRES_URL;
const dir = process.argv[2];
if (!SUPABASE_URL || !SERVICE_KEY || !POSTGRES_URL || !dir) {
  console.error("Need env vars and data dir arg.");
  process.exit(1);
}

const DEALER_ID = "ea3d95ed-380f-45d6-a137-1fb7510b526d";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126.0 Safari/537.36";

// Normalized fields per sahibinden ilan no. Grade: A hafif, B orta, C ağır
// (şasi/airbag/çekme), D pert, E hurda — assigned from each ad's own text.
const CARS = {
  "1329075724": { brand: "Hyundai", model: "Accent 1.5", fuel: "lpg", tr: "otomatik", grade: "B", types: ["Motor Arızalı"], tramer: 8000, featured: false },
  "1328975808": { brand: "Skoda", model: "Elroq 60", fuel: "elektrik", tr: "otomatik", grade: "C", types: ["Kazalı", "Çekme Belgeli"], tramer: 2400000, featured: true },
  "1328967696": { brand: "Citroen", model: "Jumpy 2.0", fuel: "dizel", tr: "manuel", grade: "B", types: ["Motor Arızalı"], tramer: 6500, featured: false },
  "1324817612": { brand: "Renault", model: "Symbol 1.0 TCe", fuel: "benzin", tr: "manuel", grade: "B", types: ["Kazalı"], tramer: 37000, featured: false },
  "1324697555": { brand: "Fiat", model: "Egea 1.4 Urban Plus", fuel: "benzin", tr: "manuel", grade: "B", types: ["Kazalı"], tramer: 0, featured: false },
  "1324684223": { brand: "Kia", model: "Stonic 1.0 T-GDI", fuel: "benzin", tr: "manuel", grade: "B", types: ["Kazalı"], tramer: 70000, featured: true },
  "1328876638": { brand: "Peugeot", model: "301 1.5 Allure", fuel: "dizel", tr: "manuel", grade: "C", types: ["Kazalı", "Çekme Belgeli"], tramer: 12000, featured: false },
  "1331087860": { brand: "Chery", model: "Tiggo 8 Pro Excellent", fuel: "benzin", tr: "otomatik", grade: "B", types: ["Kazalı"], tramer: 0, featured: true },
  "1328321249": { brand: "Renault", model: "Laguna 2.0", fuel: "lpg", tr: "otomatik", grade: "C", types: ["Motor Arızalı", "Ağır Hasarlı"], tramer: null, featured: false },
  "1330870708": { brand: "Opel", model: "Corsa 1.3", fuel: "dizel", tr: "manuel", grade: "B", types: ["Kazalı"], tramer: 5000, featured: false },
  "1329921988": { brand: "Hyundai", model: "i20 1.4", fuel: "dizel", tr: "manuel", grade: "B", types: ["Kazalı"], tramer: 2000, featured: false },
  "1329474653": { brand: "Opel", model: "Astra 1.3", fuel: "dizel", tr: "manuel", grade: "D", types: ["Yanmış"], tramer: 5800, featured: false },
};

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const pool = new pg.Pool({ connectionString: POSTGRES_URL, ssl: { rejectUnauthorized: false } });

function toSlug(s) {
  return s.toLowerCase()
    .replaceAll("ı", "i").replaceAll("ö", "o").replaceAll("ü", "u")
    .replaceAll("ş", "s").replaceAll("ç", "c").replaceAll("ğ", "g")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

try {
  const files = readdirSync(dir).filter((f) => f.startsWith("car_") && f.endsWith(".json"));
  for (const f of files) {
    const car = JSON.parse(readFileSync(join(dir, f), "utf8"));
    const meta = CARS[car.id];
    if (!meta) { console.log(`SKIP ${car.id} (no mapping)`); continue; }

    const dupe = await pool.query(
      `select id from public.hazaral_listings where damage_description like $1 limit 1`,
      [`%[sahibinden:${car.id}]%`]
    );
    if (dupe.rows.length) { console.log(`SKIP ${car.id} (already imported)`); continue; }

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
    if (!urls.length) { console.log(`SKIP ${car.id} (no images downloadable)`); continue; }

    const year = parseInt(car.attrs["Yıl"], 10);
    const km = parseInt((car.attrs["KM"] || "0").replace(/\./g, ""), 10);
    const price = parseInt(car.price.replace(/[^\d]/g, ""), 10);
    const title = `${year} ${meta.brand} ${meta.model} — ${meta.types[0]}`;
    const slug = `${year}-${toSlug(meta.brand)}-${toSlug(meta.model)}-${Math.random().toString(36).slice(2, 8)}`;
    // The [sahibinden:<id>] tag makes re-runs idempotent and keeps provenance.
    const desc = `${car.desc}\n\n[sahibinden:${car.id}]`;

    const row = {
      dealer_id: DEALER_ID, slug, status: "active", title,
      brand: meta.brand, model: meta.model, year,
      fuel_type: meta.fuel, transmission: meta.tr, km, color: null,
      city: car.city || "İstanbul", district: car.city ? null : "Pendik",
      damage_type: meta.types, damage_grade: meta.grade,
      damage_description: desc,
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
    console.log(`OK ${car.id}: ${title} (${urls.length} imgs) -> /ara/${res.rows[0].slug}`);
  }
  await pool.query(
    `update public.hazaral_dealers set total_listings = (select count(*) from public.hazaral_listings where dealer_id = $1) where id = $1`,
    [DEALER_ID]
  );
  console.log("\nDone.");
} catch (e) {
  console.error("FAILED:", e.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}

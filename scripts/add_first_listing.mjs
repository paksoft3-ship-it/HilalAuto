// One-off: uploads the Mercedes E 200d photos to the "listings" storage bucket
// and creates the first real listing for the Otograde house dealer.
// Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY + POSTGRES_URL from env.
//
// Usage: node scripts/add_first_listing.mjs <images-dir>
import { createClient } from "@supabase/supabase-js";
import pg from "pg";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const POSTGRES_URL = process.env.POSTGRES_URL;
const dir = process.argv[2];
if (!SUPABASE_URL || !SERVICE_KEY || !POSTGRES_URL || !dir) {
  console.error("Need NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, POSTGRES_URL env vars and an images dir arg.");
  process.exit(1);
}

const DEALER_ID = "ea3d95ed-380f-45d6-a137-1fb7510b526d"; // Otograde house dealer
const COVER = "WhatsApp Image 2026-08-03 at 12.20.45.jpeg"; // side profile, full car visible

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const pool = new pg.Pool({ connectionString: POSTGRES_URL, ssl: { rejectUnauthorized: false } });

function toSlug(s) {
  return s.toLowerCase()
    .replaceAll("ı", "i").replaceAll("ö", "o").replaceAll("ü", "u")
    .replaceAll("ş", "s").replaceAll("ç", "c").replaceAll("ğ", "g")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

try {
  const files = readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
  if (!files.includes(COVER)) throw new Error(`Cover file not found: ${COVER}`);
  // Cover first so it is images[0]
  const ordered = [COVER, ...files.filter((f) => f !== COVER)];

  // REUSE_FOLDER lets a re-run skip uploading when the photos are already in storage.
  const folder = process.env.REUSE_FOLDER || `listing-${Date.now().toString(36)}`;
  const urls = [];
  for (let i = 0; i < ordered.length; i++) {
    const path = `${DEALER_ID}/${folder}/${String(i + 1).padStart(2, "0")}.jpeg`;
    if (!process.env.REUSE_FOLDER) {
      const buf = readFileSync(join(dir, ordered[i]));
      const { error } = await supabase.storage.from("listings").upload(path, buf, {
        contentType: "image/jpeg",
        upsert: false,
      });
      if (error) throw new Error(`upload ${ordered[i]}: ${error.message}`);
      console.log(`uploaded ${i + 1}/${ordered.length}: ${path}`);
    }
    const { data } = supabase.storage.from("listings").getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  const year = 2022, brand = "Mercedes-Benz", model = "E 200d Exclusive";
  const slug = `${year}-${toSlug(brand)}-${toSlug(model)}-${Math.random().toString(36).slice(2, 8)}`;

  const row = {
    dealer_id: DEALER_ID,
    slug,
    status: "active",
    title: `${year} ${brand} ${model} — Kazalı`,
    brand, model, year,
    fuel_type: "dizel",
    transmission: "otomatik",
    km: 80000,
    color: "Siyah",
    city: "İstanbul",
    district: null,
    damage_type: ["Kazalı"],
    damage_grade: "C",
    damage_description:
      "2022 model Mercedes-Benz E 200d Exclusive, 80.000 km. Muayenesi mevcut, ağır pert kaydı yok. " +
      "Hasar kaydı (tramer): 2.330.000 TL. Ön kısım hasarlı, hava yastıkları açılmıştır; iç mekân ve arka bölüm temiz durumda. " +
      "Araç İstanbul'da yerinde görülebilir, İstanbul teslim fiyatıdır.",
    has_tramer: true,
    tramer_amount: 2330000,
    asking_price: 2615000,
    is_price_negotiable: false,
    is_featured: true,
    featured_until: new Date(Date.now() + 90 * 86400000).toISOString(),
    images: urls,
    primary_image: urls[0],
    locale: "tr",
    plate_hidden: true,
    expires_at: new Date(Date.now() + 90 * 86400000).toISOString(),
  };

  const cols = Object.keys(row);
  const vals = Object.values(row);
  const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
  const res = await pool.query(
    `insert into public.hazaral_listings (${cols.join(", ")}) values (${placeholders}) returning id, slug`,
    vals
  );
  await pool.query(
    `update public.hazaral_dealers set total_listings = total_listings + 1 where id = $1`,
    [DEALER_ID]
  );
  console.log(`\nListing created: ${res.rows[0].id}`);
  console.log(`URL: https://otograde.com/ara/${res.rows[0].slug}`);
} catch (e) {
  console.error("FAILED:", e.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}

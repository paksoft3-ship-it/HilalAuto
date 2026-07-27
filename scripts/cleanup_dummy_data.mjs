// Purges ALL dummy/seed data before go-live:
//   - the 20 seeded marketplace listings + the "Dummy Galeri" dealer + its auth user
//   - the 20 seeded legacy hazaral_cars rows (dummy image paths)
//
// Usage:
//   export $(grep '^POSTGRES_URL=' .env.local | head -1)
//   node scripts/cleanup_dummy_data.mjs           # dry run — shows what would be deleted
//   node scripts/cleanup_dummy_data.mjs --apply   # actually deletes
import pg from 'pg';

const url = process.env.POSTGRES_URL;
if (!url) { console.error('POSTGRES_URL env var is required.'); process.exit(1); }

const APPLY = process.argv.includes('--apply');
const pool = new pg.Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });

try {
  const dealers = await pool.query(
    `select id, user_id, company_name from public.hazaral_dealers where email = 'dummy@dealer.com' or company_name = 'Dummy Galeri'`
  );
  const listings = await pool.query(
    `select count(*)::int as n from public.hazaral_listings where primary_image like '/images/cars/%' or dealer_id = any($1::uuid[])`,
    [dealers.rows.map(d => d.id)]
  );
  const cars = await pool.query(
    `select count(*)::int as n from public.hazaral_cars where images[1] like '/images/cars/%'`
  );

  console.log(`Dummy dealers found : ${dealers.rows.length} (${dealers.rows.map(d => d.company_name).join(', ') || '-'})`);
  console.log(`Dummy listings      : ${listings.rows[0].n}`);
  console.log(`Dummy legacy cars   : ${cars.rows[0].n}`);

  if (!APPLY) {
    console.log('\nDry run only. Re-run with --apply to delete.');
    process.exit(0);
  }

  await pool.query('begin');
  const delListings = await pool.query(
    `delete from public.hazaral_listings where primary_image like '/images/cars/%' or dealer_id = any($1::uuid[])`,
    [dealers.rows.map(d => d.id)]
  );
  const delCars = await pool.query(
    `delete from public.hazaral_cars where images[1] like '/images/cars/%'`
  );
  const delDealers = await pool.query(
    `delete from public.hazaral_dealers where id = any($1::uuid[])`,
    [dealers.rows.map(d => d.id)]
  );
  for (const d of dealers.rows) {
    // only remove the auth user if it is the dedicated dummy account
    await pool.query(`delete from auth.users where id = $1 and email = 'dummy@dealer.com'`, [d.user_id]);
  }
  await pool.query('commit');

  console.log(`\nDeleted: ${delListings.rowCount} listings, ${delCars.rowCount} legacy cars, ${delDealers.rowCount} dealers.`);
  console.log('Done. Also remove public/images/cars/*.png from the repo if still present.');
} catch (e) {
  await pool.query('rollback').catch(() => {});
  console.error('FAILED:', e.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}

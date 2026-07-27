// Creates the "Otograde" house dealer account so the owner can upload real cars
// through the dealer wizard (/bayi-paneli/ilan-ekle) with the existing admin login.
//
// Usage:
//   export $(grep '^POSTGRES_URL=' .env.local | head -1)
//   node scripts/create_house_dealer.mjs [email]     # default: paksoft3@gmail.com
import pg from 'pg';

const url = process.env.POSTGRES_URL;
if (!url) { console.error('POSTGRES_URL env var is required.'); process.exit(1); }

const email = process.argv[2] || 'paksoft3@gmail.com';
const pool = new pg.Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });

try {
  const user = await pool.query(`select id from auth.users where email = $1`, [email]);
  if (!user.rows.length) {
    console.error(`No auth user found for ${email}. Sign up / log in once at /admin/login first, then re-run.`);
    process.exit(1);
  }
  const userId = user.rows[0].id;

  const existing = await pool.query(`select id, company_name from public.hazaral_dealers where user_id = $1`, [userId]);
  if (existing.rows.length) {
    console.log(`Dealer already exists for ${email}: ${existing.rows[0].company_name} (${existing.rows[0].id})`);
    process.exit(0);
  }

  const res = await pool.query(
    `insert into public.hazaral_dealers
       (user_id, company_name, contact_name, phone, whatsapp, email, city, slug, description,
        subscription_status, subscription_plan, subscription_start, subscription_end,
        is_approved, is_verified)
     values
       ($1, 'Otograde', 'Otograde', '+90 552 567 71 64', '905525677164', $2, 'İstanbul',
        'otograde', 'Otograde — hasarlı araç alım satım platformunun kurumsal satış hesabı.',
        'active', 'premium', now(), now() + interval '10 years',
        true, true)
     returning id`,
    [userId, email]
  );
  console.log(`Created house dealer "Otograde" (${res.rows[0].id}) for ${email}.`);
  console.log('You can now add listings at /bayi-paneli/ilan-ekle with that login.');
} catch (e) {
  console.error('FAILED:', e.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}

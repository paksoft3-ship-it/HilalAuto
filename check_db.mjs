import pg from 'pg';

const connectionString = "postgres://postgres.hgkvzlwwisuijygzpmbr:aLv4kR3h82MX9cVp@aws-1-eu-central-1.pooler.supabase.com:5432/postgres";

const pool = new pg.Pool({
  connectionString,
});

async function run() {
  try {
    const res = await pool.query('SELECT slug, status, locale FROM public.hazaral_blogs');
    console.log("Blogs in DB:", res.rows);
  } catch (err) {
    console.error("Error reading blogs:", err);
  } finally {
    await pool.end();
  }
}

run();

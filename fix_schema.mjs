import pg from 'pg';
const pool = new pg.Pool({
  connectionString: "postgres://postgres.hgkvzlwwisuijygzpmbr:aLv4kR3h82MX9cVp@aws-1-eu-central-1.pooler.supabase.com:5432/postgres",
});
async function fix() {
  await pool.query(`GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;`);
  await pool.query(`NOTIFY pgrst, 'reload schema';`);
  console.log("Schema permissions granted.");
  await pool.end();
}
fix();

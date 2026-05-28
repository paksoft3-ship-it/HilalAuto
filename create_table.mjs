import pg from 'pg';

const connectionString = "postgres://postgres.hgkvzlwwisuijygzpmbr:aLv4kR3h82MX9cVp@aws-1-eu-central-1.pooler.supabase.com:5432/postgres";

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const res = await pool.query(`
      CREATE TABLE IF NOT EXISTS public.hazaral_blogs (
        id uuid default gen_random_uuid() primary key,
        title text not null,
        slug text not null unique,
        excerpt text,
        content text not null,
        image_url text,
        locale text default 'tr' check (locale in ('tr', 'en')),
        status text default 'draft' check (status in ('draft', 'published')),
        created_at timestamp with time zone default timezone('utc'::text, now()) not null,
        updated_at timestamp with time zone default timezone('utc'::text, now()) not null
      );
      GRANT ALL ON TABLE public.hazaral_blogs TO anon, authenticated, service_role;
      NOTIFY pgrst, 'reload schema';
    `);
    console.log("Table creation result:", res);
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    await pool.end();
  }
}

run();

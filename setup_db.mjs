import fs from 'fs';
import pg from 'pg';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectionString = "postgres://postgres.hgkvzlwwisuijygzpmbr:aLv4kR3h82MX9cVp@aws-1-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require";

// Use sslmode=require and rejectUnauthorized: false to bypass self-signed cert issue in Node
const pool = new pg.Pool({ 
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function runSchema() {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS public.hazaral_leads (
        id uuid default gen_random_uuid() primary key,
        brand text,
        model_year text,
        damage_type text,
        city text,
        phone text not null,
        source text default 'quick_quote',
        status text default 'new' check (status in ('new', 'contacted', 'closed')),
        created_at timestamp with time zone default timezone('utc'::text, now()) not null
      );
      
      ALTER TABLE public.hazaral_leads ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Anyone can insert leads" ON public.hazaral_leads;
      CREATE POLICY "Anyone can insert leads" on public.hazaral_leads for insert with check (true);
      
      DROP POLICY IF EXISTS "Admins can view leads" ON public.hazaral_leads;
      CREATE POLICY "Admins can view leads" on public.hazaral_leads for select using (auth.role() = 'authenticated');
      
      DROP POLICY IF EXISTS "Admins can update leads" ON public.hazaral_leads;
      CREATE POLICY "Admins can update leads" on public.hazaral_leads for update using (auth.role() = 'authenticated');
    `;
    console.log("Executing hazaral_leads schema...");
    await pool.query(sql);
    console.log("hazaral_leads successfully created!");
  } catch(e) {
    console.error("DB Error:", e);
  } finally {
    pool.end();
  }
}

runSchema();

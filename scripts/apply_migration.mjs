// Usage: node scripts/apply_migration.mjs supabase/migrations/006_storage_bucket.sql
// Reads POSTGRES_URL from the environment (source it from .env.local).
import pg from 'pg';
import fs from 'fs';

const url = process.env.POSTGRES_URL;
if (!url) {
  console.error('POSTGRES_URL env var is required.');
  console.error("Run: export $(grep '^POSTGRES_URL=' .env.local | head -1) && node scripts/apply_migration.mjs <file.sql>");
  process.exit(1);
}

const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/apply_migration.mjs <file.sql>'); process.exit(1); }

const pool = new pg.Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
try {
  await pool.query(fs.readFileSync(file, 'utf8'));
  console.log('Applied:', file);
} catch (e) {
  console.error('FAILED:', e.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}

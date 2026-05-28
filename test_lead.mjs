import pg from 'pg';

const connectionString = "postgres://postgres.hgkvzlwwisuijygzpmbr:aLv4kR3h82MX9cVp@aws-1-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require";

const pool = new pg.Pool({ connectionString });

async function checkLeads() {
  try {
    const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'hazaral_leads'");
    console.log("Columns:", res.rows);
    
    // Try to insert
    const leadData = {
      brand: "Test Toyota",
      model_year: "2020",
      damage_type: "Test Hasar",
      city: "Test City",
      phone: "5551234567",
      source: "quick_quote",
      status: "new",
    };
    
    const insert = await pool.query(`
      INSERT INTO hazaral_leads (brand, model_year, damage_type, city, phone, source, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `, [leadData.brand, leadData.model_year, leadData.damage_type, leadData.city, leadData.phone, leadData.source, leadData.status]);
    
    console.log("Insert success:", insert.rows[0]);
  } catch(e) {
    console.error("DB Error:", e);
  } finally {
    pool.end();
  }
}

checkLeads();

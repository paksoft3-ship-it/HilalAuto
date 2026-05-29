import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hgkvzlwwisuijygzpmbr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhna3Z6bHd3aXN1aWp5Z3pwbWJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDg1OTM0MSwiZXhwIjoyMDkwNDM1MzQxfQ.969ououEg-o-u6vAE5Y3xdbuhjmRP0OXZtTDaEzWCIU"; // Service role key from .env.local

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const leadData = {
    brand: "Test Toyota",
    model_year: "2025",
    damage_type: "Pert",
    city: "Istanbul",
    phone: "+905525677164",
    source: "quick_quote",
    status: "new",
  };

  console.log("Attempting to insert:", leadData);

  const { data, error } = await supabaseAdmin
    .from("hazaral_leads")
    .insert([leadData])
    .select()
    .single();

  if (error) {
    console.error("Insert Error:", error);
  } else {
    console.log("Insert Success:", data);
  }
}

testInsert();

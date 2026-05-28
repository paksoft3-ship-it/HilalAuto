import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from("hazaral_blogs")
    .select("*")
    .eq("status", "published")
    .eq("locale", "tr")
    .order("created_at", { ascending: false });
    
  console.log("Data:", data);
  console.log("Error:", error);
}

test();

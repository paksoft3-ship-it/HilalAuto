import { createClient } from "@supabase/supabase-js";

// Make sure these are defined in your .env or .env.local file
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy";

export const supabase = createClient(supabaseUrl, supabaseKey);

// For admin operations that bypass RLS (server-side only)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey
);

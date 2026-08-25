import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "public-anon-key-placeholder";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  { auth: { persistSession: false } }
);

// Placeholder until the dashboard provisions this store and issues a real
// UUID. Every query in src/lib/supabase MUST filter by this — there is no
// database-level tenant enforcement on the shared tables.
export const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "";

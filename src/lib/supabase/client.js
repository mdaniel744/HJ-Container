import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Placeholder until the dashboard provisions this store and issues a real
// UUID. Every query in src/lib/supabase MUST filter by this — there is no
// database-level tenant enforcement on the shared tables.
export const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "";

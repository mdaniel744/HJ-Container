import { supabase, STORE_ID } from "./client";

// Only these 3 columns are readable on `stores` — everything else 401s by
// design. Don't try to read domain/settings from this table.
export async function getStoreLocaleInfo() {
  const { data, error } = await supabase
    .from("stores")
    .select("id, enabled_locales, google_content_language")
    .eq("id", STORE_ID)
    .maybeSingle();

  if (error) {
    console.warn("getStoreLocaleInfo failed:", error.message);
    return null;
  }
  return data;
}

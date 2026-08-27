import { supabase, STORE_ID } from "./client";
import { SOURCE_LOCALE, fetchTranslations, overlayTranslation } from "./translations";

// Proposed table, not yet created by the dashboard — queries against it
// fail gracefully (empty array) exactly like every other table here does
// before its data exists, so this is safe to call ahead of the migration.
const TRANSLATABLE_FIELDS = ["name", "description"];

export async function getFamilies(locale = SOURCE_LOCALE) {
  const { data, error } = await supabase.from("product_families").select("*").eq("store_id", STORE_ID);
  if (error) {
    console.warn("getFamilies failed:", error.message);
    return [];
  }
  const rows = data || [];
  if (locale === SOURCE_LOCALE || !rows.length) return rows;

  const translations = await fetchTranslations("product_family", rows.map((r) => r.id), locale);
  return rows.map((row) => overlayTranslation(row, translations, TRANSLATABLE_FIELDS));
}

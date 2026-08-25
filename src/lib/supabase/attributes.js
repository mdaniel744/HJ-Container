import { supabase, STORE_ID } from "./client";
import { SOURCE_LOCALE, fetchTranslations, overlayTranslation } from "./translations";

// Operator-defined vocabulary for filters/facets. Never hardcode attribute
// names or values — always read them live for this store. Attribute names
// translate via entity_type "attribute_name" (field_name "name"), and
// attribute values via entity_type "attribute_value" (field_name "value"),
// each keyed by the definition row's own id — not by matching the raw
// string, which is why product.attributes JSON alone can't be translated.
export async function getAttributes(locale = SOURCE_LOCALE) {
  const { data, error } = await supabase.from("attributes").select("*").eq("store_id", STORE_ID);
  if (error) {
    console.warn("getAttributes failed:", error.message);
    return [];
  }
  const rows = data || [];
  if (locale === SOURCE_LOCALE || !rows.length) return rows;
  const translations = await fetchTranslations("attribute_name", rows.map((r) => r.id), locale);
  return rows.map((row) => overlayTranslation(row, translations, ["name"]));
}

// `attribute_values` has no store_id column of its own — it's scoped
// through its parent attribute (attribute_id -> attributes.id), so this
// needs that store's attribute ids first, not a direct store_id filter.
export async function getAttributeValues(locale = SOURCE_LOCALE, attributeIds) {
  const ids = attributeIds ?? (await getAttributes(SOURCE_LOCALE)).map((a) => a.id);
  if (!ids.length) return [];

  const { data, error } = await supabase.from("attribute_values").select("*").in("attribute_id", ids);
  if (error) {
    console.warn("getAttributeValues failed:", error.message);
    return [];
  }
  const rows = data || [];
  if (locale === SOURCE_LOCALE || !rows.length) return rows;
  const translations = await fetchTranslations("attribute_value", rows.map((r) => r.id), locale);
  return rows.map((row) => overlayTranslation(row, translations, ["value"]));
}

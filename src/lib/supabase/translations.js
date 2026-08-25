import { supabase, STORE_ID } from "./client";

// The storefront's source language. Source-locale pages read the base row
// directly; every other locale overlays translations onto it.
export const SOURCE_LOCALE = "da";

/**
 * Fetches every translation row for a set of entities/locale and returns a
 * lookup of `${entityId}:${fieldName}` -> value.
 */
export async function fetchTranslations(entityType, entityIds, locale) {
  const map = new Map();
  if (!entityIds.length || locale === SOURCE_LOCALE) return map;

  const { data, error } = await supabase
    .from("translations")
    .select("entity_id, field_name, value")
    .eq("store_id", STORE_ID)
    .eq("entity_type", entityType)
    .eq("locale", locale)
    .in("entity_id", entityIds);

  if (error) {
    console.warn(`translations fetch failed for ${entityType}/${locale}:`, error.message);
    return map;
  }
  for (const row of data || []) {
    map.set(`${row.entity_id}:${row.field_name}`, row.value);
  }
  return map;
}

/**
 * Overlays translated values onto a base row for the given fields. Any
 * field/locale combination missing a translation row silently falls back to
 * the row's own base value — that's the normal steady state, not an error.
 */
export function overlayTranslation(row, translationsMap, fields) {
  const next = { ...row };
  for (const field of fields) {
    const value = translationsMap.get(`${row.id}:${field}`);
    if (value !== undefined && value !== null && value !== "") next[field] = value;
  }
  return next;
}

/**
 * Resolves a requested slug to an entity id for a non-source locale, since
 * per-locale slugs live in translations (field_name: "slug"), not on the
 * base row.
 */
export async function findEntityIdByTranslatedSlug(entityType, slug, locale) {
  const { data, error } = await supabase
    .from("translations")
    .select("entity_id")
    .eq("store_id", STORE_ID)
    .eq("entity_type", entityType)
    .eq("field_name", "slug")
    .eq("locale", locale)
    .eq("value", slug)
    .maybeSingle();

  if (error) {
    console.warn(`slug translation lookup failed for ${entityType}/${locale}:`, error.message);
    return null;
  }
  return data?.entity_id || null;
}

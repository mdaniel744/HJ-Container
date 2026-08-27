import { supabase, STORE_ID } from "./client";
import { SOURCE_LOCALE, fetchTranslations, overlayTranslation, findEntityIdByTranslatedSlug } from "./translations";

// Every text field that can carry a translation row. Deliberately excludes
// "slug": callers rely on product.slug always being the stable source-locale
// value (see getProductBySlug's fallback below and Product.jsx's alt-language
// link), so it must never get silently overlaid by a translated value.
// "description" and "short_description" also carry rich-text HTML on the
// source row — see src/components/RichText.jsx for rendering.
const TRANSLATABLE_FIELDS = ["name", "description", "short_description", "badge"];

/**
 * Full active catalogue for this store, in the given locale.
 */
export async function getProducts(locale = SOURCE_LOCALE) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", STORE_ID)
    .eq("status", "active");

  if (error) {
    console.warn("getProducts failed:", error.message);
    return [];
  }
  const rows = data || [];
  if (locale === SOURCE_LOCALE || !rows.length) return rows;

  const translations = await fetchTranslations("product", rows.map((r) => r.id), locale);
  return rows.map((row) => overlayTranslation(row, translations, TRANSLATABLE_FIELDS));
}

/**
 * A single active product by slug. For non-source locales the slug is
 * resolved through the translations table first, since per-locale slugs
 * aren't columns on the base row.
 */
export async function getProductBySlug(slug, locale = SOURCE_LOCALE) {
  let query = supabase.from("products").select("*").eq("store_id", STORE_ID).eq("status", "active");

  if (locale === SOURCE_LOCALE) {
    query = query.eq("slug", slug);
  } else {
    const entityId = await findEntityIdByTranslatedSlug("product", slug, locale);
    // No translated slug yet for this locale — fall back to treating the
    // requested slug as the source-locale one, so a product stays reachable
    // under a non-source URL before anyone has translated it.
    query = entityId ? query.eq("id", entityId) : query.eq("slug", slug);
  }

  const { data, error } = await query.maybeSingle();
  if (error) {
    console.warn("getProductBySlug failed:", error.message);
    return null;
  }
  if (!data) return null;
  if (locale === SOURCE_LOCALE) return data;

  const translations = await fetchTranslations("product", [data.id], locale);
  return overlayTranslation(data, translations, TRANSLATABLE_FIELDS);
}

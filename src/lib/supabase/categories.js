import { supabase, STORE_ID } from "./client";
import { SOURCE_LOCALE, fetchTranslations, overlayTranslation, findEntityIdByTranslatedSlug } from "./translations";

// Deliberately excludes "slug" — see the matching note in
// src/lib/supabase/products.js; category.slug must stay the stable
// source-locale value. "description" carries rich-text HTML on the source
// row — see src/components/RichText.jsx for rendering.
const TRANSLATABLE_FIELDS = ["name", "description", "meta_title", "meta_description"];

export async function getCategories(locale = SOURCE_LOCALE) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("store_id", STORE_ID)
    .order("display_order", { ascending: true });

  if (error) {
    console.warn("getCategories failed:", error.message);
    return [];
  }
  const rows = data || [];
  if (locale === SOURCE_LOCALE || !rows.length) return rows;

  const translations = await fetchTranslations("category", rows.map((r) => r.id), locale);
  return rows.map((row) => overlayTranslation(row, translations, TRANSLATABLE_FIELDS));
}

export async function getCategoryBySlug(slug, locale = SOURCE_LOCALE) {
  let query = supabase.from("categories").select("*").eq("store_id", STORE_ID);

  if (locale === SOURCE_LOCALE) {
    query = query.eq("slug", slug);
  } else {
    const entityId = await findEntityIdByTranslatedSlug("category", slug, locale);
    query = entityId ? query.eq("id", entityId) : query.eq("slug", slug);
  }

  const { data, error } = await query.maybeSingle();
  if (error) {
    console.warn("getCategoryBySlug failed:", error.message);
    return null;
  }
  if (!data) return null;
  if (locale === SOURCE_LOCALE) return data;

  const translations = await fetchTranslations("category", [data.id], locale);
  return overlayTranslation(data, translations, TRANSLATABLE_FIELDS);
}

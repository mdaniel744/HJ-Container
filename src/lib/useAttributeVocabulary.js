import { useQuery } from "@tanstack/react-query";
import { STORE_ID } from "@/lib/supabase/client";
import { getAttributes as getSupabaseAttributes, getAttributeValues as getSupabaseAttributeValues } from "@/lib/supabase/attributes";
import { SOURCE_LOCALE } from "@/lib/supabase/translations";
import { ATTRIBUTES, ATTRIBUTE_VALUES } from "@/data/attributes";
import { localizeRow } from "@/lib/localize";

function localAttrs(locale) {
  return ATTRIBUTES.map((a) => localizeRow(a, locale, ["name"]));
}
function localAttrValues(locale) {
  return ATTRIBUTE_VALUES.map((v) => localizeRow(v, locale, ["value"]));
}

function useAttrDefs(locale) {
  return useQuery({
    queryKey: ["attr-defs", STORE_ID, locale],
    queryFn: () => (STORE_ID ? getSupabaseAttributes(locale) : Promise.resolve(localAttrs(locale))),
  });
}
// attribute_values has no store_id of its own — it's scoped through its
// parent attribute (attribute_id), so this needs that store's attribute ids
// first (see src/lib/supabase/attributes.js).
function useAttrValueDefs(locale, attributeIds) {
  return useQuery({
    queryKey: ["attr-value-defs", STORE_ID, locale, attributeIds],
    queryFn: () => (STORE_ID ? getSupabaseAttributeValues(locale, attributeIds) : Promise.resolve(localAttrValues(locale))),
    enabled: !STORE_ID || attributeIds !== undefined,
  });
}

/**
 * Resolves raw product.attributes JSON (always authored in the source
 * locale) against the attributes/attribute_values definition tables, so
 * labels and values can be shown translated. A translation for a value
 * lives on the *definition row's own id*, not on the raw string — so
 * matching goes through the source-locale definitions to find the id, then
 * reads the display-locale definitions for the translated text. Falls back
 * to the raw JSON key/value when nothing matches (unknown vocabulary, or no
 * translation row yet) — never blank.
 */
export function useAttributeVocabulary(locale = SOURCE_LOCALE) {
  const sourceAttrsQuery = useAttrDefs(SOURCE_LOCALE);
  const displayAttrsQuery = useAttrDefs(locale);
  const sourceAttrIds = sourceAttrsQuery.data?.map((a) => a.id);
  const sourceValuesQuery = useAttrValueDefs(SOURCE_LOCALE, sourceAttrIds);
  const displayValuesQuery = useAttrValueDefs(locale, sourceAttrIds);

  const sourceAttrs = sourceAttrsQuery.data || [];
  const displayAttrs = displayAttrsQuery.data || [];
  const sourceValues = sourceValuesQuery.data || [];
  const displayValues = displayValuesQuery.data || [];

  const displayNameById = new Map(displayAttrs.map((a) => [a.id, a.name]));
  const attrBySourceName = new Map(sourceAttrs.map((a) => [a.name, a]));
  const displayValueById = new Map(displayValues.map((v) => [v.id, v.value]));
  const valueByAttrAndSourceValue = new Map(sourceValues.map((v) => [`${v.attribute_id}:${v.value}`, v]));

  // Every filterable facet the store defines, with resolved labels — built
  // from the definition tables so the facet list is complete up front, not
  // just facets that happen to appear on the currently loaded products.
  const facetDefinitions = sourceAttrs
    .map((a) => ({
      key: a.name,
      label: displayNameById.get(a.id) || a.name,
      values: sourceValues
        .filter((v) => v.attribute_id === a.id)
        .map((v) => ({ raw: v.value, label: displayValueById.get(v.id) || v.value })),
    }))
    .filter((f) => f.values.length > 0);

  function resolve(rawKey, rawValue) {
    const attr = attrBySourceName.get(rawKey);
    if (!attr) return { label: rawKey, value: String(rawValue) };
    const label = displayNameById.get(attr.id) || attr.name;
    const valueDef = valueByAttrAndSourceValue.get(`${attr.id}:${rawValue}`);
    const value = valueDef ? displayValueById.get(valueDef.id) || valueDef.value : String(rawValue);
    return { label, value };
  }

  return {
    facetDefinitions,
    resolve,
    isLoading: sourceAttrsQuery.isLoading || displayAttrsQuery.isLoading || sourceValuesQuery.isLoading || displayValuesQuery.isLoading,
  };
}

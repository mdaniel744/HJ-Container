// Resolves a bilingual-authored local row (fields suffixed _da/_en) into the
// flat, single-field shape Supabase returns after translation overlay — so
// every consuming component works the same whether data came from Supabase
// or the local fallback dataset.
export function localizeRow(row, locale, fields) {
  const out = { ...row };
  for (const field of fields) {
    out[field] = row[`${field}_${locale}`] || row[`${field}_da`] || "";
  }
  return out;
}

// Attribute vocabulary is fully custom per store, and raw product.attributes
// JSON keys are always authored in the source locale — this only exists
// because a handful of storefront features (delivery estimate, size shop
// shortcut) need *some* signal for "size" until there's a reliable way to
// know the operator's actual key name. Best-effort only: returns null
// rather than guessing wrong. Use resolve() (useAttributeVocabulary) to get
// a translated display value once you have the raw key/value.
export function findAttributeEntry(attributes, candidateKeys) {
  if (!attributes) return null;
  const lower = Object.fromEntries(Object.entries(attributes).map(([k, v]) => [k.toLowerCase(), [k, v]]));
  for (const key of candidateKeys) {
    const entry = lower[key.toLowerCase()];
    if (entry && entry[1]) return { key: entry[0], value: entry[1] };
  }
  return null;
}

export function findAttribute(attributes, candidateKeys) {
  return findAttributeEntry(attributes, candidateKeys)?.value ?? null;
}

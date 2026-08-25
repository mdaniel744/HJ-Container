import React from "react";
import { L } from "@/lib/i18n";

function Group({ title, children }) {
  return (
    <div className="border-b border-slate-200 py-5">
      <p className="hjc-label mb-3">{title}</p>
      {children}
    </div>
  );
}

// Facets come from the attributes/attribute_values definition tables
// (useAttributeVocabulary) — the full set the store defines, with
// translated labels, not just what happens to appear on loaded products.
export default function ShopFilters({ lang, filters, setFilters, categories, facetDefinitions, maxPrice }) {
  const toggleCategory = (id) => {
    const list = filters.category || [];
    setFilters({ ...filters, category: list.includes(id) ? list.filter((v) => v !== id) : [...list, id] });
  };

  const toggleAttr = (key, rawValue) => {
    const list = filters.attrs[key] || [];
    setFilters({
      ...filters,
      attrs: { ...filters.attrs, [key]: list.includes(rawValue) ? list.filter((v) => v !== rawValue) : [...list, rawValue] },
    });
  };

  return (
    <div>
      {categories && categories.length > 0 && (
        <Group title={L(lang, "Kategori", "Category")}>
          {categories.map((c) => (
            <label key={c.id} className="flex items-center gap-2.5 py-1.5 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" checked={(filters.category || []).includes(c.id)} onChange={() => toggleCategory(c.id)} />
              {c.name}
            </label>
          ))}
        </Group>
      )}

      {facetDefinitions.map((facet) => (
        <Group key={facet.key} title={facet.label}>
          {facet.values.map((v) => (
            <label key={v.raw} className="flex items-center gap-2.5 py-1.5 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" checked={(filters.attrs[facet.key] || []).includes(v.raw)} onChange={() => toggleAttr(facet.key, v.raw)} />
              {v.label}
            </label>
          ))}
        </Group>
      ))}

      <Group title={L(lang, "Maksimal pris (inkl. moms)", "Maximum price (incl. VAT)")}>
        <input
          type="range" min="0" max={maxPrice} step="1000"
          value={filters.maxPrice ?? maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full"
          aria-label={L(lang, "Maksimal pris", "Maximum price")}
        />
        <p className="hjc-mono text-[11px] text-slate-500 mt-1">
          {(filters.maxPrice ?? maxPrice).toLocaleString(lang === "en" ? "en-DK" : "da-DK")} DKK
        </p>
      </Group>
    </div>
  );
}

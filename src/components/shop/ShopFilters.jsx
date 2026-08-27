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

function Check({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2.5 py-1.5 text-sm text-slate-700 cursor-pointer">
      <input type="checkbox" className="w-4 h-4" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

// facetDefinitions (from useAttributeVocabulary) drives the type/size/
// condition/colour groups — whatever categorical attributes this store has
// defined, translated. Dimension/weight fields have no predefined values so
// they never appear here (see src/lib/useAttributeVocabulary.js).
export default function ShopFilters({ lang, filters, setFilters, categories, facetDefinitions, maxPrice }) {
  const toggleCategory = (id) => {
    const list = filters.category;
    setFilters({ ...filters, category: list.includes(id) ? list.filter((v) => v !== id) : [...list, id] });
  };
  const toggleAttr = (key, value) => {
    const list = filters.attrs[key] || [];
    setFilters({
      ...filters,
      attrs: { ...filters.attrs, [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] },
    });
  };
  const toggleAvailability = () => {
    setFilters({ ...filters, availability: filters.availability.includes("in_stock") ? [] : ["in_stock"] });
  };

  return (
    <div>
      {categories.length > 0 && (
        <Group title={L(lang, "Containertype", "Container type")}>
          {categories.map((c) => (
            <Check key={c.id} checked={filters.category.includes(c.id)} onChange={() => toggleCategory(c.id)} label={c.name} />
          ))}
        </Group>
      )}
      {facetDefinitions.map((facet) => (
        <Group key={facet.key} title={facet.label}>
          {facet.values.map((v) => (
            <Check
              key={v.raw}
              checked={(filters.attrs[facet.key] || []).includes(v.raw)}
              onChange={() => toggleAttr(facet.key, v.raw)}
              label={v.label}
            />
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
      <Group title={L(lang, "Tilgængelighed", "Availability")}>
        <Check checked={filters.availability.includes("in_stock")} onChange={toggleAvailability} label={L(lang, "På lager", "In stock")} />
      </Group>
    </div>
  );
}

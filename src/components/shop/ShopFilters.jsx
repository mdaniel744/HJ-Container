import React from "react";
import { L } from "@/lib/i18n";
import { CATEGORY_LABEL } from "@/lib/routes";
import { CONDITION_LABEL } from "@/lib/i18n";

function Group({ title, children }) {
  return (
    <div className="border-b border-slate-200 py-5">
      <p className="hjc-label mb-3">{title}</p>
      {children}
    </div>
  );
}

export default function ShopFilters({ lang, filters, setFilters, colors, maxPrice }) {
  const toggle = (key, value) => {
    const list = filters[key] || [];
    setFilters({ ...filters, [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] });
  };

  const check = (key, value, label) => (
    <label key={value} className="flex items-center gap-2.5 py-1.5 text-sm text-slate-700 cursor-pointer">
      <input type="checkbox" className="w-4 h-4" checked={(filters[key] || []).includes(value)} onChange={() => toggle(key, value)} />
      {label}
    </label>
  );

  return (
    <div>
      <Group title={L(lang, "Containertype", "Container type")}>
        {["standard", "high_cube", "open_side"].map((c) => check("category", c, CATEGORY_LABEL[c][lang]))}
      </Group>
      <Group title={L(lang, "Størrelse", "Size")}>
        {["10ft", "20ft", "40ft"].map((s) => check("size", s, s))}
      </Group>
      <Group title={L(lang, "Stand", "Condition")}>
        {["new", "used"].map((c) => check("condition", c, CONDITION_LABEL[c][lang]))}
      </Group>
      {colors.length > 0 && (
        <Group title={L(lang, "Farve", "Colour")}>
          {colors.map((c) => check("color", c, c))}
        </Group>
      )}
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
        {check("availability", "in_stock", L(lang, "På lager", "In stock"))}
        {check("flags", "direct", L(lang, "Kan bestilles direkte", "Direct order available"))}
        {check("flags", "quote", L(lang, "Kræver tilbud", "Quote required"))}
      </Group>
    </div>
  );
}
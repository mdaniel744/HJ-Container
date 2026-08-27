import React from "react";
import { useNavigate } from "@/lib/next-router";
import { CONDITION_LABEL, L } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { findAttributeEntry } from "@/lib/localize";

const SIZE_KEYS = ["Størrelse", "Size"];
const COLOR_KEYS = ["Farve", "Colour", "Color"];

const RAL_SWATCHES = {
  "RAL 6005": "#1f3d2b",
  "RAL 9010": "#f1f0e8",
  "RAL 7016": "#383e42",
  "RAL 5010": "#0e294b",
};

function swatchColor(colorValue) {
  const ral = colorValue?.match(/RAL\s?\d{4}/i)?.[0]?.toUpperCase().replace(/\s+/, " ");
  if (ral && RAL_SWATCHES[ral]) return RAL_SWATCHES[ral];
  const lower = (colorValue || "").toLowerCase();
  if (lower.includes("grøn") || lower.includes("green")) return "#1f3d2b";
  if (lower.includes("hvid") || lower.includes("white")) return "#f1f0e8";
  if (lower.includes("grå") || lower.includes("gray") || lower.includes("grey")) return "#52575c";
  if (lower.includes("blå") || lower.includes("blue")) return "#1d4f91";
  if (lower.includes("sort") || lower.includes("black")) return "#1a1a1a";
  return "#cbd5e1";
}

/**
 * Picker for a product that belongs to a family (product.family_id set).
 * Every option here is a real sibling product row — clicking one navigates
 * to that product's own URL (no ?variant= query string). Options are only
 * ever built from products that actually exist; there is no way to select
 * a combination with no backing row.
 */
export default function VariantSelector({ product, products, families, resolve, lang }) {
  const navigate = useNavigate();
  const mySize = findAttributeEntry(product.attributes, SIZE_KEYS)?.value;

  const sameSizeSiblings = products.filter(
    (p) => p.family_id && findAttributeEntry(p.attributes, SIZE_KEYS)?.value === mySize
  );

  const byFamily = new Map();
  for (const p of sameSizeSiblings) {
    if (!byFamily.has(p.family_id)) byFamily.set(p.family_id, []);
    byFamily.get(p.family_id).push(p);
  }
  const typeOptions = [...byFamily.entries()]
    .map(([familyId, members]) => {
      const family = families.find((f) => f.id === familyId);
      const target = members.find((m) => m.condition === product.condition) || members[0];
      return { familyId, label: family?.name || target.name, target };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const familySiblingsAtSize = sameSizeSiblings.filter((p) => p.family_id === product.family_id);
  const conditions = [...new Set(familySiblingsAtSize.map((p) => p.condition).filter(Boolean))]
    .sort((a, b) => (a === "new" ? -1 : 1) - (b === "new" ? -1 : 1));

  const sameConditionSiblings = familySiblingsAtSize.filter((p) => p.condition === product.condition);
  const colorGroups = new Map();
  for (const p of sameConditionSiblings) {
    const entry = findAttributeEntry(p.attributes, COLOR_KEYS);
    if (!entry) continue;
    if (!colorGroups.has(entry.value)) colorGroups.set(entry.value, p);
  }
  const colorOptions = [...colorGroups.entries()];
  const myColor = findAttributeEntry(product.attributes, COLOR_KEYS)?.value;

  const goToCondition = (condition) => {
    const pool = familySiblingsAtSize.filter((p) => p.condition === condition);
    const withMyColor = myColor ? pool.filter((p) => findAttributeEntry(p.attributes, COLOR_KEYS)?.value === myColor) : [];
    const target = withMyColor[0] || pool[0];
    if (target) navigate(path("product", lang, target.slug));
  };

  const goToColor = (colorValue) => {
    const target = colorGroups.get(colorValue);
    if (target) navigate(path("product", lang, target.slug));
  };

  return (
    <div className="space-y-6">
      {typeOptions.length > 1 && (
        <fieldset>
          <legend className="hjc-label mb-3">{L(lang, "Containertype og højde", "Container type and height")}</legend>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map(({ familyId, label, target }) => {
              const active = familyId === product.family_id;
              return (
                <button
                  key={familyId}
                  type="button"
                  onClick={() => !active && navigate(path("product", lang, target.slug))}
                  aria-pressed={active}
                  className={`min-w-[132px] border px-4 py-3 text-left text-sm font-medium transition-colors ${
                    active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 hover:border-slate-500"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {conditions.length > 1 && (
        <fieldset>
          <legend className="hjc-label mb-3">{L(lang, "Stand", "Condition")}</legend>
          <div className="flex flex-wrap gap-2">
            {conditions.map((c) => {
              const active = product.condition === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => !active && goToCondition(c)}
                  aria-pressed={active}
                  className={`px-4 py-2.5 border text-sm transition-colors ${
                    active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 hover:border-slate-500"
                  }`}
                >
                  {CONDITION_LABEL[c]?.[lang] || c}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {colorOptions.length > 1 && (
        <fieldset>
          <legend className="hjc-label mb-3">{L(lang, "Farve", "Colour")}</legend>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map(([colorValue, sibling]) => {
              const active = colorValue === myColor;
              const label = resolve ? resolve("Farve", colorValue).value : colorValue;
              return (
                <button
                  key={sibling.id}
                  type="button"
                  onClick={() => !active && goToColor(colorValue)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-3 border px-4 py-2.5 text-left text-sm ${
                    active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 hover:border-slate-500"
                  }`}
                >
                  <span
                    className="h-7 w-7 shrink-0 border border-white/50 shadow-[0_0_0_1px_rgba(15,23,42,0.2)]"
                    style={{ backgroundColor: swatchColor(colorValue) }}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
}

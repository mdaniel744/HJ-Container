import React from "react";
import { CONDITION_LABEL, L, pick } from "@/lib/i18n";
import { CATEGORY_LABEL } from "@/lib/routes";

const TYPE_ORDER = { standard: 1, high_cube: 2, open_side: 3 };
const CONDITION_ORDER = { new: 1, used: 2 };
const RAL_SWATCHES = {
  "RAL 5010": "#0e294b",
  "RAL 7016": "#383e42",
};

function colorKey(variant, lang) {
  return `${pick(variant, "color", lang)}|${variant.ral_code || ""}`;
}

function swatchColor(variant, lang) {
  const ralCode = variant.ral_code?.trim().toUpperCase();
  if (RAL_SWATCHES[ralCode]) return RAL_SWATCHES[ralCode];

  const colorName = pick(variant, "color", lang).toLowerCase();
  if (colorName.includes("blue") || colorName.includes("blå")) return "#1d4f91";
  if (colorName.includes("grey") || colorName.includes("gray") || colorName.includes("grå")) return "#52575c";
  return "#cbd5e1";
}

export default function VariantSelector({ variants, products, selected, onSelect, lang }) {
  const sizeVariants = variants.filter((variant) => variant.size === selected.size);
  const productByKey = Object.fromEntries(products.map((product) => [product.key, product]));
  const productKeys = [...new Set(sizeVariants.map((variant) => variant.product_key))]
    .sort((a, b) => (TYPE_ORDER[a] || 99) - (TYPE_ORDER[b] || 99));
  const typeVariants = sizeVariants.filter((variant) => variant.product_key === selected.product_key);
  const conditions = [...new Set(typeVariants.map((variant) => variant.condition))]
    .sort((a, b) => (CONDITION_ORDER[a] || 99) - (CONDITION_ORDER[b] || 99));
  const conditionVariants = typeVariants.filter((variant) => variant.condition === selected.condition);
  const colors = [...new Map(conditionVariants.map((variant) => [colorKey(variant, lang), variant])).values()];

  const pickVariant = (patch) => {
    const targetProductKey = patch.product_key ?? selected.product_key;
    const targetTypeVariants = sizeVariants.filter((variant) => variant.product_key === targetProductKey);
    const preferredCondition = patch.condition ?? selected.condition;
    const matchingCondition = targetTypeVariants.filter((variant) => variant.condition === preferredCondition);
    const candidates = matchingCondition.length ? matchingCondition : targetTypeVariants;
    const preferredColor = patch.color ?? colorKey(selected, lang);
    const next =
      candidates.find((variant) => colorKey(variant, lang) === preferredColor) ||
      candidates.find((variant) => variant.availability === "in_stock") ||
      candidates[0];
    if (next) onSelect(next);
  };

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="hjc-label mb-3">{L(lang, "Containertype og højde", "Container type and height")}</legend>
        <div className="flex flex-wrap gap-2">
          {productKeys.map((productKey) => {
            const product = productByKey[productKey];
            const active = selected.product_key === productKey;
            return (
              <button
                key={productKey}
                type="button"
                onClick={() => pickVariant({ product_key: productKey })}
                aria-pressed={active}
                className={`min-w-[132px] border px-4 py-3 text-left text-sm font-medium transition-colors ${
                  active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 hover:border-slate-500"
                }`}
              >
                {CATEGORY_LABEL[product?.category]?.[lang] || pick(product, "name", lang) || productKey}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="hjc-label mb-3">{L(lang, "Stand", "Condition")}</legend>
        <div className="flex flex-wrap gap-2">
          {conditions.map((c) => {
            const active = selected.condition === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => pickVariant({ condition: c })}
                aria-pressed={active}
                className={`px-4 py-2.5 border text-sm transition-colors ${
                  active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 hover:border-slate-500"
                }`}
              >
                {CONDITION_LABEL[c][lang]}
              </button>
            );
          })}
        </div>
      </fieldset>

      {colors.length > 0 && (
        <fieldset>
          <legend className="hjc-label mb-3">{L(lang, "Farve", "Colour")}</legend>
          <div className="flex flex-wrap gap-2">
            {colors.map((v) => (
              <button
                key={v.sku}
                type="button"
                onClick={() => pickVariant({ color: colorKey(v, lang) })}
                aria-pressed={selected.sku === v.sku}
                className={`inline-flex items-center gap-3 border px-4 py-2.5 text-left text-sm ${selected.sku === v.sku ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 hover:border-slate-500"}`}
              >
                <span
                  className="h-7 w-7 shrink-0 border border-white/50 shadow-[0_0_0_1px_rgba(15,23,42,0.2)]"
                  style={{ backgroundColor: swatchColor(v, lang) }}
                  aria-hidden="true"
                />
                <span>
                  <span className="block font-medium">{pick(v, "color", lang) || L(lang, "Standard", "Standard")}</span>
                  {v.ral_code && <span className="block hjc-mono text-[10px] opacity-70">{v.ral_code}</span>}
                </span>
              </button>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}

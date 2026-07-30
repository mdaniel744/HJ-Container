import React from "react";
import { CONDITION_LABEL, L, pick } from "@/lib/i18n";
import { SIZE_ORDER } from "@/lib/routes";

const SIZE_BAR = { "10ft": "w-6", "20ft": "w-10", "40ft": "w-16" };

export default function VariantSelector({ variants, selected, onSelect, lang }) {
  const sizes = [...new Set(variants.map((v) => v.size))].sort((a, b) => SIZE_ORDER[a] - SIZE_ORDER[b]);
  const conditions = [...new Set(variants.filter((v) => v.size === selected.size).map((v) => v.condition))];
  const colors = variants.filter((v) => v.size === selected.size && v.condition === selected.condition);

  const pickVariant = (patch) => {
    const next =
      variants.find((v) => v.size === (patch.size ?? selected.size) && v.condition === (patch.condition ?? selected.condition) && (patch.sku ? v.sku === patch.sku : true)) ||
      variants.find((v) => v.size === (patch.size ?? selected.size));
    if (next) onSelect(next);
  };

  const isAvailable = (v) => v && v.availability !== "out_of_stock";

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="hjc-label mb-3">{L(lang, "Størrelse", "Size")}</legend>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const candidate = variants.find((v) => v.size === s);
            const active = selected.size === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => pickVariant({ size: s })}
                aria-pressed={active}
                className={`px-4 py-3 border text-left min-w-[104px] transition-colors ${
                  active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 hover:border-slate-500"
                } ${!isAvailable(candidate) ? "opacity-60" : ""}`}
              >
                <span className="hjc-mono text-sm font-medium">{s}</span>
                <span className={`block mt-2 h-1 ${SIZE_BAR[s]} ${active ? "bg-orange-400" : "bg-slate-300"}`} />
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="hjc-label mb-3">{L(lang, "Stand", "Condition")}</legend>
        <div className="flex flex-wrap gap-2">
          {conditions.map((c) => {
            const candidate = variants.find((v) => v.size === selected.size && v.condition === c);
            const active = selected.condition === c;
            const unavailable = !isAvailable(candidate);
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
                {unavailable && <span className="ml-2 hjc-mono text-[10px]">{L(lang, "ikke på lager", "out of stock")}</span>}
              </button>
            );
          })}
        </div>
      </fieldset>

      {colors.length > 1 && (
        <fieldset>
          <legend className="hjc-label mb-3">{L(lang, "Farve", "Colour")}</legend>
          <div className="flex flex-wrap gap-2">
            {colors.map((v) => (
              <button
                key={v.sku}
                type="button"
                onClick={() => onSelect(v)}
                aria-pressed={selected.sku === v.sku}
                className={`px-4 py-2.5 border text-sm ${selected.sku === v.sku ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 hover:border-slate-500"}`}
              >
                {pick(v, "color", lang) || L(lang, "Standard", "Standard")}
                {v.ral_code && <span className="ml-2 hjc-mono text-[10px] opacity-70">{v.ral_code}</span>}
              </button>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}
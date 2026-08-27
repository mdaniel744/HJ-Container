import React from "react";
import { useNavigate } from "@/lib/next-router";
import { CONDITION_LABEL, L } from "@/lib/i18n";
import { path } from "@/lib/routes";

const COLOR_KEYS = new Set(["farve", "colour", "color"]);
// Axes to lead with when several are present — anything not listed here
// still gets a section, just ordered after these, alphabetically.
const AXIS_ORDER_HINTS = ["størrelse", "size", "condition", "farve", "colour", "color"];

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

// Every product's picker-relevant values in one place: its real attributes
// plus the `condition` column folded in as a pseudo-attribute, so both go
// through identical matching/variation logic below.
function axisValues(p) {
  return { ...p.attributes, condition: p.condition };
}

function axisSortKey(key) {
  const idx = AXIS_ORDER_HINTS.indexOf(key.toLowerCase());
  return idx === -1 ? 99 : idx;
}

// Axis (fieldset legend) label — the name of the dimension, not a value.
function axisLabel(key, resolve, lang) {
  if (key === "condition") return L(lang, "Stand", "Condition");
  return resolve ? resolve(key, "").label : key;
}

// One option's display text.
function valueLabelFor(key, value, resolve, lang) {
  if (key === "condition") return CONDITION_LABEL[value]?.[lang] || value;
  return resolve ? resolve(key, value).value : String(value);
}

/**
 * Picker for a product that belongs to a family (product.family_id set).
 * Sections are dynamic, one per axis key in `axisKeys` that actually
 * varies among real sibling products — pass however many the store has
 * defined a controlled vocabulary for (see useAttributeVocabulary's
 * facetDefinitions; free-text spec fields like dimensions/weight have no
 * defined vocabulary and should never be passed here, since they
 * correlate with size rather than being an independent choice). There is
 * no fixed limit on how many axes can be passed; a key with no real
 * variation within the family simply produces no section.
 *
 * Each axis is scoped by every axis that sorts before it (via
 * AXIS_ORDER_HINTS) matching the current product — e.g. Colour options
 * are found within the current Size+Condition, not across all of them —
 * mirroring how a shopper actually narrows down a choice. Every option is
 * a real sibling product row; clicking one navigates to that product's
 * own URL.
 */
export default function VariantSelector({ product, products, families, axisKeys, resolve, lang }) {
  const navigate = useNavigate();
  const familyMembers = products.filter((p) => p.family_id === product.family_id);
  const myValues = axisValues(product);

  // "condition" (the real column) always participates; its attribute-level
  // duplicate ("Stand"/"Condition" inside `attributes`, if the store also
  // defined one) is dropped so it doesn't produce a second, redundant
  // section for the same concept.
  const candidateKeys = [
    "condition",
    ...(axisKeys || []).filter((k) => !["stand", "condition"].includes(k.toLowerCase())),
  ];
  const variableKeys = candidateKeys
    .filter((key) => {
      const values = new Set(familyMembers.map((p) => axisValues(p)[key]).filter((v) => v !== undefined && v !== null && v !== ""));
      return values.size > 1;
    })
    .sort((a, b) => axisSortKey(a) - axisSortKey(b));

  // Options for one axis: sibling values found while holding every
  // HIGHER-priority axis constant at the current product's value (e.g.
  // Colour is scoped by Size+Condition, not the reverse), so picking a
  // later axis never silently changes an earlier one.
  function optionsFor(key) {
    const priorKeys = variableKeys.slice(0, variableKeys.indexOf(key));
    const pool = familyMembers.filter((p) => priorKeys.every((k) => axisValues(p)[k] === myValues[k]));
    const seen = new Map();
    for (const p of pool) {
      const v = axisValues(p)[key];
      if (v !== undefined && v !== null && v !== "" && !seen.has(v)) seen.set(v, p);
    }
    return [...seen.entries()];
  }

  function goToAxisValue(key, value) {
    const target = optionsFor(key).find(([v]) => v === value)?.[1];
    if (target) navigate(path("product", lang, target.slug));
  }

  // Family/"type" switcher: for every other family, find the sibling whose
  // axis values best match this product's (most matching axes wins), so
  // switching type keeps as much of the current selection as a real
  // product allows and degrades gracefully otherwise.
  const byFamily = new Map();
  for (const p of products) {
    if (!p.family_id) continue;
    if (!byFamily.has(p.family_id)) byFamily.set(p.family_id, []);
    byFamily.get(p.family_id).push(p);
  }
  const typeOptions = [...byFamily.entries()]
    .map(([familyId, members]) => {
      let best = members[0];
      let bestScore = -1;
      for (const m of members) {
        const mValues = axisValues(m);
        const score = variableKeys.reduce((acc, k) => acc + (mValues[k] === myValues[k] ? 1 : 0), 0);
        if (score > bestScore) { bestScore = score; best = m; }
      }
      const family = families.find((f) => f.id === familyId);
      return { familyId, label: family?.name || best.name, target: best };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

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

      {variableKeys.map((key) => {
        const options = optionsFor(key);
        if (options.length < 2) return null;
        const isColor = COLOR_KEYS.has(key.toLowerCase());
        const legend = axisLabel(key, resolve, lang);

        return (
          <fieldset key={key}>
            <legend className="hjc-label mb-3">{legend}</legend>
            <div className="flex flex-wrap gap-2">
              {options.map(([value, sibling]) => {
                const active = value === myValues[key];
                const valueLabel = valueLabelFor(key, value, resolve, lang);
                return (
                  <button
                    key={sibling.id}
                    type="button"
                    onClick={() => !active && goToAxisValue(key, value)}
                    aria-pressed={active}
                    className={`${isColor ? "inline-flex items-center gap-3" : ""} border px-4 py-2.5 text-left text-sm transition-colors ${
                      active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {isColor && (
                      <span
                        className="h-7 w-7 shrink-0 border border-white/50 shadow-[0_0_0_1px_rgba(15,23,42,0.2)]"
                        style={{ backgroundColor: swatchColor(value) }}
                        aria-hidden="true"
                      />
                    )}
                    <span>{valueLabel}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

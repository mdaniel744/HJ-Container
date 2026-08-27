import React from "react";
import { CONDITION_LABEL, L } from "@/lib/i18n";

// Keys already surfaced from the product's real columns below, so they're
// skipped when rendering the free-form attributes bag to avoid duplicate
// rows — real Supabase products carry "Stand" in both places, and the local
// sample dataset also nests a "SKU" key inside attributes.
const HANDLED_KEYS = new Set(["sku", "stand"]);

// Attribute vocabulary is fully custom per store — this renders whatever
// key/value pairs the operator has entered. `resolve` (from
// useAttributeVocabulary) translates each key/value through the
// attributes/attribute_values definition tables when possible, falling
// back to the raw JSON key/value otherwise.
export default function SpecTable({ product, resolve, lang }) {
  const attributes = product.attributes || {};
  const conditionAttr = Object.entries(attributes).find(([key]) => key.toLowerCase() === "stand");
  const conditionLabel = product.condition
    ? CONDITION_LABEL[product.condition]?.[lang] || product.condition
    : conditionAttr && (resolve ? resolve(conditionAttr[0], conditionAttr[1]).value : conditionAttr[1]);

  const rows = [
    conditionLabel && { label: L(lang, "Stand", "Condition"), value: conditionLabel },
    (product.sku || attributes.SKU) && { label: "SKU", value: product.sku || attributes.SKU },
    product.mpn && { label: "MPN", value: product.mpn },
    ...Object.entries(attributes)
      .filter(([key, value]) => !HANDLED_KEYS.has(key.toLowerCase()) && value !== undefined && value !== null && value !== "")
      .map(([key, value]) => (resolve ? resolve(key, value) : { label: key, value: String(value) })),
  ].filter(Boolean);

  if (!rows.length) {
    return <p className="text-sm text-slate-500">{L(lang, "Ingen specifikationer angivet.", "No specifications given.")}</p>;
  }

  return (
    <table className="w-full text-sm border border-slate-200">
      <caption className="sr-only">{L(lang, "Tekniske specifikationer", "Technical specifications")}</caption>
      <tbody>
        {rows.map(({ label, value }, i) => (
          <tr key={label} className={i % 2 ? "bg-white" : "bg-slate-50/70"}>
            <th scope="row" className="text-left font-medium text-slate-600 px-4 py-3 w-1/2 align-top border-b border-slate-100">{label}</th>
            <td className="px-4 py-3 hjc-mono text-[12px] text-slate-900 border-b border-slate-100">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

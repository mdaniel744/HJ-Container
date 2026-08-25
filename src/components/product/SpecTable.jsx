import React from "react";
import { L } from "@/lib/i18n";

// Attribute vocabulary is fully custom per store — this renders whatever
// key/value pairs the operator has entered. `resolve` (from
// useAttributeVocabulary) translates each key/value through the
// attributes/attribute_values definition tables when possible, falling
// back to the raw JSON key/value otherwise.
export default function SpecTable({ attributes, resolve, lang }) {
  const rows = Object.entries(attributes || {})
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([key, value]) => (resolve ? resolve(key, value) : { label: key, value: String(value) }));

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

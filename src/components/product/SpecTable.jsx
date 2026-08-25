import React from "react";
import { CONDITION_LABEL, L, pick } from "@/lib/i18n";

export default function SpecTable({ variant, lang }) {
  const rows = [
    [L(lang, "Udvendige mål", "External dimensions"), variant.external_dimensions],
    [L(lang, "Indvendige mål", "Internal dimensions"), variant.internal_dimensions],
    [L(lang, "Døråbning", "Door opening"), variant.door_opening],
    [L(lang, "Egenvægt (tara)", "Tare weight"), variant.tare_weight],
    [L(lang, "Maks. nyttelast", "Maximum payload"), variant.max_payload],
    [L(lang, "Indvendigt rumfang", "Internal capacity"), variant.internal_volume],
    [L(lang, "Materiale", "Material"), pick(variant, "material", lang)],
    [L(lang, "Gulv", "Floor"), pick(variant, "floor", lang)],
    [L(lang, "Døre", "Doors"), pick(variant, "door_type", lang)],
    [L(lang, "Stand", "Condition"), CONDITION_LABEL[variant.condition]?.[lang]],
    [L(lang, "Farve", "Colour"), [pick(variant, "color", lang), variant.ral_code].filter(Boolean).join(" · ")],
    [L(lang, "CSC", "CSC"), variant.csc_status],
    [L(lang, "Vind- og vandtæt", "Wind and watertight"), variant.wwt_status],
    ["SKU", variant.sku],
    ["MPN", variant.mpn],
  ].filter(([, v]) => v);

  return (
    <table className="w-full text-sm border border-slate-200">
      <caption className="sr-only">{L(lang, "Tekniske specifikationer", "Technical specifications")}</caption>
      <tbody>
        {rows.map(([label, value], i) => (
          <tr key={label} className={i % 2 ? "bg-white" : "bg-slate-50/70"}>
            <th scope="row" className="text-left font-medium text-slate-600 px-4 py-3 w-1/2 align-top border-b border-slate-100">{label}</th>
            <td className="px-4 py-3 hjc-mono text-[12px] text-slate-900 border-b border-slate-100">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

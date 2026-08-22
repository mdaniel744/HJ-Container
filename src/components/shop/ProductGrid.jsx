import React from "react";
import { Link } from "@/lib/next-router";
import ProductCard from "./ProductCard";
import { AVAILABILITY_LABEL, CONDITION_LABEL, L, formatDKK, pick } from "@/lib/i18n";
import { path } from "@/lib/routes";

export default function ProductGrid({ rows, lang, view }) {
  if (view === "list") {
    return (
      <div className="overflow-x-auto border border-slate-200">
        <table className="w-full text-sm min-w-[860px]">
          <caption className="sr-only">{L(lang, "Containere som liste", "Containers as list")}</caption>
          <thead className="bg-slate-50 hjc-label">
            <tr>
              {[L(lang, "Container", "Container"), "SKU", L(lang, "Størrelse", "Size"), L(lang, "Stand", "Condition"),
                L(lang, "Udvendige mål", "External"), L(lang, "Vægt", "Weight"), L(lang, "Pris", "Price"), ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ product, variant }) => (
              <tr key={variant.sku} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">{pick(product, "name", lang)}</td>
                <td className="px-4 py-3 hjc-mono text-[11px] text-slate-500">{variant.sku}</td>
                <td className="px-4 py-3 hjc-mono text-[11px]">{variant.size}</td>
                <td className="px-4 py-3">{CONDITION_LABEL[variant.condition][lang]}</td>
                <td className="px-4 py-3 hjc-mono text-[11px] text-slate-600">{variant.external_dimensions || "—"}</td>
                <td className="px-4 py-3 hjc-mono text-[11px] text-slate-600">{variant.tare_weight || "—"}</td>
                <td className="px-4 py-3">
                  {variant.price_incl_vat > 0 ? formatDKK(variant.price_incl_vat, lang) : L(lang, "På forespørgsel", "On request")}
                  <span className="block hjc-mono text-[10px] text-slate-400">{AVAILABILITY_LABEL[variant.availability]?.[lang]}</span>
                </td>
                <td className="px-4 py-3">
                  <Link to={`${path("product", lang, pick(product, "slug", lang))}?variant=${variant.sku}`} className="font-semibold underline underline-offset-2">
                    {L(lang, "Se", "View")}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map(({ product, variant }) => (
        <ProductCard key={variant.sku} product={product} variant={variant} lang={lang} />
      ))}
    </div>
  );
}
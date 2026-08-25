import React from "react";
import { Link } from "@/lib/next-router";
import ProductCard from "./ProductCard";
import { AVAILABILITY_LABEL, CONDITION_LABEL, L, formatDKK, pick } from "@/lib/i18n";
import { path } from "@/lib/routes";

const CONDITION_ORDER = { new: 1, used: 2 };

export default function ProductGrid({ rows, lang, view }) {
  const grouped = rows.some((row) => row.options);

  if (view === "list") {
    return (
      <div className="overflow-x-auto border border-slate-200">
        <table className="w-full text-sm min-w-[860px]">
          <caption className="sr-only">{L(lang, "Containere som liste", "Containers as list")}</caption>
          <thead className="bg-slate-50 hjc-label">
            <tr>
              {[L(lang, "Container", "Container"), grouped ? L(lang, "Muligheder", "Options") : "SKU", L(lang, "Størrelse", "Size"), L(lang, "Stand", "Condition"),
                L(lang, "Udvendige mål", "External"), L(lang, "Vægt", "Weight"), L(lang, "Pris", "Price"), ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ product, variant, options }) => {
              const optionVariants = options?.map((option) => option.variant) || [variant];
              const conditions = [...new Set(optionVariants.map((option) => option.condition))]
                .sort((a, b) => (CONDITION_ORDER[a] || 99) - (CONDITION_ORDER[b] || 99))
                .map((condition) => CONDITION_LABEL[condition][lang]);
              const prices = optionVariants.map((option) => option.price_incl_vat).filter((price) => price > 0);
              const price = prices.length ? Math.min(...prices) : 0;
              const hasStock = optionVariants.some((option) => option.availability === "in_stock");
              return (
              <tr key={variant.sku} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {options ? L(lang, `${variant.size.replace("ft", " fods")} container`, `${variant.size} Shipping Container`) : pick(product, "name", lang)}
                </td>
                <td className="px-4 py-3 hjc-mono text-[11px] text-slate-500">
                  {options ? L(lang, `${options.length} muligheder`, `${options.length} options`) : variant.sku}
                </td>
                <td className="px-4 py-3 hjc-mono text-[11px]">{variant.size}</td>
                <td className="px-4 py-3">{conditions.join(" · ")}</td>
                <td className="px-4 py-3 hjc-mono text-[11px] text-slate-600">{options ? L(lang, "Afhænger af type", "Varies by type") : variant.external_dimensions || "—"}</td>
                <td className="px-4 py-3 hjc-mono text-[11px] text-slate-600">{options ? L(lang, "Afhænger af type", "Varies by type") : variant.tare_weight || "—"}</td>
                <td className="px-4 py-3">
                  {price > 0 ? `${options ? L(lang, "Fra ", "From ") : ""}${formatDKK(price, lang)}` : L(lang, "På forespørgsel", "On request")}
                  <span className="block hjc-mono text-[10px] text-slate-400">
                    {options ? (hasStock ? L(lang, "På lager", "In stock") : L(lang, "På forespørgsel", "On request")) : AVAILABILITY_LABEL[variant.availability]?.[lang]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link to={`${path("product", lang, pick(product, "slug", lang))}${product.catalog_mode === "standalone" ? "" : `?variant=${variant.sku}`}`} className="font-semibold underline underline-offset-2">
                    {L(lang, "Se", "View")}
                  </Link>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map(({ product, variant, options }) => (
        <ProductCard key={options ? variant.size : variant.sku} product={product} variant={variant} options={options} lang={lang} />
      ))}
    </div>
  );
}

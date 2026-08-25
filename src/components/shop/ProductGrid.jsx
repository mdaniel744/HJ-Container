import React from "react";
import { Link } from "@/lib/next-router";
import ProductCard from "./ProductCard";
import { L, formatDKK } from "@/lib/i18n";
import { path } from "@/lib/routes";

export default function ProductGrid({ products, lang, view }) {
  if (view === "list") {
    return (
      <div className="overflow-x-auto border border-slate-200">
        <table className="w-full text-sm min-w-[700px]">
          <caption className="sr-only">{L(lang, "Containere som liste", "Containers as list")}</caption>
          <thead className="bg-slate-50 hjc-label">
            <tr>
              {[L(lang, "Container", "Container"), L(lang, "Pris", "Price"), ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                <td className="px-4 py-3">
                  {p.price > 0 ? formatDKK(p.sale_price > 0 ? p.sale_price : p.price, lang) : L(lang, "På forespørgsel", "On request")}
                </td>
                <td className="px-4 py-3">
                  <Link to={path("product", lang, p.slug)} className="font-semibold underline underline-offset-2">
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
      {products.map((p) => <ProductCard key={p.id} product={p} lang={lang} />)}
    </div>
  );
}

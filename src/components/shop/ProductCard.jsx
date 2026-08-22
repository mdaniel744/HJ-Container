import React from "react";
import { Link } from "@/lib/next-router";
import { Image } from "@/components/ui/image";
import { AVAILABILITY_LABEL, CONDITION_LABEL, L, formatDKK, pick } from "@/lib/i18n";
import { path } from "@/lib/routes";

export default function ProductCard({ product, variant, lang }) {
  if (!product) return null;
  const url = path("product", lang, pick(product, "slug", lang)) + (variant ? `?variant=${variant.sku}` : "");
  const img = variant?.image || product.images?.[0];
  const priced = variant?.price_incl_vat > 0;

  return (
    <article className="group border border-slate-200 bg-white flex flex-col hover:border-slate-300 transition-colors">
      <Link to={url} className="block relative overflow-hidden bg-slate-50 aspect-[4/3]">
        {img && (
          <Image src={img} alt={`${pick(product, "name", lang)} — ${variant?.size || ""} ${CONDITION_LABEL[variant?.condition]?.[lang] || ""}`}
            className="w-full h-full transition-transform duration-500 group-hover:scale-105" />
        )}
        {variant && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-slate-900/90 text-white px-3 py-2 hjc-mono text-[10px] flex justify-between">
            <span>{variant.tare_weight || "—"}</span>
            <span>{variant.internal_volume || "—"}</span>
          </div>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 hjc-label">
          <span>{variant?.size}</span>
          {variant && <span className="text-slate-300">/</span>}
          <span>{CONDITION_LABEL[variant?.condition]?.[lang]}</span>
        </div>
        <h3 className="mt-2 font-heading font-bold text-slate-900 leading-snug">
          <Link to={url} className="hover:underline underline-offset-4">{pick(product, "name", lang)}</Link>
        </h3>
        <p className="hjc-mono text-[11px] text-slate-400 mt-1">SKU {variant?.sku}</p>

        <div className="mt-4">
          {priced ? (
            <>
              <p className="font-heading text-xl font-bold text-slate-900">{formatDKK(variant.price_incl_vat, lang)}</p>
              <p className="hjc-mono text-[11px] text-slate-500">
                {L(lang, "inkl. 25% moms", "incl. 25% VAT")} · {formatDKK(variant.price_incl_vat / 1.25, lang)} {L(lang, "ekskl. moms", "excl. VAT")}
              </p>
            </>
          ) : (
            <p className="font-heading text-lg font-bold text-slate-900">{L(lang, "Pris på forespørgsel", "Price on request")}</p>
          )}
          <p className={`mt-2 hjc-mono text-[11px] ${variant?.availability === "in_stock" ? "text-emerald-700" : "text-slate-500"}`}>
            {AVAILABILITY_LABEL[variant?.availability]?.[lang]}
            {variant?.stock_quantity ? ` — ${variant.stock_quantity} ${L(lang, "stk.", "units")}` : ""}
            {variant?.depot ? ` · ${variant.depot}` : ""}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex gap-2">
          <Link to={url} className="flex-1 text-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2.5 transition-colors">
            {L(lang, "Se produkt", "View product")}
          </Link>
          {!variant?.direct_order && (
            <Link to={path("quote", lang) + `?product=${product.key}&size=${variant?.size || ""}`}
              className="flex-1 text-center border border-slate-900 text-slate-900 text-sm font-semibold py-2.5 hover:bg-slate-50">
              {L(lang, "Få et tilbud", "Get a quote")}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
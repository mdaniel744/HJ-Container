import React from "react";
import { Link } from "@/lib/next-router";
import { Image } from "@/components/ui/image";
import { CONDITION_LABEL, L, formatDKK } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { findAttributeEntry } from "@/lib/localize";

const SIZE_KEYS = ["Størrelse", "Size"];

export default function ProductCard({ product, lang }) {
  if (!product) return null;
  const img = product.images?.[0];
  const priced = product.price > 0;
  const effectivePrice = product.sale_price > 0 && product.sale_price < product.price ? product.sale_price : product.price;
  const size = findAttributeEntry(product.attributes, SIZE_KEYS)?.value;
  const conditionLabel = CONDITION_LABEL[product.condition]?.[lang];
  const url = path("product", lang, product.slug);

  return (
    <article className="group border border-slate-200 bg-white flex flex-col hover:border-slate-300 transition-colors">
      <Link to={url} className="block relative overflow-hidden bg-slate-50 aspect-[4/3]">
        {img && (
          <Image src={img} alt={product.image_alts?.[0] || product.name}
            className="w-full h-full transition-transform duration-500 group-hover:scale-105" />
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white hjc-mono text-[10px] px-2 py-1">{product.badge}</span>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <div className="hjc-label">{[size, conditionLabel].filter(Boolean).join(" / ")}</div>
        <h3 className="mt-2 font-heading font-bold text-slate-900 leading-snug">
          <Link to={url} className="hover:underline underline-offset-4">{product.name}</Link>
        </h3>
        {product.sku && <p className="mt-1 hjc-mono text-[11px] text-slate-400">SKU {product.sku}</p>}

        <div className="mt-4">
          {priced ? (
            <>
              <p className="font-heading text-xl font-bold text-slate-900">
                {product.sale_price > 0 && product.sale_price < product.price && (
                  <span className="line-through text-slate-400 mr-2 text-sm font-normal">{formatDKK(product.price, lang)}</span>
                )}
                {formatDKK(effectivePrice, lang)}
              </p>
              <p className="hjc-mono text-[11px] text-slate-500">
                {L(lang, "inkl. 25% moms", "incl. 25% VAT")} · {formatDKK(effectivePrice / 1.25, lang)} {L(lang, "ekskl. moms", "excl. VAT")}
              </p>
            </>
          ) : (
            <p className="font-heading text-lg font-bold text-slate-900">{L(lang, "Pris på forespørgsel", "Price on request")}</p>
          )}
          <p className={`mt-2 hjc-mono text-[11px] ${product.stock_quantity > 0 ? "text-emerald-700" : "text-slate-500"}`}>
            {product.stock_quantity > 0 ? L(lang, "På lager", "In stock") : L(lang, "På forespørgsel", "On request")}
            {product.stock_quantity > 0 ? ` — ${product.stock_quantity} ${L(lang, "stk.", "units")}` : ""}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex gap-2">
          <Link to={url} className="flex-1 text-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2.5 transition-colors">
            {L(lang, "Se produkt", "View product")}
          </Link>
          {!priced && (
            <Link to={`${path("quote", lang)}?product=${product.id}`}
              className="flex-1 text-center border border-slate-900 text-slate-900 text-sm font-semibold py-2.5 hover:bg-slate-50">
              {L(lang, "Få et tilbud", "Get a quote")}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

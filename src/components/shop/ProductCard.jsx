import React from "react";
import { Link } from "@/lib/next-router";
import { Image } from "@/components/ui/image";
import { AVAILABILITY_LABEL, CONDITION_LABEL, L, formatDKK, pick } from "@/lib/i18n";
import { path } from "@/lib/routes";

const PRODUCT_ORDER = { standard: 1, high_cube: 2, open_side: 3 };
const CONDITION_ORDER = { new: 1, used: 2 };

export default function ProductCard({ product, variant, options, lang }) {
  if (!product) return null;
  const standalone = product.catalog_mode === "standalone";
  const optionVariants = options?.map((option) => option.variant) || [];
  const isSizeGroup = optionVariants.length > 0;
  const url = path("product", lang, pick(product, "slug", lang)) + (!standalone && variant ? `?variant=${variant.sku}` : "");
  const img = variant?.image || product.images?.[0];
  const prices = (isSizeGroup ? optionVariants : [variant]).map((option) => option?.price_incl_vat).filter((price) => price > 0);
  const price = prices.length ? Math.min(...prices) : 0;
  const priced = price > 0;
  const productTypes = [...new Map((options || []).map((option) => [option.product.key, option.product])).values()]
    .sort((a, b) => (PRODUCT_ORDER[a.key] || 99) - (PRODUCT_ORDER[b.key] || 99))
    .map((option) => pick(option, "name", lang));
  const conditions = [...new Set(optionVariants.map((option) => option.condition))]
    .sort((a, b) => (CONDITION_ORDER[a] || 99) - (CONDITION_ORDER[b] || 99))
    .map((condition) => CONDITION_LABEL[condition][lang]);
  const title = isSizeGroup
    ? L(lang, `${variant.size.replace("ft", " fods")} container`, `${variant.size} Shipping Container`)
    : pick(product, "name", lang);
  const availableStock = (isSizeGroup ? optionVariants : [variant]).reduce((sum, option) => sum + (option?.stock_quantity || 0), 0);
  const hasStock = (isSizeGroup ? optionVariants : [variant]).some((option) => option?.availability === "in_stock");

  return (
    <article className="group border border-slate-200 bg-white flex flex-col hover:border-slate-300 transition-colors">
      <Link to={url} className="block relative overflow-hidden bg-slate-50 aspect-[4/3]">
        {img && (
          <Image src={img} alt={isSizeGroup ? title : `${title} — ${variant?.size || ""} ${CONDITION_LABEL[variant?.condition]?.[lang] || ""}`}
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
        <div className="hjc-label">{isSizeGroup ? productTypes.join(" · ") : `${variant?.size} / ${CONDITION_LABEL[variant?.condition]?.[lang]}`}</div>
        <h3 className="mt-2 font-heading font-bold text-slate-900 leading-snug">
          <Link to={url} className="hover:underline underline-offset-4">{title}</Link>
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          {isSizeGroup ? conditions.join(" · ") : <span className="hjc-mono text-[11px] text-slate-400">SKU {variant?.sku}</span>}
        </p>
        {isSizeGroup && (
          <p className="mt-1 hjc-mono text-[10px] text-slate-400">
            {L(lang, `${optionVariants.length} tilgængelige varianter`, `${optionVariants.length} available variants`)}
          </p>
        )}

        <div className="mt-4">
          {priced ? (
            <>
              <p className="font-heading text-xl font-bold text-slate-900">
                {isSizeGroup && <span className="mr-1 text-sm font-medium text-slate-500">{L(lang, "Fra", "From")}</span>}
                {formatDKK(price, lang)}
              </p>
              <p className="hjc-mono text-[11px] text-slate-500">
                {L(lang, "inkl. 25% moms", "incl. 25% VAT")} · {formatDKK(price / 1.25, lang)} {L(lang, "ekskl. moms", "excl. VAT")}
              </p>
            </>
          ) : (
            <p className="font-heading text-lg font-bold text-slate-900">{L(lang, "Pris på forespørgsel", "Price on request")}</p>
          )}
          <p className={`mt-2 hjc-mono text-[11px] ${hasStock ? "text-emerald-700" : "text-slate-500"}`}>
            {isSizeGroup ? (hasStock ? L(lang, "På lager", "In stock") : L(lang, "På forespørgsel", "On request")) : AVAILABILITY_LABEL[variant?.availability]?.[lang]}
            {availableStock ? ` — ${availableStock} ${L(lang, "stk.", "units")}` : ""}
            {!isSizeGroup && variant?.depot ? ` · ${variant.depot}` : ""}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex gap-2">
          <Link to={url} className="flex-1 text-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2.5 transition-colors">
            {isSizeGroup ? L(lang, `Se ${variant.size} muligheder`, `View ${variant.size} options`) : L(lang, "Se produkt", "View product")}
          </Link>
          {!isSizeGroup && !variant?.direct_order && (
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

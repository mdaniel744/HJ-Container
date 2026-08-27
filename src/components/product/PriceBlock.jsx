import React from "react";
import { L, formatDKK } from "@/lib/i18n";

export default function PriceBlock({ product, lang, delivery }) {
  const priced = product.price > 0;
  const effective = product.sale_price > 0 && product.sale_price < product.price ? product.sale_price : product.price;
  const excl = priced ? effective / 1.25 : 0;
  const vat = priced ? effective - excl : 0;

  return (
    <div className="border border-slate-200">
      <div className="p-5">
        {priced ? (
          <>
            <p className="font-heading text-3xl font-extrabold">
              {product.sale_price > 0 && product.sale_price < product.price && (
                <span className="line-through text-slate-400 mr-3 text-xl font-normal">{formatDKK(product.price, lang)}</span>
              )}
              {formatDKK(effective, lang)}
            </p>
            <p className="hjc-mono text-[11px] text-slate-500 mt-1">{L(lang, "inkl. 25% moms", "incl. 25% VAT")}</p>
            <dl className="mt-4 space-y-1.5 hjc-mono text-[12px] text-slate-600">
              <div className="flex justify-between"><dt>{L(lang, "Pris ekskl. moms", "Price excl. VAT")}</dt><dd>{formatDKK(excl, lang)}</dd></div>
              <div className="flex justify-between"><dt>{L(lang, "Moms (25%)", "VAT (25%)")}</dt><dd>{formatDKK(vat, lang)}</dd></div>
              <div className="flex justify-between">
                <dt>{L(lang, "Levering", "Delivery")}</dt>
                <dd>{delivery?.calculable ? formatDKK(delivery.delivery_cost, lang) : L(lang, "beregnes", "to be calculated")}</dd>
              </div>
              <div className="flex justify-between">
                <dt>{L(lang, "Aflæsning", "Unloading")}</dt>
                <dd>{delivery?.calculable ? formatDKK(delivery.unloading_cost, lang) : L(lang, "beregnes", "to be calculated")}</dd>
              </div>
              {delivery?.calculable && (
                <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold text-slate-900">
                  <dt>{L(lang, "Total inkl. moms", "Total incl. VAT")}</dt>
                  <dd>{formatDKK(effective + delivery.total, lang)}</dd>
                </div>
              )}
            </dl>
          </>
        ) : (
          <>
            <p className="font-heading text-2xl font-extrabold">{L(lang, "Pris på forespørgsel", "Price on request")}</p>
            <p className="mt-2 text-sm text-slate-600">
              {L(lang, "Denne container prissættes individuelt. Send en tilbudsforespørgsel, så vender vi tilbage med en pris.",
                "This container is priced individually. Send a quote request and we will come back with a price.")}
            </p>
          </>
        )}
      </div>
      {product.stock_quantity > 0 && (
        <div className="border-t border-slate-200 px-5 py-3 hjc-mono text-[11px] text-emerald-700">
          {L(lang, "På lager", "In stock")} — {product.stock_quantity} {L(lang, "stk.", "units")}
        </div>
      )}
    </div>
  );
}

import React from "react";
import { AVAILABILITY_LABEL, L, formatDKK, pick } from "@/lib/i18n";

export default function PriceBlock({ variant, lang, delivery }) {
  const priced = variant.price_incl_vat > 0;
  const excl = priced ? variant.price_incl_vat / 1.25 : 0;
  const vat = priced ? variant.price_incl_vat - excl : 0;

  return (
    <div className="border border-slate-200">
      <div className="p-5">
        {priced ? (
          <>
            <p className="font-heading text-3xl font-extrabold">{formatDKK(variant.price_incl_vat, lang)}</p>
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
                  <dd>{formatDKK(variant.price_incl_vat + delivery.total, lang)}</dd>
                </div>
              )}
            </dl>
          </>
        ) : (
          <>
            <p className="font-heading text-2xl font-extrabold">{L(lang, "Pris på forespørgsel", "Price on request")}</p>
            <p className="mt-2 text-sm text-slate-600">
              {L(lang, "Denne variant prissættes individuelt. Send en tilbudsforespørgsel, så vender vi tilbage med en pris.",
                "This variant is priced individually. Send a quote request and we will come back with a price.")}
            </p>
          </>
        )}
      </div>
      <div className="border-t border-slate-200 px-5 py-3 flex flex-wrap gap-x-6 gap-y-1 hjc-mono text-[11px]">
        <span className={variant.availability === "in_stock" ? "text-emerald-700" : "text-slate-500"}>
          {AVAILABILITY_LABEL[variant.availability]?.[lang]}
          {variant.stock_quantity ? ` — ${variant.stock_quantity} ${L(lang, "stk.", "units")}` : ""}
        </span>
        {variant.depot && <span className="text-slate-500">{variant.depot}</span>}
        {pick(variant, "lead_time", lang) && <span className="text-slate-500">{pick(variant, "lead_time", lang)}</span>}
      </div>
    </div>
  );
}
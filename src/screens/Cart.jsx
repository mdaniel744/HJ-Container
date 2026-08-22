import React from "react";
import { Link } from "@/lib/next-router";
import { Trash2 } from "lucide-react";
import { Image } from "@/components/ui/image";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { CONDITION_LABEL, L, formatDKK, useLang } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { useCart } from "@/lib/CartContext";
import { useSeo } from "@/lib/seo";

export default function Cart() {
  const lang = useLang();
  const { items, updateQuantity, removeItem, totalInclVat, totalExclVat, vatAmount } = useCart();

  useSeo({
    lang,
    title: L(lang, "Kurv | HJ Container ApS", "Cart | HJ Container ApS"),
    description: L(lang, "Din kurv hos HJ Container ApS.", "Your cart at HJ Container ApS."),
    noindex: true,
  });

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <Breadcrumbs items={[{ name: L(lang, "Forside", "Home"), path: path("home", lang) }, { name: L(lang, "Kurv", "Cart") }]} />
      <h1 className="mt-6 font-heading text-3xl font-extrabold">{L(lang, "Din kurv", "Your cart")}</h1>

      {items.length === 0 ? (
        <div className="mt-10 border border-slate-200 p-10 text-center">
          <p className="text-slate-600">{L(lang, "Kurven er tom.", "Your cart is empty.")}</p>
          <Link to={path("shop", lang)} className="inline-block mt-6 bg-slate-900 text-white font-semibold px-6 py-3 text-sm">
            {L(lang, "Se containere", "Browse containers")}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid lg:grid-cols-[1fr_320px] gap-10">
          <ul className="divide-y divide-slate-200 border-y border-slate-200">
            {items.map((i) => (
              <li key={i.sku} className="py-5 flex gap-4">
                {i.image && <Image src={i.image} alt={i.title} className="w-24 h-24 shrink-0 border border-slate-200" />}
                <div className="flex-1">
                  <p className="font-heading font-bold">{i.title}</p>
                  <p className="hjc-mono text-[11px] text-slate-500 mt-1">
                    SKU {i.sku} · {i.size} · {CONDITION_LABEL[i.condition]?.[lang]}
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <span className="hjc-label">{L(lang, "Antal", "Qty")}</span>
                      <input type="number" min="1" value={i.quantity} onChange={(e) => updateQuantity(i.sku, Number(e.target.value))}
                        className="w-16 border border-slate-300 px-2 py-1.5 hjc-mono text-sm" />
                    </label>
                    <button onClick={() => removeItem(i.sku)} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" /> {L(lang, "Fjern", "Remove")}
                    </button>
                  </div>
                </div>
                <p className="font-heading font-bold whitespace-nowrap">{formatDKK(i.unit_price_incl_vat * i.quantity, lang)}</p>
              </li>
            ))}
          </ul>

          <aside className="border border-slate-200 p-5 h-fit">
            <h2 className="font-heading font-bold text-lg">{L(lang, "Opsummering", "Summary")}</h2>
            <dl className="mt-4 space-y-2 hjc-mono text-[12px] text-slate-600">
              <div className="flex justify-between"><dt>{L(lang, "Ekskl. moms", "Excl. VAT")}</dt><dd>{formatDKK(totalExclVat, lang)}</dd></div>
              <div className="flex justify-between"><dt>{L(lang, "Moms (25%)", "VAT (25%)")}</dt><dd>{formatDKK(vatAmount, lang)}</dd></div>
              <div className="flex justify-between"><dt>{L(lang, "Levering", "Delivery")}</dt><dd>{L(lang, "beregnes i kassen", "calculated at checkout")}</dd></div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-slate-900 font-semibold text-sm">
                <dt>{L(lang, "Varer i alt inkl. moms", "Items total incl. VAT")}</dt><dd>{formatDKK(totalInclVat, lang)}</dd>
              </div>
            </dl>
            <Link to={path("checkout", lang)} className="mt-6 block text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5">
              {L(lang, "Gå til kassen", "Proceed to checkout")}
            </Link>
            <Link to={path("quote", lang)} className="mt-3 block text-center border border-slate-900 font-semibold py-3.5 text-sm">
              {L(lang, "Anmod om tilbud i stedet", "Request a quote instead")}
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
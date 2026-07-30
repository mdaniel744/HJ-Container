import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { CheckCircle2 } from "lucide-react";
import { CONDITION_LABEL, L, formatDKK, useLang } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { COMPANY } from "@/lib/company";
import { useSeo } from "@/lib/seo";

export default function OrderConfirmation() {
  const lang = useLang();
  const number = new URLSearchParams(window.location.search).get("order");
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["order", number],
    queryFn: () => base44.entities.Order.filter({ order_number: number }),
    enabled: !!number,
  });
  const order = orders[0];

  useSeo({ lang, title: L(lang, "Ordrebekræftelse | HJ Container ApS", "Order confirmation | HJ Container ApS"), description: "", noindex: true });

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <CheckCircle2 className="w-12 h-12 text-emerald-600" strokeWidth={1.5} />
      <h1 className="mt-5 font-heading text-3xl font-extrabold">{L(lang, "Tak for din ordre", "Thank you for your order")}</h1>
      <p className="mt-3 text-slate-600">
        {L(lang, "Vi har modtaget din ordre og sender en bekræftelse pr. e-mail. Herefter kontakter vi dig med betalingsoplysninger og leveringsplanlægning.",
          "We have received your order and are sending a confirmation by email. We will then contact you with payment details and delivery planning.")}
      </p>
      <p className="hjc-mono text-sm mt-5">{L(lang, "Ordrenummer", "Order number")}: <strong>{number}</strong></p>

      {isLoading && <p className="mt-6 hjc-mono text-sm text-slate-500">{L(lang, "Indlæser ordre…", "Loading order…")}</p>}

      {order && (
        <div className="mt-8 border border-slate-200">
          <ul className="divide-y divide-slate-200">
            {order.items.map((i) => (
              <li key={i.sku} className="px-5 py-4 flex justify-between text-sm">
                <span>{i.quantity} × {i.title}
                  <span className="block hjc-mono text-[11px] text-slate-500">SKU {i.sku} · {i.size} · {CONDITION_LABEL[i.condition]?.[lang]}</span>
                </span>
                <span className="hjc-mono">{formatDKK(i.unit_price_incl_vat * i.quantity, lang)}</span>
              </li>
            ))}
          </ul>
          <dl className="border-t border-slate-200 px-5 py-4 space-y-1.5 hjc-mono text-[12px] text-slate-600">
            <div className="flex justify-between"><dt>{L(lang, "Ekskl. moms", "Excl. VAT")}</dt><dd>{formatDKK(order.subtotal_excl_vat, lang)}</dd></div>
            <div className="flex justify-between"><dt>{L(lang, "Moms", "VAT")}</dt><dd>{formatDKK(order.vat_amount, lang)}</dd></div>
            <div className="flex justify-between"><dt>{L(lang, "Levering", "Delivery")}</dt><dd>{formatDKK(order.delivery_cost, lang)}</dd></div>
            <div className="flex justify-between"><dt>{L(lang, "Aflæsning", "Unloading")}</dt><dd>{formatDKK(order.unloading_cost, lang)}</dd></div>
            <div className="flex justify-between font-semibold text-slate-900"><dt>{L(lang, "Total inkl. moms", "Total incl. VAT")}</dt><dd>{formatDKK(order.total_incl_vat, lang)}</dd></div>
          </dl>
          <div className="border-t border-slate-200 px-5 py-4 text-sm text-slate-600">
            <p>{L(lang, "Leveringsadresse", "Delivery address")}: {order.delivery_address}, {order.postcode} {order.city}</p>
            <p className="mt-1">{L(lang, "Betalingsmetode", "Payment method")}: {order.payment_method === "invoice" ? L(lang, "Faktura", "Invoice") : L(lang, "Bankoverførsel", "Bank transfer")}</p>
          </div>
        </div>
      )}

      <div className="mt-8 border-l-4 border-slate-900 bg-slate-50 p-5 text-sm text-slate-600">
        <p className="font-heading font-bold text-slate-900">{COMPANY.name}</p>
        <p className="mt-1">{COMPANY.street}, {COMPANY.postcode} {COMPANY.city}, {L(lang, COMPANY.country_da, COMPANY.country_en)}</p>
        <p className="hjc-mono text-[11px] mt-1">CVR {COMPANY.cvr} · EUID {COMPANY.euid} · {COMPANY.email}</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to={path("shop", lang)} className="bg-slate-900 text-white font-semibold px-6 py-3 text-sm">{L(lang, "Tilbage til shop", "Back to shop")}</Link>
        <Link to={path("contact", lang)} className="border border-slate-900 font-semibold px-6 py-3 text-sm">{L(lang, "Kontakt os", "Contact us")}</Link>
      </div>
    </div>
  );
}
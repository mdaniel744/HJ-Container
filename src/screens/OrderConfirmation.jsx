import React from "react";
import { Link, useSearchParams } from "@/lib/next-router";
import { CheckCircle2 } from "lucide-react";
import { L, useLang } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { COMPANY } from "@/lib/company";
import { useSeo } from "@/lib/seo";

export default function OrderConfirmation() {
  const lang = useLang();
  const [searchParams] = useSearchParams();
  const number = searchParams.get("order");

  useSeo({ lang, title: L(lang, "Ordrebekræftelse | HJ Container ApS", "Order confirmation | HJ Container ApS"), description: "", noindex: true });

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <CheckCircle2 className="w-12 h-12 text-emerald-600" strokeWidth={1.5} />
      <h1 className="mt-5 font-heading text-3xl font-extrabold">{L(lang, "Tak for din ordre", "Thank you for your order")}</h1>
      <p className="mt-3 text-slate-600">
        {L(lang, "Vi har modtaget din ordre og sender en bekræftelse pr. e-mail. Herefter kontakter vi dig med betalingsoplysninger og leveringsplanlægning.",
          "We have received your order and are sending a confirmation by email. We will then contact you with payment details and delivery planning.")}
      </p>
      {number && (
        <p className="hjc-mono text-sm mt-5">{L(lang, "Ordrenummer", "Order number")}: <strong>{number}</strong></p>
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

import React from "react";
import { Link } from "@/lib/next-router";
import { L, useLang } from "@/lib/i18n";
import { path } from "@/lib/routes";

export default function PageNotFoundContent() {
  const lang = useLang();
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center">
      <p className="hjc-mono text-sm text-orange-500">404</p>
      <h1 className="mt-4 font-heading text-3xl font-extrabold">{L(lang, "Siden blev ikke fundet", "Page not found")}</h1>
      <p className="mt-4 text-slate-600">
        {L(lang, "Siden findes ikke længere, eller adressen er skrevet forkert. Prøv shoppen eller kontakt os.",
          "The page no longer exists or the address was mistyped. Try the shop or contact us.")}
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link to={path("shop", lang)} className="bg-slate-900 text-white font-semibold px-6 py-3 text-sm">{L(lang, "Gå til shop", "Go to shop")}</Link>
        <Link to={path("contact", lang)} className="border border-slate-900 font-semibold px-6 py-3 text-sm">{L(lang, "Kontakt", "Contact")}</Link>
      </div>
    </div>
  );
}
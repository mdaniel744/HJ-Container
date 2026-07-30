import React from "react";
import { Link } from "react-router-dom";
import { L } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { COMPANY } from "@/lib/company";

export default function FinalCta({ lang }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <div className="border-l-4 border-orange-500 bg-slate-50 p-8 md:p-12 flex flex-col lg:flex-row lg:items-center gap-8 justify-between">
        <div className="max-w-xl">
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold">
            {L(lang, "Klar til at vælge din container?", "Ready to choose your container?")}
          </h2>
          <p className="mt-3 text-slate-600">
            {L(lang,
              "Gennemse udvalget med tydelige priser og mål, eller send en tilbudsforespørgsel, hvis du har brug for flere containere eller særlig aflæsning.",
              "Browse the range with clear prices and dimensions, or send a quote request if you need several containers or special unloading.")}
          </p>
          <p className="hjc-mono text-[11px] text-slate-500 mt-4">
            {COMPANY.name} · {COMPANY.street}, {COMPANY.postcode} {COMPANY.city} · CVR {COMPANY.cvr} · {COMPANY.email}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link to={path("shop", lang)} className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-7 py-4 text-center">
            {L(lang, "Gå til shop", "Go to shop")}
          </Link>
          <Link to={path("quote", lang)} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-4 text-center">
            {L(lang, "Få et tilbud", "Request a Quote")}
          </Link>
        </div>
      </div>
    </section>
  );
}
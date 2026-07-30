import React from "react";
import { Link } from "react-router-dom";
import { L } from "@/lib/i18n";
import { COLLECTIONS, path } from "@/lib/routes";

const BARS = { "10ft": "w-1/4", "20ft": "w-1/2", "40ft": "w-full" };
const COPY = {
  "10ft": { da: "Kompakt løsning til små grunde og begrænset plads.", en: "Compact solution for small plots and limited space." },
  "20ft": { da: "Den mest efterspurgte størrelse — god volumen, håndterbar levering.", en: "The most requested size — good volume, manageable delivery." },
  "40ft": { da: "Størst rumfang. Kræver lang og bærende adgangsvej.", en: "Largest volume. Requires a long, load-bearing access route." },
};

export default function SizeCards({ lang }) {
  const sizes = COLLECTIONS.filter((c) => c.kind === "size");
  return (
    <section className="bg-slate-50 border-y border-slate-200">
      <div className="mx-auto max-w-7xl px-5 py-20">
        <p className="hjc-label">{L(lang, "02 — Størrelser", "02 — Sizes")}</p>
        <h2 className="mt-3 font-heading text-2xl md:text-3xl font-extrabold">{L(lang, "Shop efter størrelse", "Shop by size")}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {sizes.map((s) => (
            <Link key={s.key} to={path("category", lang, s.slug[lang])} className="bg-white border border-slate-200 p-7 hover:border-slate-400 transition-colors">
              <p className="hjc-mono text-sm text-slate-500">{s.key.toUpperCase()}</p>
              <h3 className="mt-2 font-heading text-xl font-bold">{s.label[lang]}</h3>
              <div className="mt-6 h-8 bg-slate-100 relative">
                <div className={`absolute inset-y-0 left-0 ${BARS[s.key]} bg-slate-900`} />
              </div>
              <p className="mt-5 text-sm text-slate-600">{COPY[s.key][lang]}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
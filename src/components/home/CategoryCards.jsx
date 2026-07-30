import React from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { ArrowUpRight } from "lucide-react";
import { L } from "@/lib/i18n";
import { COLLECTIONS, path } from "@/lib/routes";
import { MEDIA } from "@/lib/media";

const COPY = {
  standard: {
    da: "Den mest anvendte containertype til opmagasinering, byggepladser og lager.",
    en: "The most widely used container type for storage, construction sites and warehousing.",
  },
  high_cube: {
    da: "Ekstra indvendig højde til høje paller, maskiner og bedre plads over hovedet.",
    en: "Extra internal height for tall pallets, machinery and better headroom.",
  },
  open_side: {
    da: "Døre i hele længden giver adgang med truck direkte fra siden.",
    en: "Full-length side doors give forklift access directly from the side.",
  },
};

export default function CategoryCards({ lang, counts }) {
  const types = COLLECTIONS.filter((c) => c.kind === "type");
  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="hjc-label">{L(lang, "01 — Kategorier", "01 — Categories")}</p>
          <h2 className="mt-3 font-heading text-2xl md:text-3xl font-extrabold">{L(lang, "Shop efter containertype", "Shop by container type")}</h2>
        </div>
        <Link to={path("shop", lang)} className="text-sm font-semibold text-slate-900 underline underline-offset-4">
          {L(lang, "Se hele udvalget", "See the full range")}
        </Link>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {types.map((c) => (
          <Link key={c.key} to={path("category", lang, c.slug[lang])} className="group border border-slate-200 hover:border-slate-400 transition-colors">
            <div className="overflow-hidden bg-slate-50">
              <Image src={MEDIA[c.key]} alt={c.label[lang]} className="w-full aspect-[4/3] transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-heading text-lg font-bold">{c.label[lang]}</h3>
                <ArrowUpRight className="w-5 h-5 text-orange-500 shrink-0" />
              </div>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{COPY[c.key][lang]}</p>
              <p className="hjc-mono text-[11px] text-slate-400 mt-4">
                {counts?.[c.key] || 0} {L(lang, "varianter", "variants")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
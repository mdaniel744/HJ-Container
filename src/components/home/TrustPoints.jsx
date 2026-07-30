import React from "react";
import { FileText, PackageCheck, Truck, MessageSquareQuote, ShieldCheck } from "lucide-react";
import { L } from "@/lib/i18n";

const POINTS = [
  { icon: FileText, da: ["Tydelige produktoplysninger", "Mål, vægt, stand og pris fremgår på hver enkelt variant."], en: ["Clear product information", "Dimensions, weight, condition and price are stated on every variant."] },
  { icon: PackageCheck, da: ["Nye og brugte muligheder", "Vælg mellem One Trip-containere og brugte enheder."], en: ["New and used options", "Choose between One Trip containers and used units."] },
  { icon: Truck, da: ["Fleksibel levering", "Transport planlægges efter adgangsforhold og aflæsningsmetode."], en: ["Flexible delivery", "Transport is planned around site access and unloading method."] },
  { icon: MessageSquareQuote, da: ["Personlig tilbudsbehandling", "Særlige opgaver og flere containere håndteres manuelt."], en: ["Personal quote handling", "Special jobs and multiple containers are handled manually."] },
  { icon: ShieldCheck, da: ["Sikker ordreproces", "Fuldt prisoverblik og vilkår før du bekræfter ordren."], en: ["Secure ordering process", "Full price overview and terms before you confirm the order."] },
];

export default function TrustPoints({ lang }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <p className="hjc-label">{L(lang, "04 — Hvorfor os", "04 — Why us")}</p>
      <h2 className="mt-3 font-heading text-2xl md:text-3xl font-extrabold">
        {L(lang, "Hvorfor vælge HJ Container ApS", "Why choose HJ Container ApS")}
      </h2>
      <div className="mt-10 grid gap-px bg-slate-200 border border-slate-200 sm:grid-cols-2 lg:grid-cols-5">
        {POINTS.map(({ icon: Icon, da, en }) => {
          const [title, text] = lang === "en" ? en : da;
          return (
            <div key={title} className="bg-white p-6">
              <Icon className="w-6 h-6 text-orange-500" strokeWidth={1.5} />
              <h3 className="mt-4 font-heading font-bold text-slate-900 text-base leading-snug">{title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
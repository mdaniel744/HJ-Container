import React from "react";
import { L } from "@/lib/i18n";

const STEPS = {
  da: ["Vælg en container", "Vælg størrelse og stand", "Indtast leveringsoplysninger", "Se fragtpris eller anmod om tilbud", "Send ordren", "Modtag bekræftelse og leveringsinformation"],
  en: ["Choose a container", "Select size and condition", "Enter delivery details", "View delivery price or request a quote", "Submit the order", "Receive confirmation and delivery information"],
};

export default function HowItWorks({ lang }) {
  const steps = STEPS[lang] || STEPS.da;
  return (
    <section className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-5 py-20">
        <p className="hjc-section-tag">{L(lang, "Proces", "Process")}</p>
        <h2 className="mt-3 font-heading text-2xl md:text-3xl font-extrabold">{L(lang, "Sådan foregår bestillingen", "How ordering works")}</h2>
        <ol className="mt-10 grid gap-px bg-slate-700 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s} className="bg-slate-900 p-6 flex gap-4">
              <span className="hjc-mono text-orange-400 text-sm">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-slate-100">{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

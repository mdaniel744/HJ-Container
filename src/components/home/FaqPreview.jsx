import React from "react";
import { Link } from "react-router-dom";
import { L, pick } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FaqPreview({ lang, faqs }) {
  if (!faqs?.length) return null;
  return (
    <section className="bg-slate-50 border-y border-slate-200">
      <div className="mx-auto max-w-4xl px-5 py-20">
        <p className="hjc-label">{L(lang, "07 — FAQ", "07 — FAQ")}</p>
        <h2 className="mt-3 font-heading text-2xl md:text-3xl font-extrabold">
          {L(lang, "Ofte stillede spørgsmål", "Frequently asked questions")}
        </h2>
        <Accordion type="single" collapsible className="mt-8">
          {faqs.slice(0, 6).map((f) => (
            <AccordionItem key={f.id} value={f.id} className="border-slate-200">
              <AccordionTrigger className="text-left font-heading font-semibold">{pick(f, "question", lang)}</AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">{pick(f, "answer", lang)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Link to={path("faq", lang)} className="inline-block mt-8 text-sm font-semibold text-slate-900 underline underline-offset-4">
          {L(lang, "Se alle spørgsmål og svar", "See all questions and answers")}
        </Link>
      </div>
    </section>
  );
}
import React, { useMemo, useState } from "react";
import { Link } from "@/lib/next-router";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { L, pick, useLang } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { useSeo, breadcrumbJsonLd } from "@/lib/seo";
import { applyFaqOverrides } from "@/lib/faqOverrides";

const CATS = [
  ["products", "Produkter", "Products"],
  ["sizes", "Størrelser og mål", "Sizes and dimensions"],
  ["condition", "Nye og brugte containere", "New and used containers"],
  ["prices", "Priser", "Prices"],
  ["delivery", "Levering", "Delivery"],
  ["unloading", "Aflæsning", "Unloading"],
  ["ordering", "Bestilling", "Ordering"],
  ["payment", "Betaling", "Payment"],
  ["returns", "Returnering", "Returns"],
  ["complaints", "Reklamation", "Complaints"],
  ["quotations", "Tilbud", "Quotations"],
];

export default function Faq() {
  const lang = useLang();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const { data: remoteFaqs = [] } = useQuery({
    queryKey: ["faqs"],
    queryFn: () => base44.entities.Faq.filter({ published: true }, "sort_order", 100),
  });
  const faqs = applyFaqOverrides(remoteFaqs);

  const filtered = useMemo(() => {
    let list = faqs;
    if (cat !== "all") list = list.filter((f) => f.category === cat);
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter((f) => `${pick(f, "question", lang)} ${pick(f, "answer", lang)}`.toLowerCase().includes(t));
    }
    return list;
  }, [faqs, cat, q, lang]);

  const crumbs = [{ name: L(lang, "Forside", "Home"), path: path("home", lang) }, { name: L(lang, "FAQ", "FAQs") }];

  useSeo({
    lang,
    title: L(lang, "Ofte stillede spørgsmål om containere | HJ Container ApS", "Frequently asked questions about containers | HJ Container ApS"),
    description: L(lang,
      "Svar på spørgsmål om containerstørrelser, stand, priser, levering, aflæsning, bestilling, betaling, returnering og tilbud.",
      "Answers about container sizes, condition, prices, delivery, unloading, ordering, payment, returns and quotations."),
    daPath: "/faq", enPath: "/en/faqs",
    jsonLd: [
      breadcrumbJsonLd(crumbs.filter((c) => c.path)),
      faqs.length
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: pick(f, "question", lang),
              acceptedAnswer: { "@type": "Answer", text: pick(f, "answer", lang) },
            })),
          }
        : null,
    ],
  });

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-6 font-heading text-3xl md:text-4xl font-extrabold">{L(lang, "Ofte stillede spørgsmål", "Frequently asked questions")}</h1>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <label className="flex-1">
          <span className="sr-only">{L(lang, "Søg i spørgsmål", "Search questions")}</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L(lang, "Søg i spørgsmål og svar", "Search questions and answers")}
            className="w-full border border-slate-300 px-4 py-2.5 text-sm" />
        </label>
        <label>
          <span className="sr-only">{L(lang, "Kategori", "Category")}</span>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="border border-slate-300 px-4 py-2.5 text-sm">
            <option value="all">{L(lang, "Alle kategorier", "All categories")}</option>
            {CATS.map(([v, da, en]) => <option key={v} value={v}>{lang === "en" ? en : da}</option>)}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-slate-600">
          {L(lang, "Ingen spørgsmål matcher din søgning. ", "No questions match your search. ")}
          <Link to={path("contact", lang)} className="underline font-semibold">{L(lang, "Kontakt os", "Contact us")}</Link>.
        </p>
      ) : (
        <Accordion type="single" collapsible className="mt-8">
          {filtered.map((f) => (
            <AccordionItem key={f.id} value={f.id}>
              <AccordionTrigger className="text-left font-heading font-semibold">{pick(f, "question", lang)}</AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">{pick(f, "answer", lang)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <div className="mt-12 border-l-4 border-orange-500 bg-slate-50 p-6">
        <p className="text-slate-700">
          {L(lang, "Fandt du ikke svaret? Se ", "Didn't find the answer? See ")}
          <Link to={path("guides", lang)} className="underline font-semibold">{L(lang, "Viden og rådgivning", "Guides and Advice")}</Link>
          {L(lang, " eller ", " or ")}
          <Link to={path("contact", lang)} className="underline font-semibold">{L(lang, "kontakt os direkte", "contact us directly")}</Link>.
        </p>
      </div>
    </div>
  );
}

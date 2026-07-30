import React from "react";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import CatalogView from "@/components/shop/CatalogView";
import { L, useLang } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { useCatalog } from "@/lib/useCatalog";
import { useSeo, breadcrumbJsonLd } from "@/lib/seo";

export default function Shop() {
  const lang = useLang();
  const { products, variants, isLoading } = useCatalog();
  const q = new URLSearchParams(window.location.search).get("q") || "";

  const crumbs = [
    { name: L(lang, "Forside", "Home"), path: path("home", lang) },
    { name: L(lang, "Shop", "Shop") },
  ];

  useSeo({
    lang,
    title: L(lang, "Containere til salg — 10, 20 og 40 fod | HJ Container ApS", "Containers for sale — 10ft, 20ft and 40ft | HJ Container ApS"),
    description: L(lang,
      "Se alle containere fra HJ Container ApS. Filtrér på type, størrelse, stand og pris i DKK, og bestil direkte eller anmod om et tilbud.",
      "Browse all containers from HJ Container ApS. Filter by type, size, condition and price in DKK, then order directly or request a quote."),
    daPath: "/shop", enPath: "/en/shop",
    noindex: !!q,
    jsonLd: [breadcrumbJsonLd(crumbs.filter((c) => c.path))],
  });

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <Breadcrumbs items={crumbs} />
      <header className="mt-6 max-w-3xl">
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold">{L(lang, "Alle containere", "All containers")}</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          {L(lang,
            "Her finder du vores standard-, High Cube- og Open Side-containere i 10, 20 og 40 fod. Hver variant har egen SKU med mål, vægt, stand og pris i DKK, så du kan sammenligne før du bestiller. Varianter uden fast pris kan sendes til tilbud.",
            "Here you will find our Standard, High Cube and Open Side containers in 10ft, 20ft and 40ft. Every variant has its own SKU with dimensions, weight, condition and price in DKK so you can compare before ordering. Variants without a fixed price can be sent to quotation.")}
        </p>
      </header>

      <div className="mt-10">
        {isLoading ? (
          <p className="hjc-mono text-sm text-slate-500">{L(lang, "Indlæser katalog…", "Loading catalogue…")}</p>
        ) : (
          <CatalogView lang={lang} products={products} variants={variants} initialQuery={q} />
        )}
      </div>
    </div>
  );
}
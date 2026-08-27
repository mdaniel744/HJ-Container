import React from "react";
import { useSearchParams } from "@/lib/next-router";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import CatalogView from "@/components/shop/CatalogView";
import { L, useLang } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { useProducts, useCategories } from "@/lib/useCatalog";
import { useSeo, breadcrumbJsonLd } from "@/lib/seo";

const SIZE_ATTR_KEYS = ["Størrelse", "Size"];

export default function Shop() {
  const lang = useLang();
  const { products, isLoading } = useProducts(lang);
  const { categories } = useCategories(lang);
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const sizeParam = searchParams.get("size");

  // Raw attribute keys are always source-locale — find whichever key this
  // store actually uses for size by checking what's on the loaded products,
  // rather than assuming a fixed key name.
  const sizeKey = products.flatMap((p) => Object.keys(p.attributes || {})).find((k) => SIZE_ATTR_KEYS.includes(k));
  const initialAttrs = sizeParam && sizeKey ? { [sizeKey]: [sizeParam] } : undefined;

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
            "Filtrér på containertype, størrelse, stand og pris for at finde den rette container. Bestil direkte, eller send en tilbudsforespørgsel.",
            "Filter by container type, size, condition and price to find the right container. Order directly, or send a quote request.")}
        </p>
      </header>

      <div className="mt-10">
        {isLoading ? (
          <p className="hjc-mono text-sm text-slate-500">{L(lang, "Indlæser katalog…", "Loading catalogue…")}</p>
        ) : (
          <CatalogView lang={lang} products={products} categories={categories} initialQuery={q} initialAttrs={initialAttrs} />
        )}
      </div>
    </div>
  );
}

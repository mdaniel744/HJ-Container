import React, { useMemo } from "react";
import { useSearchParams } from "@/lib/next-router";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import CatalogView from "@/components/shop/CatalogView";
import { L, useLang } from "@/lib/i18n";
import { path, SIZES } from "@/lib/routes";
import { useProducts, useCategories } from "@/lib/useCatalog";
import { useSeo, breadcrumbJsonLd } from "@/lib/seo";

export default function Shop() {
  const lang = useLang();
  const { products, isLoading } = useProducts(lang);
  const { categories } = useCategories(lang);
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const size = searchParams.get("size") || "";

  const crumbs = [
    { name: L(lang, "Forside", "Home"), path: path("home", lang) },
    { name: L(lang, "Shop", "Shop") },
  ];

  useSeo({
    lang,
    title: L(lang, "Containere til salg — 10, 20 og 40 fod | HJ Container ApS", "Containers for sale — 10ft, 20ft and 40ft | HJ Container ApS"),
    description: L(lang,
      "Se alle containere fra HJ Container ApS. Filtrér på type, størrelse, stand og pris i DKK, og anmod om et tilbud.",
      "Browse all containers from HJ Container ApS. Filter by type, size, condition and price in DKK, then request a quote."),
    daPath: "/shop", enPath: "/en/shop",
    noindex: !!q,
    jsonLd: [breadcrumbJsonLd(crumbs.filter((c) => c.path))],
  });

  // "Size" isn't a fixed attribute key — every store defines its own
  // attribute vocabulary. Detect the size-holding key by matching known
  // physical size tokens (10ft/20ft/40ft) rather than assuming a key name.
  const initialAttrs = useMemo(() => {
    if (!size || !products.length) return {};
    for (const p of products) {
      for (const [key, value] of Object.entries(p.attributes || {})) {
        if (SIZES.includes(String(value)) && String(value) === size) return { [key]: [size] };
      }
    }
    return {};
  }, [size, products]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <Breadcrumbs items={crumbs} />
      <header className="mt-6 max-w-3xl">
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold">{L(lang, "Alle containere", "All containers")}</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          {L(lang,
            "Her finder du vores standard-, High Cube- og Open Side-containere i 10, 20 og 40 fod. Hver container har sin egen pris i DKK, så du kan sammenligne før du anmoder om et tilbud.",
            "Here you will find our Standard, High Cube and Open Side containers in 10ft, 20ft and 40ft. Every container has its own price in DKK so you can compare before requesting a quote.")}
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

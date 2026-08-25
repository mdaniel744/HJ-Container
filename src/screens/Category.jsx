import React from "react";
import { useParams } from "@/lib/next-router";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import CatalogView from "@/components/shop/CatalogView";
import PageNotFoundContent from "@/components/site/PageNotFoundContent";
import RichText from "@/components/RichText";
import { L, useLang } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { useCategory, useProducts } from "@/lib/useCatalog";
import { useSeo, breadcrumbJsonLd } from "@/lib/seo";
import { useRegisterAltPath } from "@/lib/AltPath";
import { stripHtmlToText } from "@/lib/richText";

export default function Category() {
  const lang = useLang();
  const { slug } = useParams();
  const { category, isLoading: categoryLoading } = useCategory(slug, lang);
  const { products, isLoading: productsLoading } = useProducts(lang);

  useRegisterAltPath(category ? { da: path("category", "da", category.slug), en: path("category", "en", category.slug) } : null);

  const title = category?.name || "";
  const crumbs = [
    { name: L(lang, "Forside", "Home"), path: path("home", lang) },
    { name: L(lang, "Shop", "Shop"), path: path("shop", lang) },
    { name: title },
  ];

  useSeo({
    lang,
    title: category ? (category.meta_title || `${title} — ${L(lang, "priser i DKK", "prices in DKK")} | HJ Container ApS`) : "404",
    description: category ? (category.meta_description || stripHtmlToText(category.description).slice(0, 160)) : "",
    daPath: category && path("category", "da", category.slug),
    enPath: category && path("category", "en", category.slug),
    noindex: !category,
    jsonLd: category ? [breadcrumbJsonLd(crumbs.filter((c) => c.path))] : [],
  });

  if (categoryLoading || productsLoading) {
    return <p className="mx-auto max-w-7xl px-5 py-20 hjc-mono text-sm text-slate-500">{L(lang, "Indlæser…", "Loading…")}</p>;
  }
  if (!category) return <PageNotFoundContent />;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <Breadcrumbs items={crumbs} />
      <header className="mt-6 max-w-3xl">
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold">{title}</h1>
        <RichText html={category.description} className="mt-4 text-slate-600" />
      </header>

      <div className="mt-10">
        <CatalogView lang={lang} products={products} lockedCategoryId={category.id} />
      </div>
    </div>
  );
}

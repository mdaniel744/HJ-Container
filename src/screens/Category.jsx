import React from "react";
import { Link, useParams } from "@/lib/next-router";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import CatalogView from "@/components/shop/CatalogView";
import PageNotFoundContent from "@/components/site/PageNotFoundContent";
import RichText from "@/components/RichText";
import { L, useLang } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { useCategory, useCategories, useProducts } from "@/lib/useCatalog";
import { useSeo, breadcrumbJsonLd } from "@/lib/seo";
import { useRegisterAltPath } from "@/lib/AltPath";
import { stripHtmlToText } from "@/lib/richText";
import { GUIDES } from "@/lib/guides";

export default function Category() {
  const lang = useLang();
  const { slug } = useParams();
  const { category, isLoading: categoryLoading } = useCategory(slug, lang);
  const { categories } = useCategories(lang);
  const { products, isLoading: productsLoading } = useProducts(lang);

  useRegisterAltPath(
    category ? { da: path("category", "da", category.slug), en: path("category", "en", category.slug) } : null
  );

  const crumbs = [
    { name: L(lang, "Forside", "Home"), path: path("home", lang) },
    { name: L(lang, "Shop", "Shop"), path: path("shop", lang) },
    { name: category?.name || "" },
  ];

  useSeo({
    lang,
    title: category ? `${category.name} — ${L(lang, "priser i DKK", "prices in DKK")} | HJ Container ApS` : "404",
    description: category ? category.meta_description || stripHtmlToText(category.description).slice(0, 160) : "",
    daPath: category && path("category", "da", category.slug),
    enPath: category && path("category", "en", category.slug),
    noindex: !category,
    jsonLd: category ? [breadcrumbJsonLd(crumbs.filter((c) => c.path))] : [],
  });

  if (categoryLoading) return <p className="mx-auto max-w-7xl px-5 py-20 hjc-mono text-sm text-slate-500">{L(lang, "Indlæser…", "Loading…")}</p>;
  if (!category) return <PageNotFoundContent />;

  const otherCategories = categories.filter((c) => c.id !== category.id);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <Breadcrumbs items={crumbs} />
      <header className="mt-6 max-w-3xl">
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold">{category.name}</h1>
        <RichText html={category.description} className="mt-4 text-slate-600" />
        {(otherCategories.length > 0 || GUIDES.length > 0) && (
          <p className="mt-4 text-sm text-slate-600">
            {otherCategories.length > 0 && (
              <>
                {L(lang, "Se også ", "See also ")}
                {otherCategories.map((c, i) => (
                  <React.Fragment key={c.id}>
                    {i > 0 && ", "}
                    <Link to={path("category", lang, c.slug)} className="underline underline-offset-2 font-medium text-slate-900">{c.name}</Link>
                  </React.Fragment>
                ))}
                {". "}
              </>
            )}
            <Link to={path("guide", lang, GUIDES[0].slug[lang])} className="underline underline-offset-2 font-medium text-slate-900">
              {GUIDES[0].title[lang]}
            </Link>
            {L(lang, " hjælper dig med at vælge størrelse, og ", " helps you choose a size, and ")}
            <Link to={path("guide", lang, GUIDES[3].slug[lang])} className="underline underline-offset-2 font-medium text-slate-900">
              {GUIDES[3].title[lang]}
            </Link>
            {L(lang, " forklarer transport og aflæsning.", " explains transport and unloading.")}
          </p>
        )}
      </header>

      <div className="mt-10">
        {productsLoading ? (
          <p className="hjc-mono text-sm text-slate-500">{L(lang, "Indlæser katalog…", "Loading catalogue…")}</p>
        ) : (
          <CatalogView lang={lang} products={products} categories={[]} lockedCategoryId={category.id} />
        )}
      </div>
    </div>
  );
}

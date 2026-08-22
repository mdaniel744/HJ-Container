import React from "react";
import { Link, useParams } from "@/lib/next-router";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import CatalogView from "@/components/shop/CatalogView";
import PageNotFoundContent from "@/components/site/PageNotFoundContent";
import { L, useLang } from "@/lib/i18n";
import { COLLECTIONS, collectionBySlug, path } from "@/lib/routes";
import { useCatalog } from "@/lib/useCatalog";
import { useSeo, breadcrumbJsonLd } from "@/lib/seo";
import { useRegisterAltPath } from "@/lib/AltPath";
import { GUIDES } from "@/lib/guides";

const INTRO = {
  standard: { da: "Standardcontainere er den mest anvendte containertype i Danmark. De er robuste, stabelbare og velegnede til opmagasinering, byggepladser og lager. Vælg mellem 10, 20 og 40 fod i ny eller brugt stand.", en: "Standard containers are the most widely used container type in Denmark. They are robust, stackable and well suited to storage, construction sites and warehousing. Choose between 10ft, 20ft and 40ft in new or used condition." },
  high_cube: { da: "High Cube-containere er cirka en fod højere end standardcontainere. Den ekstra indvendige højde giver bedre plads til høje paller, maskiner og arbejde inde i containeren.", en: "High Cube containers are roughly one foot taller than standard containers. The extra internal height provides better space for tall pallets, machinery and working inside the unit." },
  open_side: { da: "Open Side-containere har døre i hele længden, så du kan læsse med truck direkte fra siden. Det er den rigtige løsning til lange emner og hurtig adgang.", en: "Open Side containers have doors along the full length so you can load by forklift directly from the side. This is the right solution for long items and fast access." },
  "10ft": { da: "10 fods containere er kompakte og lette at placere, hvor pladsen er begrænset. De findes både som standard, High Cube og Open Side.", en: "10ft containers are compact and easy to place where space is limited. They are available as Standard, High Cube and Open Side." },
  "20ft": { da: "20 fods containere er den mest efterspurgte størrelse med god volumen og håndterbar levering. De findes både som standard, High Cube og Open Side.", en: "20ft containers are the most requested size, with good volume and manageable delivery. They are available as Standard, High Cube and Open Side." },
  "40ft": { da: "40 fods containere giver det største rumfang, men kræver en lang og bærende adgangsvej. De findes både som standard, High Cube og Open Side.", en: "40ft containers provide the largest volume but require a long, load-bearing access route. They are available as Standard, High Cube and Open Side." },
};

export default function Category() {
  const lang = useLang();
  const { slug } = useParams();
  const collection = collectionBySlug(slug);
  const { products, variants, isLoading } = useCatalog();

  useRegisterAltPath(collection ? { da: path("category", "da", collection.slug.da), en: path("category", "en", collection.slug.en) } : null);

  const title = collection ? collection.label[lang] : "";
  const crumbs = [
    { name: L(lang, "Forside", "Home"), path: path("home", lang) },
    { name: L(lang, "Shop", "Shop"), path: path("shop", lang) },
    { name: title },
  ];

  useSeo({
    lang,
    title: collection ? `${title} — ${L(lang, "priser i DKK", "prices in DKK")} | HJ Container ApS` : "404",
    description: collection ? INTRO[collection.key][lang].slice(0, 160) : "",
    daPath: collection && path("category", "da", collection.slug.da),
    enPath: collection && path("category", "en", collection.slug.en),
    noindex: !collection,
    jsonLd: collection ? [breadcrumbJsonLd(crumbs.filter((c) => c.path))] : [],
  });

  if (!collection) return <PageNotFoundContent />;

  const locked = collection.kind === "type" ? { category: collection.key } : { size: collection.key };
  const related = COLLECTIONS.filter((c) => c.kind !== collection.kind);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <Breadcrumbs items={crumbs} />
      <header className="mt-6 max-w-3xl">
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold">{title}</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">{INTRO[collection.key][lang]}</p>
        <p className="mt-4 text-sm text-slate-600">
          {L(lang, "Se også ", "See also ")}
          {related.map((r, i) => (
            <React.Fragment key={r.key}>
              {i > 0 && ", "}
              <Link to={path("category", lang, r.slug[lang])} className="underline underline-offset-2 font-medium text-slate-900">{r.label[lang]}</Link>
            </React.Fragment>
          ))}
          {". "}
          <Link to={path("guide", lang, GUIDES[0].slug[lang])} className="underline underline-offset-2 font-medium text-slate-900">
            {GUIDES[0].title[lang]}
          </Link>
          {L(lang, " hjælper dig med at vælge størrelse, og ", " helps you choose a size, and ")}
          <Link to={path("guide", lang, GUIDES[3].slug[lang])} className="underline underline-offset-2 font-medium text-slate-900">
            {GUIDES[3].title[lang]}
          </Link>
          {L(lang, " forklarer transport og aflæsning.", " explains transport and unloading.")}
        </p>
      </header>

      <div className="mt-10">
        {isLoading ? (
          <p className="hjc-mono text-sm text-slate-500">{L(lang, "Indlæser katalog…", "Loading catalogue…")}</p>
        ) : (
          <CatalogView lang={lang} products={products} variants={variants} lockedFilter={locked} />
        )}
      </div>
    </div>
  );
}
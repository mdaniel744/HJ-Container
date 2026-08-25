import React from "react";
import { Link } from "@/lib/next-router";
import ProductCard from "@/components/shop/ProductCard";
import { L } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { startingVariant, variantsOf } from "@/lib/useCatalog";

export default function FeaturedProducts({ lang, products, variants }) {
  const featured = products.filter((product) => product.featured).slice(0, 8);

  if (!featured.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="hjc-section-tag">{L(lang, "Udvalgte", "Featured")}</p>
          <h2 className="mt-3 font-heading text-2xl md:text-3xl font-extrabold">{L(lang, "Udvalgte containere", "Featured containers")}</h2>
        </div>
        <Link to={path("shop", lang)} className="text-sm font-semibold text-slate-900 underline underline-offset-4">
          {L(lang, "Alle containere", "All containers")}
        </Link>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((product) => {
          const variant = startingVariant(variantsOf(variants, product.key));
          return variant ? <ProductCard key={product.key} product={product} variant={variant} lang={lang} /> : null;
        })}
      </div>
    </section>
  );
}

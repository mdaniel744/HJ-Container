import React from "react";
import { Link } from "@/lib/next-router";
import ProductCard from "@/components/shop/ProductCard";
import { L } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { startingVariant, variantsOf } from "@/lib/useCatalog";

export default function FeaturedProducts({ lang, products, variants }) {
  const featured = products.filter((p) => p.featured);
  const cards = [];
  featured.forEach((p) => {
    const list = variantsOf(variants, p.key);
    const direct = list.filter((v) => v.direct_order && v.price_incl_vat > 0);
    (direct.length ? direct.slice(0, 3) : [startingVariant(list)]).forEach((v) => v && cards.push({ p, v }));
  });

  if (!cards.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="hjc-label">{L(lang, "03 — Udvalgte", "03 — Featured")}</p>
          <h2 className="mt-3 font-heading text-2xl md:text-3xl font-extrabold">{L(lang, "Udvalgte containere", "Featured containers")}</h2>
        </div>
        <Link to={path("shop", lang)} className="text-sm font-semibold text-slate-900 underline underline-offset-4">
          {L(lang, "Alle containere", "All containers")}
        </Link>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.slice(0, 8).map(({ p, v }) => (
          <ProductCard key={v.sku} product={p} variant={v} lang={lang} />
        ))}
      </div>
    </section>
  );
}
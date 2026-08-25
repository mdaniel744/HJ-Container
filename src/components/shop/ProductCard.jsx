import React from "react";
import { Link } from "@/lib/next-router";
import { Image } from "@/components/ui/image";
import { L, formatDKK } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { findAttributeEntry } from "@/lib/localize";
import { useAttributeVocabulary } from "@/lib/useAttributeVocabulary";

const SIZE_KEYS = ["Størrelse"];
const CONDITION_KEYS = ["Stand"];
const WEIGHT_KEYS = ["Egenvægt (tara)"];
const VOLUME_KEYS = ["Indvendigt rumfang"];

export default function ProductCard({ product, lang }) {
  const { resolve } = useAttributeVocabulary(lang);
  if (!product) return null;
  const url = path("product", lang, product.slug);
  const img = product.images?.[0];
  const alt = product.image_alts?.[0] || product.name;
  const priced = product.price > 0;
  const effective = product.sale_price > 0 && product.sale_price < product.price ? product.sale_price : product.price;
  const attrs = product.attributes || {};
  const sizeEntry = findAttributeEntry(attrs, SIZE_KEYS);
  const conditionEntry = findAttributeEntry(attrs, CONDITION_KEYS);
  const size = sizeEntry?.value || null;
  const condition = conditionEntry ? resolve(conditionEntry.key, conditionEntry.value).value : null;
  const weightEntry = findAttributeEntry(attrs, WEIGHT_KEYS);
  const volumeEntry = findAttributeEntry(attrs, VOLUME_KEYS);

  return (
    <article className="group border border-slate-200 bg-white flex flex-col hover:border-slate-300 transition-colors">
      <Link to={url} className="block relative overflow-hidden bg-slate-50 aspect-[4/3]">
        {img && (
          <Image src={img} alt={alt} className="w-full h-full transition-transform duration-500 group-hover:scale-105" />
        )}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-slate-900/90 text-white px-3 py-2 hjc-mono text-[10px] flex justify-between">
          <span>{weightEntry?.value || "—"}</span>
          <span>{volumeEntry?.value || "—"}</span>
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 hjc-label">
          {size && <span>{size}</span>}
          {size && condition && <span className="text-slate-300">/</span>}
          {condition && <span>{condition}</span>}
        </div>
        <h3 className="mt-2 font-heading font-bold text-slate-900 leading-snug">
          <Link to={url} className="hover:underline underline-offset-4">{product.name}</Link>
        </h3>
        {attrs.SKU && <p className="hjc-mono text-[11px] text-slate-400 mt-1">SKU {attrs.SKU}</p>}

        <div className="mt-4">
          {priced ? (
            <>
              <p className="font-heading text-xl font-bold text-slate-900">
                {product.sale_price > 0 && product.sale_price < product.price && (
                  <span className="line-through text-slate-400 mr-2 text-base font-normal">{formatDKK(product.price, lang)}</span>
                )}
                {formatDKK(effective, lang)}
              </p>
              <p className="hjc-mono text-[11px] text-slate-500">
                {L(lang, "inkl. 25% moms", "incl. 25% VAT")} · {formatDKK(effective / 1.25, lang)} {L(lang, "ekskl. moms", "excl. VAT")}
              </p>
            </>
          ) : (
            <p className="font-heading text-lg font-bold text-slate-900">{L(lang, "Pris på forespørgsel", "Price on request")}</p>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex gap-2">
          <Link to={url} className="flex-1 text-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2.5 transition-colors">
            {L(lang, "Se produkt", "View product")}
          </Link>
          <Link to={`${path("quote", lang)}?product=${product.id}`}
            className="flex-1 text-center border border-slate-900 text-slate-900 text-sm font-semibold py-2.5 hover:bg-slate-50">
            {L(lang, "Få et tilbud", "Get a quote")}
          </Link>
        </div>
      </div>
    </article>
  );
}

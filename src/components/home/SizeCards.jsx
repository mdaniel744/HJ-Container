import React from "react";
import { Link } from "@/lib/next-router";
import { Image } from "@/components/ui/image";
import { ArrowUpRight } from "lucide-react";
import { L } from "@/lib/i18n";
import { SIZES, path } from "@/lib/routes";

const SIZE_IMAGES = {
  "10ft": "/images/categories/10ft-container.webp",
  "20ft": "/images/categories/20ft-container.webp",
  "40ft": "/images/categories/40ft-container.webp",
};
const COPY = {
  "10ft": { da: "Kompakt løsning til små grunde og begrænset plads.", en: "Compact solution for small plots and limited space." },
  "20ft": { da: "Den mest efterspurgte størrelse — god volumen, håndterbar levering.", en: "The most requested size — good volume, manageable delivery." },
  "40ft": { da: "Størst rumfang. Kræver lang og bærende adgangsvej.", en: "Largest volume. Requires a long, load-bearing access route." },
};

export default function SizeCards({ lang }) {
  return (
    <section className="bg-slate-50 border-y border-slate-200">
      <div className="mx-auto max-w-7xl px-5 py-20">
        <p className="hjc-section-tag">{L(lang, "Størrelser", "Sizes")}</p>
        <h2 className="mt-3 font-heading text-2xl md:text-3xl font-extrabold">{L(lang, "Shop efter størrelse", "Shop by size")}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {SIZES.map((size) => {
            return (
              <Link
                key={size}
                to={`${path("shop", lang)}?size=${size}`}
                className="group overflow-hidden border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-orange-400 hover:shadow-lg hover:shadow-slate-200/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                <div className="flex h-56 items-center justify-center bg-[#f3f5f4] p-5">
                  <Image
                    src={SIZE_IMAGES[size]}
                    alt={L(lang, `${size} container`, `${size} shipping container`)}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="hjc-label text-orange-600">{L(lang, "Shop efter størrelse", "Shop by size")}</p>
                      <h3 className="mt-2 font-heading text-2xl font-bold text-slate-950">{size}</h3>
                    </div>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-400 transition-colors group-hover:text-orange-500" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{COPY[size][lang]}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

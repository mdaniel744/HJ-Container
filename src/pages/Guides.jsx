import React from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { L, useLang } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { GUIDES } from "@/lib/guides";
import { useSeo, breadcrumbJsonLd } from "@/lib/seo";

export default function Guides() {
  const lang = useLang();
  const crumbs = [{ name: L(lang, "Forside", "Home"), path: path("home", lang) }, { name: L(lang, "Viden og rådgivning", "Guides and Advice") }];

  useSeo({
    lang,
    title: L(lang, "Viden og rådgivning om containere | HJ Container ApS", "Guides and advice on containers | HJ Container ApS"),
    description: L(lang,
      "Guides om containerstørrelser, valg af container, ny eller brugt, levering, aflæsning, underlag og vedligeholdelse.",
      "Guides on container sizes, choosing a container, new or used, delivery, unloading, ground preparation and maintenance."),
    daPath: "/viden", enPath: "/en/guides",
    jsonLd: [breadcrumbJsonLd(crumbs.filter((c) => c.path))],
  });

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-6 font-heading text-3xl md:text-4xl font-extrabold">{L(lang, "Viden og rådgivning", "Guides and Advice")}</h1>
      <p className="mt-4 text-slate-600 max-w-2xl">
        {L(lang, "Praktiske guides til dig, der skal vælge, købe, modtage og vedligeholde en container.",
          "Practical guides for choosing, buying, receiving and maintaining a container.")}
      </p>
      <div className="mt-10 grid gap-px bg-slate-200 border border-slate-200 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <Link key={g.slug.da} to={path("guide", lang, g.slug[lang])} className="bg-white p-6 hover:bg-slate-50">
            <h2 className="font-heading text-lg font-bold">{g.title[lang]}</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{g.intro[lang]}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import PageNotFoundContent from "@/components/site/PageNotFoundContent";
import { L, pick, useLang } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { COMPANY } from "@/lib/company";
import { useSeo, breadcrumbJsonLd } from "@/lib/seo";
import { useRegisterAltPath } from "@/lib/AltPath";

export default function Policy() {
  const lang = useLang();
  const { slug } = useParams();
  const { data: policies = [], isLoading } = useQuery({
    queryKey: ["policies"],
    queryFn: () => base44.entities.PolicyPage.filter({ published: true }, "sort_order", 50),
  });

  const page = policies.find((p) => p.slug_da === slug || p.slug_en === slug);
  useRegisterAltPath(page ? { da: path("policy", "da", page.slug_da), en: path("policy", "en", page.slug_en) } : null);

  const title = page ? pick(page, "title", lang) : "";
  const crumbs = [{ name: L(lang, "Forside", "Home"), path: path("home", lang) }, { name: title }];

  useSeo({
    lang,
    title: page ? `${title} | HJ Container ApS` : "404",
    description: page ? pick(page, "body", lang).slice(0, 158) : "",
    daPath: page && path("policy", "da", page.slug_da),
    enPath: page && path("policy", "en", page.slug_en),
    noindex: !page,
    jsonLd: page ? [breadcrumbJsonLd(crumbs.filter((c) => c.path))] : [],
  });

  if (isLoading) return <p className="mx-auto max-w-3xl px-5 py-20 hjc-mono text-sm text-slate-500">{L(lang, "Indlæser…", "Loading…")}</p>;
  if (!page) return <PageNotFoundContent />;

  const body = pick(page, "body", lang);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-6 font-heading text-3xl md:text-4xl font-extrabold">{title}</h1>
      <div className="mt-8 space-y-5 text-slate-700 leading-relaxed">
        {body.split("\n").filter((l) => l.trim()).map((paragraph, i) =>
          paragraph.startsWith("## ") ? (
            <h2 key={i} className="font-heading text-xl font-bold pt-4">{paragraph.replace("## ", "")}</h2>
          ) : (
            <p key={i}>{paragraph}</p>
          )
        )}
      </div>

      <div className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-600">
        <p className="font-semibold text-slate-900">{COMPANY.name}</p>
        <p>{COMPANY.street}, {COMPANY.postcode} {COMPANY.city}, {L(lang, COMPANY.country_da, COMPANY.country_en)}</p>
        <p className="hjc-mono text-[12px] mt-1">CVR {COMPANY.cvr} · EUID {COMPANY.euid} · {COMPANY.email}</p>
      </div>

      <nav className="mt-10" aria-label={L(lang, "Andre politikker", "Other policies")}>
        <p className="hjc-label mb-3">{L(lang, "Andre politikker", "Other policies")}</p>
        <ul className="grid sm:grid-cols-2 gap-2 text-sm">
          {policies.filter((p) => p.id !== page.id).map((p) => (
            <li key={p.id}>
              <Link to={path("policy", lang, pick(p, "slug", lang))} className="underline underline-offset-2 text-slate-700">
                {pick(p, "title", lang)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
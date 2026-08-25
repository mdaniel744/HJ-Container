import React from "react";
import { Link, useParams } from "@/lib/next-router";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import PageNotFoundContent from "@/components/site/PageNotFoundContent";
import { L, pick, useLang } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { COMPANY } from "@/lib/company";
import { useSeo, breadcrumbJsonLd } from "@/lib/seo";
import { useRegisterAltPath } from "@/lib/AltPath";
import { applyPolicyOverrides } from "@/lib/policyOverrides";
import { useSettings } from "@/lib/useCatalog";
import { POLICIES } from "@/data/content";

function PolicyBody({ body }) {
  const nodes = [];
  let bullets = [];
  const flushBullets = () => {
    if (!bullets.length) return;
    nodes.push(
      <ul key={`list-${nodes.length}`} className="list-disc pl-6 space-y-2">
        {bullets.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    );
    bullets = [];
  };

  body.split("\n").map((line) => line.trim()).filter(Boolean).forEach((line) => {
    if (line.startsWith("- ")) {
      bullets.push(line.slice(2));
      return;
    }
    flushBullets();
    if (line.startsWith("## ")) {
      nodes.push(<h2 key={`heading-${nodes.length}`} className="font-heading text-xl font-bold pt-4">{line.slice(3)}</h2>);
    } else {
      nodes.push(<p key={`paragraph-${nodes.length}`}>{line}</p>);
    }
  });
  flushBullets();
  return nodes;
}

export default function Policy() {
  const lang = useLang();
  const settings = useSettings();
  const { slug } = useParams();
  const policies = applyPolicyOverrides(POLICIES.filter((policy) => policy.published), settings);

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

  if (!page) return <PageNotFoundContent />;

  const body = pick(page, "body", lang);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-6 font-heading text-3xl md:text-4xl font-extrabold">{title}</h1>
      <div className="mt-8 space-y-5 text-slate-700 leading-relaxed">
        <PolicyBody body={body} />
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

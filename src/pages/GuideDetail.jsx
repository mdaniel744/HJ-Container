import React from "react";
import { Link, useParams } from "react-router-dom";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import PageNotFoundContent from "@/components/site/PageNotFoundContent";
import { L, useLang } from "@/lib/i18n";
import { COLLECTIONS, path } from "@/lib/routes";
import { GUIDES, guideBySlug } from "@/lib/guides";
import { useSeo, breadcrumbJsonLd } from "@/lib/seo";
import { useRegisterAltPath } from "@/lib/AltPath";

export default function GuideDetail() {
  const lang = useLang();
  const { slug } = useParams();
  const guide = guideBySlug(slug);

  useRegisterAltPath(guide ? { da: path("guide", "da", guide.slug.da), en: path("guide", "en", guide.slug.en) } : null);

  const crumbs = guide
    ? [
        { name: L(lang, "Forside", "Home"), path: path("home", lang) },
        { name: L(lang, "Viden og rådgivning", "Guides and Advice"), path: path("guides", lang) },
        { name: guide.title[lang] },
      ]
    : [];

  useSeo({
    lang,
    title: guide ? `${guide.title[lang]} | HJ Container ApS` : "404",
    description: guide ? guide.intro[lang] : "",
    daPath: guide && path("guide", "da", guide.slug.da),
    enPath: guide && path("guide", "en", guide.slug.en),
    noindex: !guide,
    jsonLd: guide
      ? [
          breadcrumbJsonLd(crumbs.filter((c) => c.path)),
          { "@context": "https://schema.org", "@type": "Article", headline: guide.title[lang], description: guide.intro[lang],
            inLanguage: lang === "en" ? "en" : "da-DK", author: { "@type": "Organization", name: "HJ Container ApS" },
            publisher: { "@type": "Organization", name: "HJ Container ApS" } },
        ]
      : [],
  });

  if (!guide) return <PageNotFoundContent />;

  const related = GUIDES.filter((g) => g.slug.da !== guide.slug.da).slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-6 font-heading text-3xl md:text-4xl font-extrabold">{guide.title[lang]}</h1>
      <p className="mt-5 text-lg text-slate-600 leading-relaxed">{guide.intro[lang]}</p>
      <div className="mt-8 space-y-5 text-slate-700 leading-relaxed">
        {guide.body[lang].map((p, i) => <p key={i}>{p}</p>)}
      </div>

      <div className="mt-10 border-l-4 border-orange-500 bg-slate-50 p-6">
        <p className="text-slate-700">
          {L(lang, "Se udvalget af ", "Browse our ")}
          {COLLECTIONS.filter((c) => c.kind === "type").map((c, i) => (
            <React.Fragment key={c.key}>
              {i > 0 && ", "}
              <Link to={path("category", lang, c.slug[lang])} className="underline font-semibold">{c.label[lang]}</Link>
            </React.Fragment>
          ))}
          {L(lang, " — eller ", " — or ")}
          <Link to={path("quote", lang)} className="underline font-semibold">{L(lang, "send en tilbudsforespørgsel", "send a quote request")}</Link>.
        </p>
      </div>

      <nav className="mt-10" aria-label={L(lang, "Relaterede guides", "Related guides")}>
        <p className="hjc-label mb-3">{L(lang, "Relaterede guides", "Related guides")}</p>
        <ul className="space-y-2 text-sm">
          {related.map((g) => (
            <li key={g.slug.da}>
              <Link to={path("guide", lang, g.slug[lang])} className="underline underline-offset-2">{g.title[lang]}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
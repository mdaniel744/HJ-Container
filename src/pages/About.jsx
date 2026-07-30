import React from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { L, useLang } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { COMPANY } from "@/lib/company";
import { MEDIA } from "@/lib/media";
import { useSeo, breadcrumbJsonLd, organizationJsonLd } from "@/lib/seo";

export default function About() {
  const lang = useLang();
  const crumbs = [{ name: L(lang, "Forside", "Home"), path: path("home", lang) }, { name: L(lang, "Om os", "About Us") }];

  useSeo({
    lang,
    title: L(lang, "Om HJ Container ApS | Containere i Danmark", "About HJ Container ApS | Containers in Denmark"),
    description: L(lang,
      "HJ Container ApS i Horsens sælger standard-, High Cube- og Open Side-containere i 10, 20 og 40 fod til private og erhverv.",
      "HJ Container ApS in Horsens, Denmark sells Standard, High Cube and Open Side containers in 10ft, 20ft and 40ft to private and business customers."),
    daPath: "/om-os", enPath: "/en/about-us",
    jsonLd: [breadcrumbJsonLd(crumbs.filter((c) => c.path)), { "@context": "https://schema.org", "@type": "AboutPage", name: "About HJ Container ApS", mainEntity: organizationJsonLd() }],
  });

  const sections = lang === "en"
    ? [
        ["What we do", "HJ Container ApS sells shipping containers in Denmark. Our range covers Standard, High Cube and Open Side containers in 10ft, 20ft and 40ft, in new (One Trip) and used condition. Every variant is listed with its own SKU, dimensions, weight and condition so you know exactly what you are buying."],
        ["Who we serve", "We supply both private customers who need secure storage on their own property and business customers who need containers for construction sites, workshops, storage and logistics. Business customers can order against invoice and add a purchase order reference at checkout."],
        ["How we select containers", "We describe each container by its documented properties rather than by general promises. Where CSC status or wind and watertight status is documented for a unit, we state it on the variant. Where information is not available, we leave the field out instead of guessing."],
        ["Ordering and quotations", "Variants with a fixed price, confirmed availability and a calculable delivery cost can be ordered directly on this website with payment by invoice or bank transfer. Multiple containers, restricted site access, special unloading or customised units are handled through a non-binding quote request so transport can be planned manually."],
      ]
    : [
        ["Hvad vi laver", "HJ Container ApS sælger containere i Danmark. Vores udvalg dækker standard-, High Cube- og Open Side-containere i 10, 20 og 40 fod i ny (One Trip) og brugt stand. Hver variant er oprettet med egen SKU, mål, vægt og stand, så du ved præcis hvad du køber."],
        ["Hvem vi handler med", "Vi leverer både til private, der har brug for sikker opbevaring på egen grund, og til erhvervskunder, der bruger containere til byggepladser, værksteder, lager og logistik. Erhvervskunder kan bestille mod faktura og angive indkøbsordrereference i kassen."],
        ["Sådan udvælger vi containere", "Vi beskriver hver container ud fra dokumenterede egenskaber frem for generelle løfter. Hvor CSC-status eller vind- og vandtæt status er dokumenteret for en enhed, oplyser vi det på varianten. Hvor oplysningen ikke findes, udelader vi feltet i stedet for at gætte."],
        ["Bestilling og tilbud", "Varianter med fast pris, bekræftet tilgængelighed og beregnelig fragt kan bestilles direkte her på sitet med betaling via faktura eller bankoverførsel. Flere containere, begrænset adgang, særlig aflæsning eller tilpassede enheder håndteres gennem en ikke-bindende tilbudsforespørgsel, så transporten kan planlægges manuelt."],
      ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-6 font-heading text-3xl md:text-4xl font-extrabold">{L(lang, "Om HJ Container ApS", "About HJ Container ApS")}</h1>
      <p className="mt-5 text-lg text-slate-600 max-w-3xl leading-relaxed">
        {L(lang,
          "HJ Container ApS er en dansk containervirksomhed med adresse i Horsens. Vi sælger containere til opbevaring, byggeri og logistik med tydelige produktoplysninger og priser i DKK.",
          "HJ Container ApS is a Danish container company based in Horsens. We sell containers for storage, construction and logistics with clear product information and prices in DKK.")}
      </p>

      <div className="mt-10 border border-slate-200 overflow-hidden">
        <Image src={MEDIA.lock} alt={L(lang, "Nærbillede af en containers låsemekanisme", "Close-up of a container locking mechanism")} className="w-full aspect-[21/9]" />
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        {sections.map(([title, text]) => (
          <section key={title}>
            <h2 className="font-heading text-xl font-bold">{title}</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">{text}</p>
          </section>
        ))}
      </div>

      <section className="mt-14 border-l-4 border-orange-500 bg-slate-50 p-8">
        <h2 className="font-heading text-xl font-bold">{L(lang, "Virksomhedsoplysninger", "Company information")}</h2>
        <address className="mt-4 not-italic text-slate-700 text-sm space-y-1">
          <p className="font-semibold">{COMPANY.name}</p>
          <p>{COMPANY.street}</p>
          <p>{COMPANY.postcode} {COMPANY.city}</p>
          <p>{L(lang, COMPANY.country_da, COMPANY.country_en)}</p>
          <p className="hjc-mono text-[12px] pt-2">CVR {COMPANY.cvr} · EUID {COMPANY.euid}</p>
          <p><a href={`mailto:${COMPANY.email}`} className="underline">{COMPANY.email}</a></p>
        </address>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={path("contact", lang)} className="bg-slate-900 text-white font-semibold px-6 py-3 text-sm">{L(lang, "Kontakt os", "Contact us")}</Link>
          <Link to={path("quote", lang)} className="border border-slate-900 font-semibold px-6 py-3 text-sm">{L(lang, "Få et tilbud", "Request a Quote")}</Link>
        </div>
      </section>
    </div>
  );
}
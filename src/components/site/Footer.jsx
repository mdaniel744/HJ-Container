import React from "react";
import Image from "next/image";
import { Link } from "@/lib/next-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { L, pick, useLang } from "@/lib/i18n";
import { path, CONTAINER_TYPES } from "@/lib/routes";
import { COMPANY } from "@/lib/company";
import { useSettings } from "@/lib/useCatalog";
import { GUIDES } from "@/lib/guides";
import { POLICIES } from "@/data/content";

const HIDDEN_POLICY_SLUGS = new Set([
  "handelsbetingelser",
  "privatlivspolitik",
  "cookiepolitik",
  "fortrydelsesret",
  "reklamation-og-garanti",
  "klageadgang-og-tvistloesning",
  "tilgaengelighedserklaering",
  "standardfortrydelsesformular",
]);

const COPYRIGHT_POLICY_LINKS = [
  ["privatlivspolitik", "Privatliv", "Privacy"],
  ["handelsbetingelser", "Vilkår", "Terms"],
  ["cookiepolitik", "Cookies", "Cookies"],
];

export default function Footer() {
  const lang = useLang();
  const settings = useSettings();
  const policies = POLICIES.filter((p) => p.published);

  return (
    <footer className="mt-24 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to={path("home", lang)} className="inline-flex" aria-label={L(lang, "HJ Containers — Forside", "HJ Containers — Home")}>
            <Image
              src="/brand/hj-containers-logo.png"
              alt="HJ Containers"
              width={1400}
              height={1050}
              unoptimized
              sizes="150px"
              className="h-28 w-auto object-contain"
            />
          </Link>
          <address className="mt-4 not-italic text-sm text-slate-600 space-y-2">
            <span className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
              {COMPANY.street}, {COMPANY.postcode} {COMPANY.city}, {L(lang, COMPANY.country_da, COMPANY.country_en)}
            </span>
            <a href={`mailto:${COMPANY.email}`} className="flex gap-2 hover:text-slate-900">
              <Mail className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />{COMPANY.email}
            </a>
            {settings.phone && (
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex gap-2 hover:text-slate-900">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />{settings.phone}
              </a>
            )}
          </address>
          <p className="hjc-mono text-[11px] text-slate-500 mt-4">CVR {COMPANY.cvr} · EUID {COMPANY.euid}</p>
        </div>

        <div>
          <p className="hjc-label mb-4">{L(lang, "Containere", "Containers")}</p>
          <ul className="space-y-2 text-sm text-slate-600">
            {CONTAINER_TYPES.map((c) => (
              <li key={c.key}>
                <Link className="hover:text-slate-900" to={path("category", lang, c.slug[lang])}>{c.label[lang]}</Link>
              </li>
            ))}
            <li><Link className="hover:text-slate-900" to={path("shop", lang)}>{L(lang, "Alle containere", "All containers")}</Link></li>
          </ul>
        </div>

        <div>
          <p className="hjc-label mb-4">{L(lang, "Information", "Information")}</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link className="hover:text-slate-900" to={path("about", lang)}>{L(lang, "Om os", "About Us")}</Link></li>
            <li><Link className="hover:text-slate-900" to={path("contact", lang)}>{L(lang, "Kontakt", "Contact")}</Link></li>
            <li><Link className="hover:text-slate-900" to={path("faq", lang)}>{L(lang, "Ofte stillede spørgsmål", "Frequently asked questions")}</Link></li>
            <li><Link className="hover:text-slate-900" to={path("quote", lang)}>{L(lang, "Anmod om tilbud", "Request a quote")}</Link></li>
            {settings.show_knowledge_centre !== false && (
              <li><Link className="hover:text-slate-900" to={path("guides", lang)}>{L(lang, "Viden og rådgivning", "Guides and Advice")}</Link></li>
            )}
            {GUIDES.slice(0, 3).map((g) => (
              <li key={g.slug.da}>
                <Link className="hover:text-slate-900" to={path("guide", lang, g.slug[lang])}>{g.title[lang]}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="hjc-label mb-4">{L(lang, "Vilkår og politikker", "Terms and policies")}</p>
          <ul className="space-y-2 text-sm text-slate-600">
            {policies.filter((p) => !HIDDEN_POLICY_SLUGS.has(p.slug_da)).map((p) => (
              <li key={p.id}>
                <Link className="hover:text-slate-900" to={path("policy", lang, pick(p, "slug", lang))}>{pick(p, "title", lang)}</Link>
              </li>
            ))}
            <li>
              <button
                onClick={() => window.dispatchEvent(new Event("hjc-open-cookie-settings"))}
                className="hover:text-slate-900 underline underline-offset-2"
              >
                {L(lang, "Cookieindstillinger", "Cookie settings")}
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-5 py-6 flex flex-col sm:flex-row gap-4 sm:items-end hjc-mono text-[11px] text-slate-500">
          <span>© {new Date().getFullYear()} HJ Container ApS</span>
          <div className="sm:ml-auto flex flex-col sm:items-end">
            <nav aria-label={L(lang, "Juridiske genveje", "Legal shortcuts")} className="flex flex-wrap gap-x-4 gap-y-1 sm:justify-end">
              {COPYRIGHT_POLICY_LINKS.map(([slug, da, en]) => {
                const policy = policies.find((item) => item.slug_da === slug);
                return policy ? (
                  <Link key={slug} className="hover:text-slate-900 underline underline-offset-2"
                    to={path("policy", lang, pick(policy, "slug", lang))}>
                    {L(lang, da, en)}
                  </Link>
                ) : null;
              })}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

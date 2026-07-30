import React, { useEffect, useState } from "react";
import { L, useLang } from "@/lib/i18n";

const KEY = "hjc_consent_v1";
const CATEGORIES = [
  { key: "necessary", da: "Nødvendige", en: "Necessary", locked: true,
    purpose_da: "Sikrer at kurv, formularer og sikkerhed fungerer.", purpose_en: "Keeps cart, forms and security working.",
    provider: "HJ Container ApS", duration_da: "Session – 12 måneder", duration_en: "Session – 12 months" },
  { key: "preferences", da: "Præferencer", en: "Preferences",
    purpose_da: "Husker sprogvalg og visningsindstillinger.", purpose_en: "Remembers language and display settings.",
    provider: "HJ Container ApS", duration_da: "12 måneder", duration_en: "12 months" },
  { key: "statistics", da: "Statistik", en: "Statistics",
    purpose_da: "Anonym måling af hvordan siden bruges.", purpose_en: "Anonymous measurement of site usage.",
    provider: "Google Analytics", duration_da: "Op til 24 måneder", duration_en: "Up to 24 months" },
  { key: "marketing", da: "Marketing", en: "Marketing",
    purpose_da: "Måling og målretning af annoncer.", purpose_en: "Ad measurement and targeting.",
    provider: "Google Ads", duration_da: "Op til 24 måneder", duration_en: "Up to 24 months" },
];

export function getConsent() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export default function CookieConsent() {
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [choice, setChoice] = useState({ necessary: true, preferences: false, statistics: false, marketing: false });

  useEffect(() => {
    if (!getConsent()) setOpen(true);
    const reopen = () => { setChoice(getConsent() || choice); setCustomize(true); setOpen(true); };
    window.addEventListener("hjc-open-cookie-settings", reopen);
    return () => window.removeEventListener("hjc-open-cookie-settings", reopen);
  }, []);

  const save = (value) => {
    localStorage.setItem(KEY, JSON.stringify({ ...value, necessary: true, timestamp: new Date().toISOString() }));
    setOpen(false);
    setCustomize(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] p-4" role="dialog" aria-modal="false" aria-label={L(lang, "Cookieindstillinger", "Cookie settings")}>
      <div className="mx-auto max-w-3xl bg-white border border-slate-300 shadow-2xl">
        <div className="p-6">
          <h2 className="font-heading font-bold text-lg text-slate-900">{L(lang, "Vi bruger cookies", "We use cookies")}</h2>
          <p className="mt-2 text-sm text-slate-600">
            {L(lang,
              "Nødvendige cookies er påkrævede for at siden fungerer. Statistik- og marketingcookies indlæses først, når du giver samtykke. Du kan ændre eller trække dit samtykke tilbage til enhver tid via Cookieindstillinger i footeren.",
              "Necessary cookies are required for the site to work. Statistics and marketing cookies are only loaded once you give consent. You can change or withdraw your consent at any time via Cookie settings in the footer.")}
          </p>

          {customize && (
            <ul className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
              {CATEGORIES.map((c) => (
                <li key={c.key} className="py-3 flex gap-4">
                  <input
                    id={`ck-${c.key}`}
                    type="checkbox"
                    className="mt-1 w-4 h-4"
                    disabled={c.locked}
                    checked={c.locked ? true : !!choice[c.key]}
                    onChange={(e) => setChoice({ ...choice, [c.key]: e.target.checked })}
                  />
                  <div className="text-sm">
                    <label htmlFor={`ck-${c.key}`} className="font-semibold text-slate-900">
                      {lang === "en" ? c.en : c.da} {c.locked && <span className="hjc-mono text-[10px] text-slate-400">({L(lang, "altid aktiv", "always active")})</span>}
                    </label>
                    <p className="text-slate-600">{lang === "en" ? c.purpose_en : c.purpose_da}</p>
                    <p className="hjc-mono text-[11px] text-slate-400 mt-1">
                      {c.provider} · {lang === "en" ? c.duration_en : c.duration_da}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button onClick={() => save({ preferences: true, statistics: true, marketing: true })}
              className="flex-1 bg-slate-900 text-white font-semibold py-3 px-5 text-sm">
              {L(lang, "Accepter alle", "Accept all")}
            </button>
            <button onClick={() => save({ preferences: false, statistics: false, marketing: false })}
              className="flex-1 border border-slate-300 text-slate-900 font-semibold py-3 px-5 text-sm hover:bg-slate-50">
              {L(lang, "Afvis alle", "Reject all")}
            </button>
            {customize ? (
              <button onClick={() => save(choice)} className="flex-1 border border-slate-900 text-slate-900 font-semibold py-3 px-5 text-sm hover:bg-slate-50">
                {L(lang, "Gem valg", "Save choices")}
              </button>
            ) : (
              <button onClick={() => setCustomize(true)} className="flex-1 border border-slate-300 text-slate-900 font-semibold py-3 px-5 text-sm hover:bg-slate-50">
                {L(lang, "Tilpas", "Customize")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
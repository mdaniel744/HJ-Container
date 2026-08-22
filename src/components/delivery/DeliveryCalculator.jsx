import React, { useState } from "react";
import { Link } from "@/lib/next-router";
import { Truck, AlertTriangle, Check } from "lucide-react";
import { L, formatDKK } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { DELIVERY_REASON, UNLOADING_OPTIONS, estimateDelivery } from "@/lib/delivery";

const ACCESS_QUESTIONS = [
  { key: "truck_access", da: "Kan en fuldstørrelse lastbil komme til pladsen?", en: "Can a full-size truck access the site?" },
  { key: "narrow_roads", da: "Er der smalle veje?", en: "Are there narrow roads?" },
  { key: "cables", da: "Er der luftledninger over placeringen?", en: "Are there overhead cables above the placement?" },
  { key: "ground", da: "Er underlaget plant og bærende?", en: "Is the ground level and load-bearing?" },
  { key: "behind", da: "Skal containeren placeres bag hegn eller bygning?", en: "Must it be placed behind a fence or building?" },
];

export default function DeliveryCalculator({ lang, variant, quantity = 1, onChange, compact = false }) {
  const [form, setForm] = useState({
    country: "DK", postcode: "", city: "", street: "", unloading: "", notes: "",
    access: { truck_access: "yes", narrow_roads: "no", cables: "no", ground: "yes", behind: "no" },
  });
  const [result, setResult] = useState(null);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const setAccess = (key, value) => setForm((f) => ({ ...f, access: { ...f.access, [key]: value } }));

  const calculate = (e) => {
    e.preventDefault();
    const r = estimateDelivery({
      country: form.country, postcode: form.postcode, size: variant?.size,
      quantity, unloading: form.unloading, siteAccess: form.access,
    });
    setResult(r);
    onChange?.({ form, result: r });
  };

  return (
    <form onSubmit={calculate} className="border border-slate-200 bg-slate-50/60 p-6">
      <div className="flex items-center gap-2">
        <Truck className="w-5 h-5 text-orange-500" />
        <h3 className="font-heading font-bold text-slate-900">{L(lang, "Beregn levering", "Calculate delivery")}</h3>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        {L(lang,
          "Fragtprisen afhænger af postnummer, antal, containerens mål, adgangsforhold, aflæsningsmetode og underlag.",
          "Shipping depends on postcode, quantity, container dimensions, site access, unloading method and ground conditions.")}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="hjc-label block mb-1.5">{L(lang, "Land", "Country")}</span>
          <select value={form.country} onChange={(e) => set({ country: e.target.value })} className="w-full border border-slate-300 px-3 py-2.5 bg-white">
            <option value="DK">{L(lang, "Danmark", "Denmark")}</option>
            <option value="OTHER">{L(lang, "Andet land", "Other country")}</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="hjc-label block mb-1.5">{L(lang, "Postnummer", "Postcode")}</span>
          <input inputMode="numeric" value={form.postcode} onChange={(e) => set({ postcode: e.target.value })}
            className="w-full border border-slate-300 px-3 py-2.5 bg-white" placeholder="8700" />
        </label>
        {!compact && (
          <>
            <label className="text-sm">
              <span className="hjc-label block mb-1.5">{L(lang, "By", "City")}</span>
              <input value={form.city} onChange={(e) => set({ city: e.target.value })} className="w-full border border-slate-300 px-3 py-2.5 bg-white" />
            </label>
            <label className="text-sm">
              <span className="hjc-label block mb-1.5">{L(lang, "Vej og nummer", "Street and number")}</span>
              <input value={form.street} onChange={(e) => set({ street: e.target.value })} className="w-full border border-slate-300 px-3 py-2.5 bg-white" />
            </label>
          </>
        )}
        <label className="text-sm sm:col-span-2">
          <span className="hjc-label block mb-1.5">{L(lang, "Aflæsningsmetode", "Unloading method")}</span>
          <select value={form.unloading} onChange={(e) => set({ unloading: e.target.value })} className="w-full border border-slate-300 px-3 py-2.5 bg-white">
            <option value="">{L(lang, "Vælg metode", "Select method")}</option>
            {UNLOADING_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{lang === "en" ? o.en : o.da}</option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="mt-5">
        <legend className="hjc-label mb-3">{L(lang, "Adgangsforhold", "Site access")}</legend>
        <ul className="space-y-2">
          {ACCESS_QUESTIONS.map((q) => (
            <li key={q.key} className="flex flex-wrap items-center justify-between gap-3 text-sm bg-white border border-slate-200 px-3 py-2">
              <span className="text-slate-700">{lang === "en" ? q.en : q.da}</span>
              <span className="flex gap-1">
                {["yes", "no"].map((v) => (
                  <button key={v} type="button" onClick={() => setAccess(q.key, v)} aria-pressed={form.access[q.key] === v}
                    className={`px-3 py-1 hjc-mono text-[11px] border ${form.access[q.key] === v ? "bg-slate-900 text-white border-slate-900" : "border-slate-300 text-slate-600"}`}>
                    {v === "yes" ? L(lang, "JA", "YES") : L(lang, "NEJ", "NO")}
                  </button>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </fieldset>

      <label className="block mt-4 text-sm">
        <span className="hjc-label block mb-1.5">{L(lang, "Bemærkninger (valgfrit)", "Notes (optional)")}</span>
        <textarea rows={2} value={form.notes} onChange={(e) => set({ notes: e.target.value })} className="w-full border border-slate-300 px-3 py-2.5 bg-white" />
      </label>

      <button type="submit" className="mt-5 w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 text-sm">
        {L(lang, "Beregn fragt", "Calculate shipping")}
      </button>

      {result && result.calculable && (
        <div className="mt-5 border border-emerald-200 bg-emerald-50 p-4 text-sm">
          <p className="flex items-center gap-2 font-semibold text-emerald-900">
            <Check className="w-4 h-4" /> {L(lang, "Fragt beregnet", "Shipping calculated")} — {result.zone}
          </p>
          <dl className="mt-3 space-y-1 hjc-mono text-[12px] text-emerald-900">
            <div className="flex justify-between"><dt>{L(lang, "Levering", "Delivery")}</dt><dd>{formatDKK(result.delivery_cost, lang)}</dd></div>
            <div className="flex justify-between"><dt>{L(lang, "Aflæsning", "Unloading")}</dt><dd>{formatDKK(result.unloading_cost, lang)}</dd></div>
            <div className="flex justify-between font-semibold"><dt>{L(lang, "I alt transport", "Transport total")}</dt><dd>{formatDKK(result.total, lang)}</dd></div>
          </dl>
        </div>
      )}

      {result && !result.calculable && (
        <div className="mt-5 border border-amber-300 bg-amber-50 p-4 text-sm">
          <p className="flex items-center gap-2 font-semibold text-amber-900">
            <AlertTriangle className="w-4 h-4" /> {L(lang, "Fragt kan ikke beregnes automatisk", "Shipping cannot be calculated automatically")}
          </p>
          <p className="mt-2 text-amber-900">{DELIVERY_REASON[result.reason]?.[lang]}</p>
          <p className="mt-2 text-amber-900">
            {L(lang, "Vi opgiver ikke en pris, vi ikke kan stå inde for. Send i stedet en ", "We do not state a price we cannot stand behind. Instead send a ")}
            <Link to={path("quote", lang)} className="underline font-semibold">{L(lang, "tilbudsforespørgsel", "quote request")}</Link>
            {L(lang, ", så planlægger vi transporten manuelt.", " and we will plan the transport manually.")}
          </p>
        </div>
      )}
    </form>
  );
}
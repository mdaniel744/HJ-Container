import React, { useState } from "react";
import { Link, useSearchParams } from "@/lib/next-router";
import { AlertTriangle, CheckCircle2, Plus, Trash2, Upload } from "lucide-react";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import StepBar from "@/components/checkout/StepBar";
import { CONDITION_LABEL, L, useLang } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { UNLOADING_OPTIONS } from "@/lib/delivery";
import { useProducts } from "@/lib/useCatalog";
import { useSeo } from "@/lib/seo";
import { COMPANY } from "@/lib/company";
import { STORE_ID } from "@/lib/supabase/client";
import { createInquiry } from "@/lib/supabase/inquiries";

const FIELD = "w-full border border-slate-300 px-3 py-2.5 text-sm bg-white";

export default function Quote() {
  const lang = useLang();
  const { products } = useProducts(lang);
  const [params] = useSearchParams();
  const [step, setStep] = useState(0);
  const [lines, setLines] = useState([
    { product_key: params.get("product") || "", size: params.get("size") || "20ft", condition: params.get("condition") || "used", color: "", quantity: 1 },
  ]);
  const [form, setForm] = useState({
    address: "", postcode: "", city: "", country: "Danmark", site_access: "", ground_condition: "",
    unloading_method: "", delivery_period: "", full_name: "", company_name: "", cvr: "", email: "", phone: "",
    notes: "", attachments: [],
  });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const setLine = (i, patch) => setLines((l) => l.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  useSeo({
    lang,
    title: L(lang, "Anmod om tilbud på container | HJ Container ApS", "Request a container quote | HJ Container ApS"),
    description: L(lang,
      "Send en ikke-bindende tilbudsforespørgsel på en eller flere containere. Vi planlægger transport og aflæsning individuelt.",
      "Send a non-binding quote request for one or more containers. We plan transport and unloading individually."),
    daPath: "/tilbud", enPath: "/en/quote",
  });

  const steps = lang === "en"
    ? ["Products", "Delivery", "Your details", "Notes & files", "Review"]
    : ["Produkter", "Levering", "Dine oplysninger", "Noter og filer", "Gennemgang"];

  // No backend is wired up yet, so uploads just record the local file name.
  const upload = (e) => {
    const files = Array.from(e.target.files || []);
    set({ attachments: [...form.attachments, ...files.map((f) => f.name)] });
  };

  const valid = () => {
    if (step === 0) return lines.every((l) => l.product_key && l.quantity > 0);
    if (step === 1) return form.postcode && form.city && form.unloading_method;
    if (step === 2) return form.full_name && form.email.includes("@") && form.phone;
    return true;
  };

  const lineSummary = (l) => {
    const name = (products.find((p) => p.id === l.product_key) || {}).name || "";
    return `${l.quantity} × ${name} — ${l.size}, ${CONDITION_LABEL[l.condition][lang]}${l.color ? `, ${l.color}` : ""}`;
  };

  const submit = async () => {
    setError("");
    if (!STORE_ID) {
      setError(L(lang, "Tilbudsforespørgsler tages ikke imod endnu. Skriv i stedet til contact@hjcontainer.com.",
        "Quote requests aren't being accepted yet. Please email contact@hjcontainer.com instead."));
      return;
    }
    setSubmitting(true);
    try {
      await createInquiry({
        productId: lines.length === 1 ? lines[0].product_key : null,
        name: form.full_name,
        email: form.email,
        phone: form.phone,
        message: [
          ...lines.map(lineSummary),
          `${L(lang, "Leveringssted", "Delivery location")}: ${form.address} ${form.postcode} ${form.city}`,
          `${L(lang, "Aflæsning", "Unloading")}: ${form.unloading_method}`,
          form.notes,
        ].filter(Boolean).join("\n"),
        details: {
          language: lang,
          lines,
          delivery: {
            address: form.address, postcode: form.postcode, city: form.city, country: form.country,
            site_access: form.site_access, ground_condition: form.ground_condition,
            unloading_method: form.unloading_method, delivery_period: form.delivery_period,
          },
          company_name: form.company_name, cvr: form.cvr,
          notes: form.notes, attachments: form.attachments,
        },
      });
      setSent(true);
    } catch (err) {
      setError(L(lang, "Forespørgslen kunne ikke sendes. Skriv i stedet til contact@hjcontainer.com.",
        "The request could not be sent. Please email contact@hjcontainer.com instead."));
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20">
        <CheckCircle2 className="w-12 h-12 text-emerald-600" strokeWidth={1.5} />
        <h1 className="mt-5 font-heading text-3xl font-extrabold">{L(lang, "Tak for din forespørgsel", "Thank you for your request")}</h1>
        <p className="mt-3 text-slate-600">
          {L(lang, "Forespørgslen er ikke bindende og er ikke et gennemført køb. Vi gennemgår oplysningerne og vender tilbage med et tilbud pr. e-mail.",
            "The request is non-binding and is not a completed purchase. We will review the details and return with an offer by email.")}
        </p>
        <p className="hjc-mono text-[11px] text-slate-500 mt-6">{COMPANY.name} · CVR {COMPANY.cvr} · {COMPANY.email}</p>
        <Link to={path("shop", lang)} className="inline-block mt-8 bg-slate-900 text-white font-semibold px-6 py-3 text-sm">
          {L(lang, "Tilbage til shop", "Back to shop")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Breadcrumbs items={[{ name: L(lang, "Forside", "Home"), path: path("home", lang) }, { name: L(lang, "Få et tilbud", "Request a Quote") }]} />
      <h1 className="mt-6 font-heading text-3xl font-extrabold">{L(lang, "Anmod om tilbud", "Request a quote")}</h1>
      <p className="mt-3 text-slate-600 max-w-2xl">
        {L(lang, "Brug denne formular til flere containere, særlige aflæsningsforhold, begrænset adgang eller varianter uden fast pris. Forespørgslen er ikke bindende.",
          "Use this form for multiple containers, special unloading requirements, restricted access or variants without a fixed price. The request is non-binding.")}
      </p>
      <div className="mt-6"><StepBar steps={steps} current={step} /></div>

      <div className="mt-8">
        {step === 0 && (
          <section className="space-y-6">
            {lines.map((l, i) => (
              <div key={i} className="border border-slate-200 p-5 grid gap-4 sm:grid-cols-2">
                <label className="text-sm sm:col-span-2"><span className="hjc-label block mb-1.5">{L(lang, "Containertype", "Container family")} *</span>
                  <select className={FIELD} value={l.product_key} onChange={(e) => setLine(i, { product_key: e.target.value })}>
                    <option value="">{L(lang, "Vælg", "Select")}</option>
                    {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </label>
                <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Størrelse", "Size")}</span>
                  <select className={FIELD} value={l.size} onChange={(e) => setLine(i, { size: e.target.value })}>
                    {["10ft", "20ft", "40ft"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Stand", "Condition")}</span>
                  <select className={FIELD} value={l.condition} onChange={(e) => setLine(i, { condition: e.target.value })}>
                    <option value="new">{CONDITION_LABEL.new[lang]}</option>
                    <option value="used">{CONDITION_LABEL.used[lang]}</option>
                  </select>
                </label>
                <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Ønsket farve (valgfrit)", "Preferred colour (optional)")}</span>
                  <input className={FIELD} value={l.color} onChange={(e) => setLine(i, { color: e.target.value })} /></label>
                <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Antal", "Quantity")}</span>
                  <input type="number" min="1" className={FIELD} value={l.quantity} onChange={(e) => setLine(i, { quantity: Number(e.target.value) })} /></label>
                {lines.length > 1 && (
                  <button onClick={() => setLines(lines.filter((_, idx) => idx !== i))}
                    className="sm:col-span-2 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4" /> {L(lang, "Fjern denne linje", "Remove this line")}
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => setLines([...lines, { product_key: "", size: "20ft", condition: "used", color: "", quantity: 1 }])}
              className="inline-flex items-center gap-2 border border-slate-900 px-5 py-3 text-sm font-semibold">
              <Plus className="w-4 h-4" /> {L(lang, "Tilføj en container mere", "Add another container")}
            </button>
          </section>
        )}

        {step === 1 && (
          <section className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm sm:col-span-2"><span className="hjc-label block mb-1.5">{L(lang, "Adresse", "Address")}</span>
              <input className={FIELD} value={form.address} onChange={(e) => set({ address: e.target.value })} /></label>
            <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Postnummer", "Postcode")} *</span>
              <input className={FIELD} value={form.postcode} onChange={(e) => set({ postcode: e.target.value })} /></label>
            <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "By", "City")} *</span>
              <input className={FIELD} value={form.city} onChange={(e) => set({ city: e.target.value })} /></label>
            <label className="text-sm sm:col-span-2"><span className="hjc-label block mb-1.5">{L(lang, "Adgangsforhold", "Site access")}</span>
              <textarea rows={3} className={FIELD} placeholder={L(lang, "Kan lastbil komme til? Smalle veje, luftledninger, hegn eller bygninger?", "Can a truck access the site? Narrow roads, overhead cables, fences or buildings?")}
                value={form.site_access} onChange={(e) => set({ site_access: e.target.value })} /></label>
            <label className="text-sm sm:col-span-2"><span className="hjc-label block mb-1.5">{L(lang, "Underlag", "Ground condition")}</span>
              <input className={FIELD} placeholder={L(lang, "Fx asfalt, beton, grus, jord", "E.g. asphalt, concrete, gravel, soil")}
                value={form.ground_condition} onChange={(e) => set({ ground_condition: e.target.value })} /></label>
            <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Aflæsningsmetode", "Unloading method")} *</span>
              <select className={FIELD} value={form.unloading_method} onChange={(e) => set({ unloading_method: e.target.value })}>
                <option value="">{L(lang, "Vælg", "Select")}</option>
                {UNLOADING_OPTIONS.map((o) => <option key={o.value} value={lang === "en" ? o.en : o.da}>{lang === "en" ? o.en : o.da}</option>)}
              </select>
            </label>
            <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Ønsket leveringsperiode", "Desired delivery period")}</span>
              <input className={FIELD} value={form.delivery_period} onChange={(e) => set({ delivery_period: e.target.value })} /></label>
          </section>
        )}

        {step === 2 && (
          <section className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Navn", "Name")} *</span>
              <input className={FIELD} value={form.full_name} onChange={(e) => set({ full_name: e.target.value })} /></label>
            <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Firma", "Company")}</span>
              <input className={FIELD} value={form.company_name} onChange={(e) => set({ company_name: e.target.value })} /></label>
            <label className="text-sm"><span className="hjc-label block mb-1.5">CVR</span>
              <input className={FIELD} value={form.cvr} onChange={(e) => set({ cvr: e.target.value })} /></label>
            <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "E-mail", "Email")} *</span>
              <input type="email" className={FIELD} value={form.email} onChange={(e) => set({ email: e.target.value })} /></label>
            <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Telefon", "Telephone")} *</span>
              <input className={FIELD} value={form.phone} onChange={(e) => set({ phone: e.target.value })} /></label>
          </section>
        )}

        {step === 3 && (
          <section>
            <label className="text-sm block"><span className="hjc-label block mb-1.5">{L(lang, "Bemærkninger", "Notes")}</span>
              <textarea rows={4} className={FIELD} value={form.notes} onChange={(e) => set({ notes: e.target.value })} /></label>
            <p className="hjc-label mt-6 mb-2">{L(lang, "Vedhæft billeder eller dokumenter (valgfrit)", "Attach photos or documents (optional)")}</p>
            <p className="text-sm text-slate-600">
              {L(lang, "Billeder af placering, adgangsvej og underlag hjælper os med at planlægge transporten korrekt.",
                "Photos of the placement area, access road and ground help us plan the transport correctly.")}
            </p>
            <label className="mt-4 inline-flex items-center gap-2 border border-slate-900 px-5 py-3 text-sm font-semibold cursor-pointer">
              <Upload className="w-4 h-4" /> {L(lang, "Vælg filer", "Choose files")}
              <input type="file" multiple accept="image/*,.pdf" className="sr-only" onChange={upload} />
            </label>
            {form.attachments.length > 0 && (
              <ul className="mt-4 space-y-1 hjc-mono text-[11px] text-slate-600">
                {form.attachments.map((a, i) => <li key={a}>{L(lang, "Fil", "File")} {i + 1}: {a.split("/").pop()}</li>)}
              </ul>
            )}
          </section>
        )}

        {step === 4 && (
          <section>
            <h2 className="font-heading text-xl font-bold">{L(lang, "Gennemgå din forespørgsel", "Review your request")}</h2>
            <ul className="mt-4 border border-slate-200 divide-y divide-slate-200 text-sm">
              {lines.map((l, i) => (
                <li key={i} className="px-4 py-3">{lineSummary(l)}</li>
              ))}
              <li className="px-4 py-3">{L(lang, "Leveringssted", "Delivery location")}: {form.address} {form.postcode} {form.city}</li>
              <li className="px-4 py-3">{L(lang, "Aflæsning", "Unloading")}: {form.unloading_method}</li>
              <li className="px-4 py-3">{L(lang, "Kontakt", "Contact")}: {form.full_name}, {form.email}, {form.phone}{form.company_name ? `, ${form.company_name}` : ""}</li>
            </ul>
            <p className="mt-5 border-l-4 border-orange-500 pl-4 text-sm text-slate-700">
              {L(lang, "Denne forespørgsel er ikke bindende og udgør ikke et gennemført køb.",
                "This request is non-binding and does not constitute a completed purchase.")}
            </p>
            {!STORE_ID && (
              <p className="mt-4 flex items-start gap-2 text-sm text-slate-600 border-l-2 border-orange-500 pl-3">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-orange-500" />
                {L(lang, "Tilbudsforespørgsler tages ikke imod endnu. Skriv i stedet til ",
                  "Quote requests aren't being accepted yet. Please email ")}
                <a href={`mailto:${COMPANY.email}`} className="underline">{COMPANY.email}</a>.
              </p>
            )}
            {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
            <button onClick={submit} disabled={!STORE_ID || submitting}
              className="mt-6 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-4">
              {submitting ? L(lang, "Sender…", "Sending…") : L(lang, "Send tilbudsforespørgsel", "Submit Quote Request")}
            </button>
          </section>
        )}
      </div>

      <div className="mt-8 flex justify-between border-t border-slate-200 pt-6">
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
          className="border border-slate-300 px-5 py-3 text-sm font-semibold disabled:opacity-40">{L(lang, "Tilbage", "Back")}</button>
        {step < 4 && (
          <button onClick={() => valid() && setStep((s) => s + 1)} disabled={!valid()}
            className="bg-slate-900 text-white px-6 py-3 text-sm font-semibold disabled:opacity-40">{L(lang, "Fortsæt", "Continue")}</button>
        )}
      </div>
    </div>
  );
}

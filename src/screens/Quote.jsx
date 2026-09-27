import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "@/lib/next-router";
import { AlertTriangle, CheckCircle2, Plus, Trash2, Upload } from "lucide-react";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import StepBar from "@/components/checkout/StepBar";
import { CONDITION_LABEL, L, useLang } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { UNLOADING_OPTIONS } from "@/lib/delivery";
import { useCategories, useProducts } from "@/lib/useCatalog";
import { CONTAINER_TYPES } from "@/lib/containerTypes";
import { findAttribute } from "@/lib/localize";
import { useSeo } from "@/lib/seo";
import { COMPANY } from "@/lib/company";
import { STORE_ID } from "@/lib/supabase/client";
import { createInquiry } from "@/lib/supabase/inquiries";

const FIELD = "w-full border border-slate-400 px-3 py-3 text-base text-slate-900 placeholder:text-slate-500 bg-white";
const SIZE_KEYS = ["Størrelse", "Size"];
const COLOR_KEYS = ["Farve", "Colour", "Color"];

function typeKeyForCategory(category) {
  const label = `${category?.slug || ""} ${category?.name || ""}`.toLowerCase();
  if (/high.?cube/.test(label)) return "high_cube";
  if (/open.?side/.test(label)) return "open_side";
  if (/standard/.test(label)) return "standard";
  if (/storage|opbevaring/.test(label)) return "storage";
  if (/office|kontor/.test(label)) return "office";
  return null;
}

function newLine(patch = {}) {
  return { type_key: "", product_id: null, size: "20ft", condition: "used", color: "", quantity: 1, ...patch };
}

export default function Quote() {
  const lang = useLang();
  const { products } = useProducts(lang);
  const { categories, isLoading: categoriesLoading } = useCategories(lang);
  const [params] = useSearchParams();
  const requestedProductId = params.get("product") || "";
  const requestedType = params.get("type") || "";
  const seededProductId = useRef("");
  const [step, setStep] = useState(0);
  const [lines, setLines] = useState([
    newLine({
      type_key: CONTAINER_TYPES.some((type) => type.key === requestedType) ? requestedType : "",
      product_id: requestedProductId || null,
      size: params.get("size") || (requestedType && !["standard", "high_cube", "open_side"].includes(requestedType) ? "" : "20ft"),
      condition: params.get("condition") || "used",
    }),
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

  const familyOptions = [
    ...CONTAINER_TYPES.map((type) => ({ value: type.key, label: type.label[lang] })),
    ...categories
      .filter((category) => !typeKeyForCategory(category))
      .map((category) => ({ value: `category:${category.id}`, label: category.name })),
  ];
  const requestedProduct = products.find((product) => product.id === requestedProductId);

  useEffect(() => {
    if (!requestedProduct || categoriesLoading || seededProductId.current === requestedProductId) return;
    seededProductId.current = requestedProductId;
    const category = categories.find((item) => item.id === requestedProduct.category_id);
    const typeKey = typeKeyForCategory(category) || (category ? `category:${category.id}` : `product:${requestedProduct.id}`);
    setLines((current) => current.map((line, index) => {
      if (index !== 0) return line;
      if (line.type_key && line.type_key !== typeKey) return { ...line, product_id: null };
      return {
        ...line,
        type_key: typeKey,
        product_id: requestedProduct.id,
        size: params.get("size") || findAttribute(requestedProduct.attributes, SIZE_KEYS) || line.size,
        condition: params.get("condition") || requestedProduct.condition || line.condition,
        color: findAttribute(requestedProduct.attributes, COLOR_KEYS) || line.color,
      };
    }));
  }, [categories, categoriesLoading, params, requestedProduct, requestedProductId]);

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
    if (step === 0) return lines.every((l) => l.type_key && Number.isFinite(l.quantity) && l.quantity > 0);
    if (step === 1) return form.country && form.postcode && form.city && form.unloading_method;
    if (step === 2) return form.full_name && form.email.includes("@") && form.phone;
    return true;
  };

  const lineSummary = (l) => {
    const linkedProduct = products.find((product) => product.id === l.product_id);
    const typeName = familyOptions.find((option) => option.value === l.type_key)?.label || linkedProduct?.name || l.type_key;
    const productName = linkedProduct ? ` (${linkedProduct.name}${linkedProduct.sku ? `, SKU ${linkedProduct.sku}` : ""})` : "";
    const details = [l.size, CONDITION_LABEL[l.condition]?.[lang], l.color].filter(Boolean).join(", ");
    return `${l.quantity} × ${typeName}${productName}${details ? ` — ${details}` : ""}`;
  };

  const requestBody = [
    L(lang, "Jeg vil gerne have et ikke-bindende tilbud på:", "I would like a non-binding quote for:"),
    ...lines.map(lineSummary),
    "",
    `${L(lang, "Leveringssted", "Delivery location")}: ${[form.address, form.postcode, form.city, form.country].filter(Boolean).join(", ")}`,
    `${L(lang, "Aflæsning", "Unloading")}: ${form.unloading_method}`,
    ...(form.site_access ? [`${L(lang, "Adgangsforhold", "Site access")}: ${form.site_access}`] : []),
    ...(form.ground_condition ? [`${L(lang, "Underlag", "Ground condition")}: ${form.ground_condition}`] : []),
    ...(form.delivery_period ? [`${L(lang, "Ønsket leveringsperiode", "Desired delivery period")}: ${form.delivery_period}`] : []),
    "",
    `${L(lang, "Navn", "Name")}: ${form.full_name}`,
    ...(form.company_name ? [`${L(lang, "Firma", "Company")}: ${form.company_name}${form.cvr ? ` (CVR ${form.cvr})` : ""}`] : []),
    `${L(lang, "E-mail", "Email")}: ${form.email}`,
    `${L(lang, "Telefon", "Telephone")}: ${form.phone}`,
    ...(form.notes ? ["", `${L(lang, "Bemærkninger", "Notes")}: ${form.notes}`] : []),
    ...(form.attachments.length ? ["", L(lang, "Vedhæft venligst de valgte filer til e-mailen:", "Please attach these selected files to the email:"), ...form.attachments] : []),
  ].join("\n");
  const requestMailto = `mailto:${COMPANY.email}?subject=${encodeURIComponent(L(lang, "Tilbudsforespørgsel fra hjemmesiden", "Quote request from website"))}&body=${encodeURIComponent(requestBody)}`;

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
        productId: lines.length === 1 ? lines[0].product_id : null,
        name: form.full_name,
        email: form.email,
        phone: form.phone,
        message: [
          ...lines.map(lineSummary),
          `${L(lang, "Leveringssted", "Delivery location")}: ${[form.address, form.postcode, form.city, form.country].filter(Boolean).join(", ")}`,
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
                  <select className={FIELD} value={l.type_key} onChange={(e) => {
                    const typeKey = e.target.value;
                    setLine(i, {
                      type_key: typeKey,
                      product_id: null,
                      size: ["standard", "high_cube", "open_side"].includes(typeKey)
                        ? (typeKey === "open_side" && l.size === "10ft" ? "20ft" : l.size || "20ft")
                        : "",
                    });
                  }}>
                    <option value="">{L(lang, "Vælg", "Select")}</option>
                    {familyOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    {l.type_key.startsWith("product:") && (
                      <option value={l.type_key}>{products.find((product) => `product:${product.id}` === l.type_key)?.name || L(lang, "Valgt container", "Selected container")}</option>
                    )}
                  </select>
                </label>
                <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Størrelse", "Size")}</span>
                  {["standard", "high_cube", "open_side"].includes(l.type_key) ? (
                    <select className={FIELD} value={l.size} onChange={(e) => setLine(i, { size: e.target.value, product_id: null })}>
                      {(l.type_key === "open_side" ? ["20ft", "40ft"] : ["10ft", "20ft", "40ft"]).map((size) => <option key={size} value={size}>{size}</option>)}
                    </select>
                  ) : (
                    <input className={FIELD} value={l.size} onChange={(e) => setLine(i, { size: e.target.value, product_id: null })}
                      placeholder={L(lang, "Skriv ønsket størrelse", "Enter preferred size")} />
                  )}
                </label>
                <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Stand", "Condition")}</span>
                  <select className={FIELD} value={l.condition} onChange={(e) => setLine(i, { condition: e.target.value, product_id: null })}>
                    <option value="new">{CONDITION_LABEL.new[lang]}</option>
                    <option value="used">{CONDITION_LABEL.used[lang]}</option>
                  </select>
                </label>
                <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Ønsket farve (valgfrit)", "Preferred colour (optional)")}</span>
                  <input className={FIELD} value={l.color} onChange={(e) => setLine(i, { color: e.target.value, product_id: null })} /></label>
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
            <button onClick={() => setLines([...lines, newLine()])}
              className="inline-flex items-center gap-2 border border-slate-900 px-5 py-3 text-sm font-semibold">
              <Plus className="w-4 h-4" /> {L(lang, "Tilføj en container mere", "Add another container")}
            </button>
          </section>
        )}

        {step === 1 && (
          <section className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm sm:col-span-2"><span className="hjc-label block mb-1.5">{L(lang, "Leveringsland", "Delivery country")} *</span>
              <input className={FIELD} list="quote-country-suggestions" value={form.country} onChange={(e) => set({ country: e.target.value })} />
              <datalist id="quote-country-suggestions"><option value="Danmark" /><option value="Denmark" /></datalist>
            </label>
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
            <p className="mt-2 text-sm text-slate-600">
              {L(lang, "Filer uploades ikke af formularen. Send dem separat til vores e-mail, eller vedhæft dem til e-mailudkastet.",
                "Files are not uploaded by this form. Send them separately by email, or attach them to the email draft.")}
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
                {L(lang, "Vi åbner et e-mailudkast med dine oplysninger. Gennemgå det, vedhæft eventuelle filer, og send det for at fuldføre forespørgslen.",
                  "We will open an email draft with your details. Review it, attach any files, and send it to complete the request.")}
              </p>
            )}
            {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
            {STORE_ID ? (
              <button onClick={submit} disabled={submitting}
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-4">
                {submitting ? L(lang, "Sender…", "Sending…") : L(lang, "Send tilbudsforespørgsel", "Submit Quote Request")}
              </button>
            ) : (
              <>
                <a href={requestMailto} className="mt-6 block w-full bg-orange-500 px-5 py-4 text-center font-semibold text-white hover:bg-orange-600">
                  {L(lang, "Åbn e-mailudkast", "Open email draft")}
                </a>
                <details className="mt-4 border border-slate-200 p-4 text-sm">
                  <summary className="cursor-pointer font-semibold text-slate-800">
                    {L(lang, "Intet e-mailprogram? Kopiér forespørgslen her", "No email app? Copy the request here")}
                  </summary>
                  <p className="mt-3 text-slate-600">{L(lang, "Send teksten til", "Send the text to")} <a className="underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.</p>
                  <textarea readOnly value={requestBody} rows={10} className={`${FIELD} mt-3`} aria-label={L(lang, "Forespørgselstekst", "Quote request text")} />
                </details>
              </>
            )}
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

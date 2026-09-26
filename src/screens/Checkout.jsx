import React, { useState } from "react";
import { Link } from "@/lib/next-router";
import { AlertTriangle, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import StepBar from "@/components/checkout/StepBar";
import { CONDITION_LABEL, L, formatDKK, useLang } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { useCart } from "@/lib/CartContext";
import { useSeo } from "@/lib/seo";
import { COMPANY } from "@/lib/company";

const FIELD = "w-full border border-slate-400 bg-white px-3 py-3 text-base text-slate-900 placeholder:text-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500";

export default function Checkout() {
  const lang = useLang();
  const { items, totalInclVat, totalExclVat, vatAmount } = useCart();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    customer_type: "private",
    full_name: "",
    company_name: "",
    cvr: "",
    email: "",
    phone: "",
    billing_address: "",
    billing_same_as_delivery: true,
    delivery_address: "",
    postcode: "",
    city: "",
    country: "Danmark",
    unloading_preference: "",
    delivery_instructions: "",
  });

  const set = (patch) => setForm((current) => ({ ...current, ...patch }));
  const steps = lang === "en"
    ? ["Details & delivery", "Review"]
    : ["Oplysninger og levering", "Gennemgang"];
  const billingAddress = form.billing_same_as_delivery
    ? `${form.delivery_address}, ${form.postcode} ${form.city}, ${form.country}`
    : form.billing_address;
  const detailsValid = Boolean(
    form.full_name.trim() &&
    form.email.includes("@") &&
    form.phone.trim() &&
    (form.billing_same_as_delivery || form.billing_address.trim()) &&
    form.delivery_address.trim() &&
    form.postcode.trim() &&
    form.city.trim() &&
    form.country.trim() &&
    (form.customer_type === "private" || (form.company_name.trim() && form.cvr.trim()))
  );
  const requestBody = [
    L(lang, "Jeg vil gerne have en samlet pris inkl. levering for:", "Please confirm a total price including delivery for:"),
    ...items.map((item) => `${item.quantity} × ${item.title} (${item.sku}) — ${formatDKK(item.unit_price_incl_vat * item.quantity, lang)}`),
    `${L(lang, "Varebeløb inkl. moms", "Products incl. VAT")}: ${formatDKK(totalInclVat, lang)}`,
    "",
    `${L(lang, "Navn", "Name")}: ${form.full_name}`,
    `${L(lang, "E-mail", "Email")}: ${form.email}`,
    `${L(lang, "Telefon", "Telephone")}: ${form.phone}`,
    ...(form.company_name ? [`${L(lang, "Firma", "Company")}: ${form.company_name} (CVR ${form.cvr})`] : []),
    `${L(lang, "Faktureringsadresse", "Billing address")}: ${billingAddress}`,
    `${L(lang, "Leveringsadresse", "Delivery address")}: ${form.delivery_address}, ${form.postcode} ${form.city}, ${form.country}`,
    ...(form.unloading_preference ? [`${L(lang, "Aflæsning", "Unloading")}: ${form.unloading_preference}`] : []),
    ...(form.delivery_instructions ? [`${L(lang, "Leveringsinstruktioner", "Delivery instructions")}: ${form.delivery_instructions}`] : []),
  ].join("\n");
  const requestMailto = `mailto:${COMPANY.email}?subject=${encodeURIComponent(L(lang, "Forespørgsel fra kurv", "Cart enquiry"))}&body=${encodeURIComponent(requestBody)}`;

  useSeo({
    lang,
    title: L(lang, "Kasse | HJ Container ApS", "Checkout | HJ Container ApS"),
    description: "",
    noindex: true,
  });

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="font-heading text-2xl font-extrabold">{L(lang, "Kurven er tom", "Your cart is empty")}</h1>
        <Link to={path("shop", lang)} className="mt-6 inline-block bg-slate-900 px-6 py-3 text-sm font-semibold text-white">
          {L(lang, "Se containere", "Browse containers")}
        </Link>
      </div>
    );
  }

  return (
    <div className="purchase-flow customer-form mx-auto max-w-6xl px-5 py-10 text-slate-800">
      <Breadcrumbs items={[
        { name: L(lang, "Forside", "Home"), path: path("home", lang) },
        { name: L(lang, "Kurv", "Cart"), path: path("cart", lang) },
        { name: L(lang, "Kasse", "Checkout") },
      ]} />
      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="hjc-section-tag">{L(lang, "Din bestilling", "Your order")}</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold">{L(lang, "Kasse", "Checkout")}</h1>
        </div>
        <Link to={path("cart", lang)} className="text-sm font-semibold text-slate-700 underline underline-offset-4">
          {L(lang, "Rediger kurv", "Edit cart")}
        </Link>
      </div>
      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
        {L(lang,
          "Udfyld dine oplysninger, og send en ikke-bindende forespørgsel via e-mail. Vi bekræfter fragt, aflæsning og den samlede pris særskilt.",
          "Enter your details, then email a non-binding request. We will confirm delivery, unloading and the total price separately.")}
      </p>
      <div className="mt-7"><StepBar steps={steps} current={step} /></div>

      <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          {step === 0 ? (
            <div className="space-y-8">
              <section>
                <h2 className="font-heading text-xl font-bold">{L(lang, "Kontaktoplysninger", "Contact details")}</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    ["private", L(lang, "Privatkunde", "Private customer")],
                    ["business", L(lang, "Erhvervskunde", "Business customer")],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => set({ customer_type: value })}
                      aria-pressed={form.customer_type === value}
                      className={`border px-4 py-2.5 text-base font-medium ${form.customer_type === value ? "border-slate-900 bg-slate-900 text-white" : "border-slate-400 text-slate-800"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm"><span className="hjc-label mb-1.5 block">{L(lang, "Fulde navn", "Full name")} *</span>
                    <input className={FIELD} autoComplete="name" value={form.full_name} onChange={(event) => set({ full_name: event.target.value })} /></label>
                  <label className="text-sm"><span className="hjc-label mb-1.5 block">{L(lang, "E-mail", "Email")} *</span>
                    <input type="email" className={FIELD} autoComplete="email" value={form.email} onChange={(event) => set({ email: event.target.value })} /></label>
                  <label className="text-sm"><span className="hjc-label mb-1.5 block">{L(lang, "Telefon", "Telephone")} *</span>
                    <input type="tel" className={FIELD} autoComplete="tel" value={form.phone} onChange={(event) => set({ phone: event.target.value })} /></label>
                  {form.customer_type === "business" && (
                    <>
                      <label className="text-sm"><span className="hjc-label mb-1.5 block">{L(lang, "Firmanavn", "Company name")} *</span>
                        <input className={FIELD} autoComplete="organization" value={form.company_name} onChange={(event) => set({ company_name: event.target.value })} /></label>
                      <label className="text-sm"><span className="hjc-label mb-1.5 block">CVR *</span>
                        <input className={FIELD} value={form.cvr} onChange={(event) => set({ cvr: event.target.value })} /></label>
                    </>
                  )}
                  <label className="flex items-center gap-3 text-sm font-medium text-slate-700 sm:col-span-2">
                    <input type="checkbox" className="h-4 w-4 accent-orange-500" checked={form.billing_same_as_delivery} onChange={(event) => set({ billing_same_as_delivery: event.target.checked })} />
                    {L(lang, "Faktureringsadresse er den samme som leveringsadressen", "Billing address is the same as delivery address")}
                  </label>
                  {!form.billing_same_as_delivery && (
                    <label className="text-sm sm:col-span-2"><span className="hjc-label mb-1.5 block">{L(lang, "Faktureringsadresse", "Billing address")} *</span>
                      <input className={FIELD} autoComplete="billing street-address" value={form.billing_address} onChange={(event) => set({ billing_address: event.target.value })} /></label>
                  )}
                </div>
              </section>

              <section className="border-t border-slate-200 pt-7">
                <h2 className="font-heading text-xl font-bold">{L(lang, "Leveringsadresse", "Delivery address")}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {L(lang, "Du behøver ikke beregne fragt nu. Oplys blot, hvor containeren skal leveres.", "No shipping calculation is needed now. Just tell us where the container should go.")}
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm sm:col-span-2"><span className="hjc-label mb-1.5 block">{L(lang, "Land", "Country")} *</span>
                    <input className={FIELD} list="checkout-countries" autoComplete="shipping country-name" value={form.country} onChange={(event) => set({ country: event.target.value })} />
                    <datalist id="checkout-countries"><option value="Danmark" /><option value="Denmark" /></datalist>
                  </label>
                  <label className="text-sm sm:col-span-2"><span className="hjc-label mb-1.5 block">{L(lang, "Adresse", "Street address")} *</span>
                    <input className={FIELD} autoComplete="shipping street-address" value={form.delivery_address} onChange={(event) => set({ delivery_address: event.target.value })} /></label>
                  <label className="text-sm"><span className="hjc-label mb-1.5 block">{L(lang, "Postnummer", "Postcode")} *</span>
                    <input className={FIELD} autoComplete="shipping postal-code" value={form.postcode} onChange={(event) => set({ postcode: event.target.value })} /></label>
                  <label className="text-sm"><span className="hjc-label mb-1.5 block">{L(lang, "By", "City")} *</span>
                    <input className={FIELD} autoComplete="shipping address-level2" value={form.city} onChange={(event) => set({ city: event.target.value })} /></label>
                  <label className="text-sm sm:col-span-2"><span className="hjc-label mb-1.5 block">{L(lang, "Foretrukken aflæsning", "Unloading preference")}</span>
                    <select className={FIELD} value={form.unloading_preference} onChange={(event) => set({ unloading_preference: event.target.value })}>
                      <option value="">{L(lang, "Vælg, hvis du ved det", "Select if known")}</option>
                      <option value="crane">{L(lang, "Kranbil", "Crane truck")}</option>
                      <option value="own_equipment">{L(lang, "Jeg sørger selv for aflæsning", "I will arrange unloading")}</option>
                      <option value="unsure">{L(lang, "Hjælp mig med at vælge", "Help me choose")}</option>
                    </select>
                  </label>
                  <label className="text-sm sm:col-span-2"><span className="hjc-label mb-1.5 block">{L(lang, "Leveringsinstruktioner", "Delivery instructions")}</span>
                    <textarea rows={3} className={FIELD} placeholder={L(lang, "Adgangsforhold eller særlige ønsker (valgfrit)", "Access details or special requests (optional)")} value={form.delivery_instructions} onChange={(event) => set({ delivery_instructions: event.target.value })} /></label>
                </div>
              </section>

              <button
                type="button"
                onClick={() => detailsValid && setStep(1)}
                disabled={!detailsValid}
                className="inline-flex w-full items-center justify-center gap-2 bg-slate-900 px-7 py-4 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                {L(lang, "Gennemgå oplysninger", "Review details")} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <section>
              <h2 className="font-heading text-xl font-bold">{L(lang, "Gennemgå din bestilling", "Review your order")}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {L(lang, "Fragt og aflæsning fastsættes efter gennemgang og er ikke medregnet i varebeløbet.", "Delivery and unloading are confirmed after review and are not included in the product amount.")}
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="border border-slate-200 p-5">
                  <h3 className="font-heading font-bold">{L(lang, "Kontakt og fakturering", "Contact and billing")}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {form.full_name}<br />{form.email}<br />{form.phone}<br />
                    {form.company_name && <>{form.company_name} · CVR {form.cvr}<br /></>}
                    {billingAddress}
                  </p>
                </div>
                <div className="border border-slate-200 p-5">
                  <h3 className="font-heading font-bold">{L(lang, "Levering", "Delivery")}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {form.delivery_address}<br />{form.postcode} {form.city}<br />{form.country}
                  </p>
                  {form.unloading_preference && <p className="mt-2 text-sm text-slate-600">{L(lang, "Aflæsning aftales ved bekræftelse.", "Unloading will be agreed during confirmation.")}</p>}
                  {form.delivery_instructions && <p className="mt-2 text-sm text-slate-600">{form.delivery_instructions}</p>}
                </div>
              </div>
              <p className="mt-6 flex items-start gap-2 border-l-2 border-orange-500 pl-4 text-sm leading-6 text-slate-700">
                <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-orange-500" />
                <span>
                  {L(lang, "Online bestilling er endnu ikke aktiveret. Send en ikke-bindende forespørgsel med dine oplysninger via e-mail; vi vender tilbage med den samlede pris, før du accepterer et køb.",
                    "Online order submission is not active yet. Email a non-binding request with your details; we will confirm the total price before you agree to buy.")}
                </span>
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button type="button" onClick={() => setStep(0)} className="border border-slate-400 px-6 py-3.5 text-base font-semibold">
                  {L(lang, "Rediger oplysninger", "Edit details")}
                </button>
                <a href={requestMailto} className="bg-orange-500 px-7 py-3.5 text-center text-base font-semibold text-white hover:bg-orange-600">
                  {L(lang, "Send forespørgsel via e-mail", "Email this request")}
                </a>
                <button type="button" disabled className="bg-orange-500 px-7 py-3.5 text-base font-semibold text-white opacity-50">
                  {L(lang, "Afgiv ordre", "Place Order")}
                </button>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {L(lang, "Se også vores ", "See our ")}
                <Link to={path("policy", lang, lang === "en" ? "terms-and-conditions" : "handelsbetingelser")} className="underline">{L(lang, "handelsbetingelser", "terms and conditions")}</Link>
                {L(lang, " og ", " and ")}
                <Link to={path("policy", lang, lang === "en" ? "privacy-policy" : "privatlivspolitik")} className="underline">{L(lang, "privatlivspolitik", "privacy policy")}</Link>.
              </p>
            </section>
          )}
        </div>

        <aside className="border border-slate-200 bg-slate-50 p-5 lg:sticky lg:top-8">
          <h2 className="font-heading text-lg font-bold">{L(lang, "Din kurv", "Your cart")}</h2>
          <ul className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
            {items.map((item) => (
              <li key={item.sku} className="flex justify-between gap-4 py-3 text-sm">
                <div>
                  <p className="font-semibold text-slate-900">{item.quantity} × {item.title}</p>
                  <p className="mt-1 text-slate-600">SKU {item.sku} · {item.size} · {CONDITION_LABEL[item.condition]?.[lang] || item.condition}</p>
                </div>
                <span className="shrink-0 font-semibold text-slate-900">{formatDKK(item.unit_price_incl_vat * item.quantity, lang)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 text-sm text-slate-700">
            <div className="flex justify-between gap-3"><dt>{L(lang, "Varer ekskl. moms", "Products excl. VAT")}</dt><dd>{formatDKK(totalExclVat, lang)}</dd></div>
            <div className="flex justify-between gap-3"><dt>{L(lang, "Moms (25%)", "VAT (25%)")}</dt><dd>{formatDKK(vatAmount, lang)}</dd></div>
            <div className="flex justify-between gap-3"><dt>{L(lang, "Levering og aflæsning", "Delivery and unloading")}</dt><dd className="text-right">{L(lang, "Bekræftes særskilt", "Confirmed separately")}</dd></div>
            <div className="flex justify-between gap-3 border-t border-slate-300 pt-3 text-base font-bold text-slate-950">
              <dt>{L(lang, "Varer i alt inkl. moms", "Products total incl. VAT")}</dt><dd>{formatDKK(totalInclVat, lang)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

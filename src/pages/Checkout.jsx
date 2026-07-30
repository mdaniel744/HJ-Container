import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { AlertTriangle } from "lucide-react";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import StepBar from "@/components/checkout/StepBar";
import DeliveryCalculator from "@/components/delivery/DeliveryCalculator";
import { CONDITION_LABEL, L, formatDKK, useLang } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { useCart } from "@/lib/CartContext";
import { UNLOADING_OPTIONS } from "@/lib/delivery";
import { useSeo } from "@/lib/seo";
import { TEMPLATES, sendTransactional } from "@/lib/emails";
import { COMPANY } from "@/lib/company";
import { useSettings } from "@/lib/useCatalog";

const FIELD = "w-full border border-slate-300 px-3 py-2.5 text-sm bg-white";

export default function Checkout() {
  const lang = useLang();
  const navigate = useNavigate();
  const { items, totalInclVat, totalExclVat, vatAmount, clear } = useCart();
  const settings = useSettings();
  const [step, setStep] = useState(0);
  const [delivery, setDelivery] = useState(null);
  const [deliveryForm, setDeliveryForm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customer_type: "private", full_name: "", company_name: "", cvr: "", email: "", phone: "",
    billing_address: "", delivery_address: "", postcode: "", city: "", country: "Danmark",
    delivery_instructions: "", po_reference: "", notes: "", payment_method: "invoice",
    accept_terms: false, newsletter_consent: false,
  });

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  useSeo({ lang, title: L(lang, "Kasse | HJ Container ApS", "Checkout | HJ Container ApS"), description: "", noindex: true });

  const steps = lang === "en"
    ? ["Cart review", "Your details", "Delivery address", "Delivery & unloading", "Payment", "Final review"]
    : ["Gennemgå kurv", "Dine oplysninger", "Leveringsadresse", "Levering og aflæsning", "Betaling", "Endelig gennemgang"];

  const size = items[0]?.size;
  const qty = items.reduce((s, i) => s + i.quantity, 0);
  const deliveryCost = delivery?.calculable ? delivery.delivery_cost : 0;
  const unloadingCost = delivery?.calculable ? delivery.unloading_cost : 0;
  const grandTotal = totalInclVat + deliveryCost + unloadingCost;

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="font-heading text-2xl font-extrabold">{L(lang, "Kurven er tom", "Your cart is empty")}</h1>
        <Link to={path("shop", lang)} className="inline-block mt-6 bg-slate-900 text-white font-semibold px-6 py-3 text-sm">
          {L(lang, "Se containere", "Browse containers")}
        </Link>
      </div>
    );
  }

  const stepValid = () => {
    if (step === 1) return form.full_name && form.email.includes("@") && form.phone && form.billing_address &&
      (form.customer_type === "private" || (form.company_name && form.cvr));
    if (step === 2) return form.delivery_address && form.postcode && form.city;
    if (step === 3) return delivery?.calculable;
    if (step === 5) return form.accept_terms;
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
    setError("");
    const order_number = `HJC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 899999)}`;
    const payload = {
      order_number, language: lang,
      ...form,
      unloading_method: UNLOADING_OPTIONS.find((o) => o.value === deliveryForm?.unloading)?.[lang === "en" ? "en" : "da"] || "",
      site_access: deliveryForm ? JSON.stringify(deliveryForm.access) : "",
      ground_condition: deliveryForm?.access?.ground === "yes" ? L(lang, "Plant og bærende", "Level and load-bearing") : L(lang, "Skal vurderes", "To be assessed"),
      items: items.map(({ sku, title, size, condition, quantity, unit_price_incl_vat, product_slug }) =>
        ({ sku, title, size, condition, quantity, unit_price_incl_vat, product_slug })),
      subtotal_excl_vat: Math.round(totalExclVat * 100) / 100,
      vat_amount: Math.round(vatAmount * 100) / 100,
      delivery_cost: deliveryCost,
      unloading_cost: unloadingCost,
      total_incl_vat: grandTotal,
      status: "new",
    };
    delete payload.accept_terms;
    try {
      const order = await base44.entities.Order.create(payload);
      const tpl = TEMPLATES.order_received(payload, lang);
      await sendTransactional(form.email, tpl.subject, tpl.body);
      await sendTransactional(settings.notification_email || COMPANY.email, `${L(lang, "Ny ordre", "New order")} ${order_number}`, tpl.body);
      clear();
      navigate(`${path("confirmation", lang)}?order=${order.order_number}`);
    } catch (e) {
      setError(L(lang, "Ordren kunne ikke gemmes. Prøv igen, eller kontakt os på contact@hjcontainer.com.",
        "The order could not be saved. Please try again or contact us at contact@hjcontainer.com."));
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Breadcrumbs items={[{ name: L(lang, "Forside", "Home"), path: path("home", lang) }, { name: L(lang, "Kurv", "Cart"), path: path("cart", lang) }, { name: L(lang, "Kasse", "Checkout") }]} />
      <h1 className="mt-6 font-heading text-3xl font-extrabold">{L(lang, "Kasse", "Checkout")}</h1>
      <div className="mt-6"><StepBar steps={steps} current={step} /></div>

      <div className="mt-8">
        {step === 0 && (
          <section>
            <h2 className="font-heading text-xl font-bold">{steps[0]}</h2>
            <ul className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
              {items.map((i) => (
                <li key={i.sku} className="py-4 flex justify-between gap-4 text-sm">
                  <span>
                    <span className="font-medium">{i.quantity} × {i.title}</span>
                    <span className="block hjc-mono text-[11px] text-slate-500">SKU {i.sku} · {i.size} · {CONDITION_LABEL[i.condition]?.[lang]}</span>
                  </span>
                  <span className="hjc-mono">{formatDKK(i.unit_price_incl_vat * i.quantity, lang)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 hjc-mono text-[12px] text-slate-600">
              {L(lang, "Varer i alt inkl. moms", "Items total incl. VAT")}: {formatDKK(totalInclVat, lang)}
            </p>
          </section>
        )}

        {step === 1 && (
          <section>
            <h2 className="font-heading text-xl font-bold">{steps[1]}</h2>
            <div className="mt-4 flex gap-2">
              {[["private", L(lang, "Privatkunde", "Private customer")], ["business", L(lang, "Erhvervskunde", "Business customer")]].map(([v, label]) => (
                <button key={v} onClick={() => set({ customer_type: v })} aria-pressed={form.customer_type === v}
                  className={`px-4 py-2.5 border text-sm ${form.customer_type === v ? "bg-slate-900 text-white border-slate-900" : "border-slate-300"}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Fulde navn", "Full name")} *</span>
                <input className={FIELD} value={form.full_name} onChange={(e) => set({ full_name: e.target.value })} /></label>
              <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "E-mail", "Email")} *</span>
                <input type="email" className={FIELD} value={form.email} onChange={(e) => set({ email: e.target.value })} /></label>
              <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Telefon", "Telephone")} *</span>
                <input className={FIELD} value={form.phone} onChange={(e) => set({ phone: e.target.value })} /></label>
              {form.customer_type === "business" && (
                <>
                  <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Firmanavn", "Company name")} *</span>
                    <input className={FIELD} value={form.company_name} onChange={(e) => set({ company_name: e.target.value })} /></label>
                  <label className="text-sm"><span className="hjc-label block mb-1.5">CVR *</span>
                    <input className={FIELD} value={form.cvr} onChange={(e) => set({ cvr: e.target.value })} /></label>
                  <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Indkøbsordre / reference", "Purchase order reference")}</span>
                    <input className={FIELD} value={form.po_reference} onChange={(e) => set({ po_reference: e.target.value })} /></label>
                </>
              )}
              <label className="text-sm sm:col-span-2"><span className="hjc-label block mb-1.5">{L(lang, "Faktureringsadresse", "Billing address")} *</span>
                <input className={FIELD} value={form.billing_address} onChange={(e) => set({ billing_address: e.target.value })} /></label>
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h2 className="font-heading text-xl font-bold">{steps[2]}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm sm:col-span-2"><span className="hjc-label block mb-1.5">{L(lang, "Leveringsadresse", "Delivery address")} *</span>
                <input className={FIELD} value={form.delivery_address} onChange={(e) => set({ delivery_address: e.target.value })} /></label>
              <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Postnummer", "Postcode")} *</span>
                <input className={FIELD} value={form.postcode} onChange={(e) => set({ postcode: e.target.value })} /></label>
              <label className="text-sm"><span className="hjc-label block mb-1.5">{L(lang, "By", "City")} *</span>
                <input className={FIELD} value={form.city} onChange={(e) => set({ city: e.target.value })} /></label>
              <label className="text-sm sm:col-span-2"><span className="hjc-label block mb-1.5">{L(lang, "Leveringsinstruktioner", "Delivery instructions")}</span>
                <textarea rows={3} className={FIELD} value={form.delivery_instructions} onChange={(e) => set({ delivery_instructions: e.target.value })} /></label>
              <label className="text-sm sm:col-span-2"><span className="hjc-label block mb-1.5">{L(lang, "Bemærkninger", "Notes")}</span>
                <textarea rows={2} className={FIELD} value={form.notes} onChange={(e) => set({ notes: e.target.value })} /></label>
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <h2 className="font-heading text-xl font-bold">{steps[3]}</h2>
            <div className="mt-5">
              <DeliveryCalculator lang={lang} variant={{ size }} quantity={qty} compact
                onChange={({ form: f, result }) => { setDeliveryForm(f); setDelivery(result); if (f.postcode) set({ postcode: f.postcode }); }} />
            </div>
            {delivery && !delivery.calculable && (
              <p className="mt-4 text-sm text-slate-700">
                {L(lang, "Direkte køb er ikke muligt for denne leveringskonfiguration. ", "Direct checkout is not available for this delivery configuration. ")}
                <Link to={path("quote", lang)} className="underline font-semibold">{L(lang, "Send en tilbudsforespørgsel", "Send a quote request")}</Link>.
              </p>
            )}
          </section>
        )}

        {step === 4 && (
          <section>
            <h2 className="font-heading text-xl font-bold">{steps[4]}</h2>
            <div className="mt-5 space-y-3">
              {[["invoice", L(lang, "Faktura", "Invoice"), L(lang, "Vi sender en faktura med betalingsoplysninger efter gennemgang af ordren.", "We send an invoice with payment details after reviewing the order.")],
                ["bank_transfer", L(lang, "Bankoverførsel", "Bank transfer"), L(lang, "Du modtager kontooplysninger pr. e-mail og overfører beløbet inden levering.", "You receive account details by email and transfer the amount before delivery.")]].map(([v, title, desc]) => (
                <label key={v} className={`flex gap-3 border p-4 cursor-pointer ${form.payment_method === v ? "border-slate-900" : "border-slate-300"}`}>
                  <input type="radio" name="payment" className="mt-1" checked={form.payment_method === v} onChange={() => set({ payment_method: v })} />
                  <span>
                    <span className="font-heading font-bold block">{title}</span>
                    <span className="text-sm text-slate-600">{desc}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>
        )}

        {step === 5 && (
          <section>
            <h2 className="font-heading text-xl font-bold">{steps[5]}</h2>
            <dl className="mt-5 border border-slate-200 divide-y divide-slate-200 text-sm">
              {[
                [L(lang, "Varer", "Items"), items.map((i) => `${i.quantity} × ${i.title} (${i.sku})`).join(", ")],
                [L(lang, "Pris ekskl. moms", "Price excl. VAT"), formatDKK(totalExclVat, lang)],
                [L(lang, "Moms (25%)", "VAT (25%)"), formatDKK(vatAmount, lang)],
                [L(lang, "Levering", "Delivery"), formatDKK(deliveryCost, lang)],
                [L(lang, "Aflæsning", "Unloading"), formatDKK(unloadingCost, lang)],
                [L(lang, "Total inkl. moms", "Total incl. VAT"), formatDKK(grandTotal, lang)],
                [L(lang, "Leveringsadresse", "Delivery address"), `${form.delivery_address}, ${form.postcode} ${form.city}`],
                [L(lang, "Forventet leveringsperiode", "Estimated delivery period"), L(lang, "Planlægges efter ordregennemgang og bekræftes pr. e-mail", "Planned after order review and confirmed by email")],
                [L(lang, "Betalingsmetode", "Payment method"), form.payment_method === "invoice" ? L(lang, "Faktura", "Invoice") : L(lang, "Bankoverførsel", "Bank transfer")],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 px-4 py-3">
                  <dt className="text-slate-500">{k}</dt><dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 space-y-3 text-sm">
              <label className="flex gap-3">
                <input type="checkbox" className="mt-1 w-4 h-4" checked={form.accept_terms} onChange={(e) => set({ accept_terms: e.target.checked })} />
                <span>
                  {L(lang, "Jeg accepterer ", "I accept the ")}
                  <Link to={path("policy", lang, lang === "en" ? "terms-and-conditions" : "handelsbetingelser")} className="underline">{L(lang, "handelsbetingelserne", "terms and conditions")}</Link>,{" "}
                  <Link to={path("policy", lang, lang === "en" ? "shipping-and-delivery" : "levering-og-fragt")} className="underline">{L(lang, "levering og fragt", "shipping and delivery")}</Link>,{" "}
                  <Link to={path("policy", lang, lang === "en" ? "returns-and-refunds" : "returnering-og-tilbagebetaling")} className="underline">{L(lang, "returnering og tilbagebetaling", "returns and refunds")}</Link>,{" "}
                  <Link to={path("policy", lang, lang === "en" ? "right-of-withdrawal" : "fortrydelsesret")} className="underline">{L(lang, "fortrydelsesret", "right of withdrawal")}</Link>
                  {L(lang, " og ", " and the ")}
                  <Link to={path("policy", lang, lang === "en" ? "privacy-policy" : "privatlivspolitik")} className="underline">{L(lang, "privatlivspolitikken", "privacy policy")}</Link>. *
                </span>
              </label>
              <label className="flex gap-3">
                <input type="checkbox" className="mt-1 w-4 h-4" checked={form.newsletter_consent} onChange={(e) => set({ newsletter_consent: e.target.checked })} />
                <span>{L(lang, "Ja tak, send mig nyheder om containere (valgfrit).", "Yes, send me news about containers (optional).")}</span>
              </label>
            </div>

            {error && (
              <p className="mt-4 flex items-center gap-2 text-sm text-red-700"><AlertTriangle className="w-4 h-4" />{error}</p>
            )}

            <button disabled={!stepValid() || submitting} onClick={submit}
              className="mt-6 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-4">
              {submitting ? L(lang, "Sender ordre…", "Submitting order…") : L(lang, "Afgiv bindende ordre med betalingspligt", "Place binding order with obligation to pay")}
            </button>
          </section>
        )}
      </div>

      <div className="mt-8 flex justify-between border-t border-slate-200 pt-6">
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
          className="border border-slate-300 px-5 py-3 text-sm font-semibold disabled:opacity-40">
          {L(lang, "Tilbage", "Back")}
        </button>
        {step < 5 && (
          <button onClick={() => stepValid() && setStep((s) => s + 1)} disabled={!stepValid()}
            className="bg-slate-900 text-white px-6 py-3 text-sm font-semibold disabled:opacity-40">
            {L(lang, "Fortsæt", "Continue")}
          </button>
        )}
      </div>
    </div>
  );
}
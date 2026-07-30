import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { L, useLang } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { COMPANY } from "@/lib/company";
import { useSettings } from "@/lib/useCatalog";
import { useSeo, breadcrumbJsonLd, organizationJsonLd } from "@/lib/seo";
import { TEMPLATES, sendTransactional } from "@/lib/emails";

const FIELD = "w-full border border-slate-300 px-3 py-2.5 text-sm bg-white";
const CATEGORIES = [
  ["product", "Produktspørgsmål", "Product question"],
  ["delivery", "Spørgsmål om levering", "Delivery question"],
  ["order", "Eksisterende ordre", "Existing order"],
  ["return", "Returnering eller reklamation", "Return or complaint"],
  ["business", "Erhvervshenvendelse", "Business enquiry"],
  ["other", "Andet", "Other"],
];

export default function Contact() {
  const lang = useLang();
  const settings = useSettings();
  const [form, setForm] = useState({ name: "", email: "", phone: "", category: "product", message: "", human: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const crumbs = [{ name: L(lang, "Forside", "Home"), path: path("home", lang) }, { name: L(lang, "Kontakt", "Contact") }];

  useSeo({
    lang,
    title: L(lang, "Kontakt HJ Container ApS | Horsens", "Contact HJ Container ApS | Horsens, Denmark"),
    description: L(lang,
      "Kontakt HJ Container ApS på contact@hjcontainer.com eller send en besked via kontaktformularen. Adresse: Endelavevej 8A, 8700 Horsens.",
      "Contact HJ Container ApS at contact@hjcontainer.com or send a message via the contact form. Address: Endelavevej 8A, 8700 Horsens, Denmark."),
    daPath: "/kontakt", enPath: "/en/contact",
    jsonLd: [breadcrumbJsonLd(crumbs.filter((c) => c.path)), { "@context": "https://schema.org", "@type": "ContactPage", mainEntity: organizationJsonLd() }],
  });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.human.trim() !== "4") {
      setError(L(lang, "Svar venligst korrekt på kontrolspørgsmålet.", "Please answer the verification question correctly."));
      return;
    }
    try {
      await base44.entities.ContactMessage.create({
        name: form.name, email: form.email, phone: form.phone,
        category: form.category, message: form.message, language: lang,
      });
      const tpl = TEMPLATES.contact_received(form, lang);
      await sendTransactional(form.email, tpl.subject, tpl.body);
      await sendTransactional(settings.notification_email || COMPANY.email, `${L(lang, "Ny henvendelse", "New enquiry")} — ${form.name}`, tpl.body);
      setSent(true);
    } catch (err) {
      setError(L(lang, "Beskeden kunne ikke sendes. Skriv i stedet til contact@hjcontainer.com.",
        "The message could not be sent. Please email contact@hjcontainer.com instead."));
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-6 font-heading text-3xl md:text-4xl font-extrabold">{L(lang, "Kontakt", "Contact")}</h1>

      <div className="mt-10 grid lg:grid-cols-2 gap-12">
        <div>
          <address className="not-italic text-slate-700 space-y-3">
            <p className="font-heading font-bold text-lg">{COMPANY.name}</p>
            <p className="flex gap-2"><MapPin className="w-4 h-4 mt-1 text-slate-400 shrink-0" />
              {COMPANY.street}<br />{COMPANY.postcode} {COMPANY.city}<br />{L(lang, COMPANY.country_da, COMPANY.country_en)}
            </p>
            <p className="flex gap-2"><Mail className="w-4 h-4 mt-1 text-slate-400 shrink-0" />
              <a href={`mailto:${COMPANY.email}`} className="underline">{COMPANY.email}</a>
            </p>
            {settings.phone && (
              <p className="flex gap-2"><Phone className="w-4 h-4 mt-1 text-slate-400 shrink-0" />
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="underline">{settings.phone}</a>
              </p>
            )}
            <p className="hjc-mono text-[12px] text-slate-500">CVR {COMPANY.cvr} · EUID {COMPANY.euid}</p>
          </address>

          {(settings.business_hours_da || settings.business_hours_en) && (
            <div className="mt-8">
              <p className="hjc-label mb-2">{L(lang, "Åbningstider", "Business hours")}</p>
              <p className="text-sm text-slate-600 whitespace-pre-line">
                {lang === "en" ? settings.business_hours_en || settings.business_hours_da : settings.business_hours_da}
              </p>
            </div>
          )}

          <div className="mt-8 border border-slate-200 overflow-hidden">
            <iframe
              title={L(lang, "Kort over Endelavevej 8A, 8700 Horsens", "Map of Endelavevej 8A, 8700 Horsens")}
              className="w-full h-64"
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=9.82%2C55.84%2C9.90%2C55.89&layer=mapnik"
            />
          </div>

          <p className="mt-6 text-sm text-slate-600">
            {L(lang, "Skal du have en pris på flere containere eller særlig aflæsning? ", "Need a price for several containers or special unloading? ")}
            <Link to={path("quote", lang)} className="underline font-semibold">{L(lang, "Send en tilbudsforespørgsel", "Send a quote request")}</Link>.
          </p>
        </div>

        <div>
          {sent ? (
            <div className="border border-emerald-200 bg-emerald-50 p-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" strokeWidth={1.5} />
              <h2 className="mt-3 font-heading font-bold text-lg">{L(lang, "Tak for din besked", "Thank you for your message")}</h2>
              <p className="mt-2 text-sm text-emerald-900">
                {L(lang, "Vi har registreret din henvendelse og svarer pr. e-mail hurtigst muligt.",
                  "We have registered your enquiry and will reply by email as soon as possible.")}
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="border border-slate-200 p-6 space-y-4">
              <h2 className="font-heading font-bold text-lg">{L(lang, "Skriv til os", "Send us a message")}</h2>
              <label className="block text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Henvendelsestype", "Enquiry type")}</span>
                <select className={FIELD} value={form.category} onChange={(e) => set({ category: e.target.value })}>
                  {CATEGORIES.map(([v, da, en]) => <option key={v} value={v}>{lang === "en" ? en : da}</option>)}
                </select>
              </label>
              <label className="block text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Navn", "Name")} *</span>
                <input required className={FIELD} value={form.name} onChange={(e) => set({ name: e.target.value })} /></label>
              <label className="block text-sm"><span className="hjc-label block mb-1.5">{L(lang, "E-mail", "Email")} *</span>
                <input required type="email" className={FIELD} value={form.email} onChange={(e) => set({ email: e.target.value })} /></label>
              <label className="block text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Telefon", "Telephone")}</span>
                <input className={FIELD} value={form.phone} onChange={(e) => set({ phone: e.target.value })} /></label>
              <label className="block text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Besked", "Message")} *</span>
                <textarea required rows={5} className={FIELD} value={form.message} onChange={(e) => set({ message: e.target.value })} /></label>
              <label className="block text-sm"><span className="hjc-label block mb-1.5">{L(lang, "Kontrolspørgsmål: hvad er 2 + 2?", "Verification: what is 2 + 2?")} *</span>
                <input required className={FIELD} value={form.human} onChange={(e) => set({ human: e.target.value })} /></label>
              {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5">
                {L(lang, "Send besked", "Send message")}
              </button>
              <p className="text-xs text-slate-500">
                {L(lang, "Vi behandler dine oplysninger efter vores ", "We process your information in accordance with our ")}
                <Link to={path("policy", lang, lang === "en" ? "privacy-policy" : "privatlivspolitik")} className="underline">
                  {L(lang, "privatlivspolitik", "privacy policy")}
                </Link>.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
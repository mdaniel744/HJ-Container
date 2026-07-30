import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { COMPANY } from "@/lib/company";
import { buildSitemapXml } from "@/lib/merchant";
import { COLLECTIONS, ROUTES } from "@/lib/routes";
import { GUIDES } from "@/lib/guides";

const FIELD = "w-full border border-slate-300 px-3 py-2 text-sm";

export default function SettingsAdmin({ settings, products, policies, reload }) {
  const [form, setForm] = useState({
    phone: settings.phone || "",
    business_hours_da: settings.business_hours_da || "",
    business_hours_en: settings.business_hours_en || "",
    notification_email: settings.notification_email || COMPANY.email,
    show_knowledge_centre: settings.show_knowledge_centre !== false,
    show_prices_excl_vat: settings.show_prices_excl_vat !== false,
  });
  const [saved, setSaved] = useState(false);

  const save = async () => {
    if (settings.id) await base44.entities.SiteSetting.update(settings.id, form);
    else await base44.entities.SiteSetting.create(form);
    setSaved(true);
    reload();
  };

  const downloadSitemap = () => {
    const urls = [
      { da: ROUTES.home.da, en: ROUTES.home.en },
      { da: ROUTES.shop.da, en: ROUTES.shop.en },
      { da: ROUTES.about.da, en: ROUTES.about.en },
      { da: ROUTES.contact.da, en: ROUTES.contact.en },
      { da: ROUTES.faq.da, en: ROUTES.faq.en },
      { da: ROUTES.guides.da, en: ROUTES.guides.en },
      ...COLLECTIONS.map((c) => ({ da: `/containere/${c.slug.da}`, en: `/en/containers/${c.slug.en}` })),
      ...products.map((p) => ({ da: `/produkt/${p.slug_da}`, en: `/en/product/${p.slug_en}` })),
      ...policies.map((p) => ({ da: `/politik/${p.slug_da}`, en: `/en/policy/${p.slug_en}` })),
      ...GUIDES.map((g) => ({ da: `/viden/${g.slug.da}`, en: `/en/guides/${g.slug.en}` })),
    ];
    const blob = new Blob([buildSitemapXml(urls, window.location.origin)], { type: "application/xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sitemap.xml";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h3 className="font-heading font-bold">Contact details and display</h3>
        <div className="mt-4 space-y-4">
          <label className="block text-sm"><span className="hjc-label block mb-1.5">Telephone (leave empty until confirmed)</span>
            <input className={FIELD} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
          <label className="block text-sm"><span className="hjc-label block mb-1.5">Notification email (internal)</span>
            <input className={FIELD} value={form.notification_email} onChange={(e) => setForm({ ...form, notification_email: e.target.value })} /></label>
          <label className="block text-sm"><span className="hjc-label block mb-1.5">Business hours (DA)</span>
            <textarea rows={3} className={FIELD} value={form.business_hours_da} onChange={(e) => setForm({ ...form, business_hours_da: e.target.value })} /></label>
          <label className="block text-sm"><span className="hjc-label block mb-1.5">Business hours (EN)</span>
            <textarea rows={3} className={FIELD} value={form.business_hours_en} onChange={(e) => setForm({ ...form, business_hours_en: e.target.value })} /></label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.show_knowledge_centre} onChange={(e) => setForm({ ...form, show_knowledge_centre: e.target.checked })} />
            Show knowledge centre link in footer
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.show_prices_excl_vat} onChange={(e) => setForm({ ...form, show_prices_excl_vat: e.target.checked })} />
            Show secondary prices excluding VAT
          </label>
          <button onClick={save} className="bg-slate-900 text-white px-5 py-2.5 text-sm font-semibold">Save settings</button>
          {saved && <p className="hjc-mono text-[11px] text-emerald-700">Saved.</p>}
        </div>
      </div>

      <div>
        <h3 className="font-heading font-bold">Company information (fixed)</h3>
        <dl className="mt-4 border border-slate-200 divide-y divide-slate-200 text-sm">
          {[["Name", COMPANY.name], ["Address", `${COMPANY.street}, ${COMPANY.postcode} ${COMPANY.city}, ${COMPANY.country_en}`],
            ["CVR", COMPANY.cvr], ["EUID", COMPANY.euid], ["Email", COMPANY.email]].map(([k, v]) => (
            <div key={k} className="flex justify-between px-3 py-2"><dt className="text-slate-500">{k}</dt><dd className="hjc-mono text-[12px]">{v}</dd></div>
          ))}
        </dl>

        <h3 className="mt-8 font-heading font-bold">SEO exports</h3>
        <p className="mt-2 text-sm text-slate-600">Generate an hreflang-annotated XML sitemap for every Danish and English public URL.</p>
        <button onClick={downloadSitemap} className="mt-3 border border-slate-900 px-5 py-2.5 text-sm font-semibold">Download sitemap.xml</button>
      </div>
    </div>
  );
}
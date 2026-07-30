import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import ProductsAdmin from "@/components/admin/ProductsAdmin";
import VariantsAdmin from "@/components/admin/VariantsAdmin";
import OrdersAdmin from "@/components/admin/OrdersAdmin";
import QuotesAdmin from "@/components/admin/QuotesAdmin";
import { FaqAdmin, PoliciesAdmin } from "@/components/admin/ContentAdmin";
import MerchantFeedAdmin from "@/components/admin/MerchantFeedAdmin";
import SettingsAdmin from "@/components/admin/SettingsAdmin";
import { validateVariant } from "@/lib/merchant";
import { useSeo } from "@/lib/seo";

const TABS = ["Overview", "Products", "Variants", "Orders", "Quotes", "Enquiries", "FAQs", "Policies", "Merchant feed", "Settings"];

export default function Admin() {
  const [tab, setTab] = useState("Overview");
  const qc = useQueryClient();
  const reload = () => qc.invalidateQueries();

  useSeo({ lang: "da", title: "Administration | HJ Container ApS", description: "", noindex: true });

  const q = (key, fn) => useQuery({ queryKey: [key], queryFn: fn }).data || [];
  const products = q("admin-products", () => base44.entities.Product.list("sort_order", 200));
  const variants = q("admin-variants", () => base44.entities.Variant.list("sku", 500));
  const orders = q("admin-orders", () => base44.entities.Order.list("-created_date", 200));
  const quotes = q("admin-quotes", () => base44.entities.QuoteRequest.list("-created_date", 200));
  const messages = q("admin-messages", () => base44.entities.ContactMessage.list("-created_date", 200));
  const faqs = q("faqs", () => base44.entities.Faq.list("sort_order", 200));
  const policies = q("policies", () => base44.entities.PolicyPage.list("sort_order", 60));
  const settingsList = q("settings-all", () => base44.entities.SiteSetting.list("-created_date", 1));
  const settings = settingsList[0] || {};

  const feedIssues = variants.filter((v) => validateVariant(v, products.find((p) => p.key === v.product_key)).length > 0).length;
  const lowStock = variants.filter((v) => v.stock_quantity !== null && v.stock_quantity !== undefined && v.stock_quantity <= 1);
  const unanswered = messages.filter((m) => !m.handled);

  const stats = [
    ["Orders", orders.length, `${orders.filter((o) => o.status === "new").length} new`],
    ["Quote requests", quotes.length, `${quotes.filter((q2) => q2.status === "new").length} new`],
    ["Products", products.length, `${products.filter((p) => p.status === "published").length} published`],
    ["Variants", variants.length, `${variants.filter((v) => v.direct_order).length} direct order`],
    ["Low-stock variants", lowStock.length, "1 unit or fewer"],
    ["Unanswered enquiries", unanswered.length, "contact form"],
    ["Merchant feed issues", feedIssues, "blocking fields"],
    ["Policies needing review", policies.filter((p) => p.needs_legal_review).length, "legal review"],
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between">
          <span className="font-heading font-extrabold">HJ CONTAINER — ADMIN</span>
          <Link to="/" className="text-sm underline">View website</Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8">
        <nav className="flex flex-wrap gap-2" aria-label="Admin sections">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} aria-current={tab === t}
              className={`px-4 py-2 text-sm font-medium border ${tab === t ? "bg-slate-900 text-white border-slate-900" : "border-slate-300 text-slate-600"}`}>
              {t}
            </button>
          ))}
        </nav>

        <div className="mt-8">
          {tab === "Overview" && (
            <>
              <div className="grid gap-px bg-slate-200 border border-slate-200 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map(([label, value, meta]) => (
                  <div key={label} className="bg-white p-5">
                    <p className="hjc-label">{label}</p>
                    <p className="mt-2 font-heading text-3xl font-extrabold">{value}</p>
                    <p className="hjc-mono text-[11px] text-slate-400 mt-1">{meta}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
                <p className="font-semibold">Launch checklist</p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>Add the company telephone number under Settings.</li>
                  <li>Replace sample prices, dimensions, weights, colours and lead times with confirmed data, then clear the SAMPLE flag.</li>
                  <li>Complete missing policy information (dispatch times, delivery zones, return address and process, refund times, complaint handling, dispute-resolution body, payment deadlines) and have the policies legally reviewed.</li>
                  <li>Enable Merchant feed inclusion only for variants with confirmed price, stock and images.</li>
                </ul>
              </div>
              <h3 className="mt-8 font-heading font-bold">Recent orders</h3>
              <div className="mt-3"><OrdersAdmin orders={orders.slice(0, 5)} reload={reload} /></div>
            </>
          )}
          {tab === "Products" && <ProductsAdmin products={products} variants={variants} reload={reload} />}
          {tab === "Variants" && <VariantsAdmin variants={variants} products={products} reload={reload} />}
          {tab === "Orders" && <OrdersAdmin orders={orders} reload={reload} />}
          {tab === "Quotes" && <QuotesAdmin quotes={quotes} reload={reload} />}
          {tab === "Enquiries" && (
            <div className="border border-slate-200 divide-y divide-slate-200">
              {messages.length === 0 && <p className="p-5 text-sm text-slate-500">No enquiries yet.</p>}
              {messages.map((m) => (
                <div key={m.id} className="p-5">
                  <p className="font-semibold">{m.name} <span className="hjc-mono text-[11px] text-slate-500">{m.email} · {m.category} · {m.language}</span></p>
                  <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">{m.message}</p>
                  <label className="mt-3 flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!m.handled}
                      onChange={async (e) => { await base44.entities.ContactMessage.update(m.id, { handled: e.target.checked }); reload(); }} />
                    Handled
                  </label>
                </div>
              ))}
            </div>
          )}
          {tab === "FAQs" && <FaqAdmin faqs={faqs} reload={reload} />}
          {tab === "Policies" && <PoliciesAdmin policies={policies} reload={reload} />}
          {tab === "Merchant feed" && <MerchantFeedAdmin variants={variants} products={products} reload={reload} />}
          {tab === "Settings" && <SettingsAdmin settings={settings} products={products} policies={policies} reload={reload} />}
        </div>
      </div>
    </div>
  );
}
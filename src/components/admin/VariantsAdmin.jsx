import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import AdminTable from "./AdminTable";
import { formatDKK } from "@/lib/i18n";

const INPUT = "border border-slate-300 px-2 py-1 hjc-mono text-[12px] w-24";

export default function VariantsAdmin({ variants, products, reload }) {
  const [saving, setSaving] = useState(null);

  const update = async (v, patch) => {
    setSaving(v.id);
    await base44.entities.Variant.update(v.id, patch);
    await reload();
    setSaving(null);
  };

  return (
    <AdminTable
      columns={["SKU", "Product", "Size", "Condition", "Price incl. VAT", "Availability", "Stock", "Direct order", "Merchant", "Status", ""]}
      rows={variants}
      empty="No variants yet."
      renderRow={(v) => {
        const product = products.find((p) => p.key === v.product_key);
        return (
          <tr key={v.id} className="border-t border-slate-100">
            <td className="px-3 py-2 hjc-mono text-[11px]">{v.sku}</td>
            <td className="px-3 py-2">
              {product?.name_en}
              {v.is_sample && <span className="ml-2 hjc-mono text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5">SAMPLE</span>}
            </td>
            <td className="px-3 py-2 hjc-mono text-[11px]">{v.size}</td>
            <td className="px-3 py-2">{v.condition}</td>
            <td className="px-3 py-2">
              <input className={INPUT} defaultValue={v.price_incl_vat || ""} placeholder="—"
                onBlur={(e) => { const n = e.target.value === "" ? null : Number(e.target.value); if (n !== v.price_incl_vat) update(v, { price_incl_vat: n }); }} />
              <span className="block hjc-mono text-[10px] text-slate-400">{v.price_incl_vat ? formatDKK(v.price_incl_vat, "da") : "on request"}</span>
            </td>
            <td className="px-3 py-2">
              <select className="border border-slate-300 px-2 py-1 text-[12px]" value={v.availability} onChange={(e) => update(v, { availability: e.target.value })}>
                {["in_stock", "out_of_stock", "on_request", "backorder"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </td>
            <td className="px-3 py-2">
              <input className="border border-slate-300 px-2 py-1 hjc-mono text-[12px] w-16" defaultValue={v.stock_quantity ?? ""}
                onBlur={(e) => update(v, { stock_quantity: e.target.value === "" ? null : Number(e.target.value) })} />
            </td>
            <td className="px-3 py-2">
              <input type="checkbox" checked={!!v.direct_order} onChange={(e) => update(v, { direct_order: e.target.checked, quote_only: !e.target.checked })} />
            </td>
            <td className="px-3 py-2">
              <input type="checkbox" checked={!!v.merchant_include} onChange={(e) => update(v, { merchant_include: e.target.checked })} />
            </td>
            <td className="px-3 py-2">
              <select className="border border-slate-300 px-2 py-1 text-[12px]" value={v.status} onChange={(e) => update(v, { status: e.target.value })}>
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </td>
            <td className="px-3 py-2 hjc-mono text-[10px] text-slate-400">{saving === v.id ? "saving…" : ""}</td>
          </tr>
        );
      }}
    />
  );
}
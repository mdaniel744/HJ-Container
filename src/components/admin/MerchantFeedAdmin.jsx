import React, { useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Copy, Download } from "lucide-react";
import AdminTable from "./AdminTable";
import { buildFeedXml, feedRow, validateVariant } from "@/lib/merchant";

export default function MerchantFeedAdmin({ variants, products, reload }) {
  const [copied, setCopied] = useState(false);
  const origin = window.location.origin;

  const rows = useMemo(
    () => variants.map((v) => {
      const product = products.find((p) => p.key === v.product_key);
      return { variant: v, product, issues: validateVariant(v, product) };
    }),
    [variants, products]
  );

  const eligible = rows.filter((r) => r.issues.length === 0 && r.variant.merchant_include);
  const xml = buildFeedXml(eligible.map((r) => feedRow(r.variant, r.product, origin)), origin);

  const download = () => {
    const blob = new Blob([xml], { type: "application/xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "google-merchant-da.xml";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <div className="border border-slate-200 p-5">
        <p className="hjc-label">Danish feed (DKK, Danish landing pages)</p>
        <p className="hjc-mono text-sm mt-2">{origin}/feeds/google-merchant-da.xml</p>
        <p className="text-sm text-slate-600 mt-3">
          {eligible.length} of {rows.length} variants are eligible and included. Last generated {new Date().toLocaleString("da-DK")}.
          Sample and quotation-only variants are excluded automatically.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={download} className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 text-sm font-semibold">
            <Download className="w-4 h-4" /> Download feed
          </button>
          <button onClick={() => { navigator.clipboard.writeText(`${origin}/feeds/google-merchant-da.xml`); setCopied(true); }}
            className="inline-flex items-center gap-2 border border-slate-300 px-4 py-2.5 text-sm font-semibold">
            <Copy className="w-4 h-4" /> {copied ? "Copied" : "Copy feed URL"}
          </button>
        </div>
      </div>

      <h3 className="mt-8 font-heading font-bold">Eligibility validation</h3>
      <div className="mt-3">
        <AdminTable
          columns={["SKU", "Product", "Include", "Missing / blocking fields", "Feed preview"]}
          rows={rows}
          empty="No variants."
          renderRow={({ variant, product, issues }) => (
            <tr key={variant.id} className="border-t border-slate-100 align-top">
              <td className="px-3 py-2 hjc-mono text-[11px]">{variant.sku}</td>
              <td className="px-3 py-2">{product?.name_da}</td>
              <td className="px-3 py-2">
                <input type="checkbox" checked={!!variant.merchant_include} disabled={issues.length > 0}
                  onChange={async (e) => { await base44.entities.Variant.update(variant.id, { merchant_include: e.target.checked }); reload(); }} />
              </td>
              <td className="px-3 py-2">
                {issues.length === 0
                  ? <span className="hjc-mono text-[11px] text-emerald-700">eligible</span>
                  : <span className="hjc-mono text-[11px] text-amber-700">{issues.join(", ")}</span>}
              </td>
              <td className="px-3 py-2 hjc-mono text-[10px] text-slate-500 max-w-[280px] truncate">
                {issues.length === 0 && product ? JSON.stringify(feedRow(variant, product, origin)).slice(0, 120) + "…" : "—"}
              </td>
            </tr>
          )}
        />
      </div>

      <h3 className="mt-8 font-heading font-bold">Feed XML preview</h3>
      <pre className="mt-3 max-h-80 overflow-auto border border-slate-200 bg-slate-50 p-4 hjc-mono text-[11px] whitespace-pre-wrap">{xml}</pre>
    </div>
  );
}
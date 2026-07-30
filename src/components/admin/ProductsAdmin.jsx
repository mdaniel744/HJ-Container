import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import AdminTable from "./AdminTable";

const FIELD = "w-full border border-slate-300 px-3 py-2 text-sm";

export default function ProductsAdmin({ products, variants, reload }) {
  const [editing, setEditing] = useState(null);

  const save = async () => {
    const { id, ...rest } = editing;
    await base44.entities.Product.update(id, rest);
    setEditing(null);
    reload();
  };

  return (
    <>
      <AdminTable
        columns={["Name (DA)", "Name (EN)", "Category", "Variants", "Featured", "Status", ""]}
        rows={products}
        empty="No products yet."
        renderRow={(p) => (
          <tr key={p.id} className="border-t border-slate-100">
            <td className="px-3 py-2">
              {p.name_da}
              {p.is_sample && <span className="ml-2 hjc-mono text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5">SAMPLE</span>}
            </td>
            <td className="px-3 py-2">{p.name_en}</td>
            <td className="px-3 py-2 hjc-mono text-[11px]">{p.category}</td>
            <td className="px-3 py-2 hjc-mono text-[11px]">{variants.filter((v) => v.product_key === p.key).length}</td>
            <td className="px-3 py-2">
              <input type="checkbox" checked={!!p.featured} onChange={async (e) => { await base44.entities.Product.update(p.id, { featured: e.target.checked }); reload(); }} />
            </td>
            <td className="px-3 py-2">
              <select className="border border-slate-300 px-2 py-1 text-[12px]" value={p.status}
                onChange={async (e) => { await base44.entities.Product.update(p.id, { status: e.target.value }); reload(); }}>
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </td>
            <td className="px-3 py-2">
              <button onClick={() => setEditing(p)} className="underline text-[12px] font-semibold">Edit content & SEO</button>
            </td>
          </tr>
        )}
      />

      {editing && (
        <div className="fixed inset-0 z-[80] bg-slate-900/50 flex items-start justify-center overflow-y-auto p-6" role="dialog" aria-modal="true">
          <div className="bg-white w-full max-w-3xl p-6">
            <h3 className="font-heading font-bold text-lg">Edit {editing.name_da}</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ["name_da", "Name (DA)"], ["name_en", "Name (EN)"],
                ["slug_da", "Slug (DA)"], ["slug_en", "Slug (EN)"],
                ["seo_title_da", "SEO title (DA)"], ["seo_title_en", "SEO title (EN)"],
              ].map(([k, label]) => (
                <label key={k} className="text-sm"><span className="hjc-label block mb-1.5">{label}</span>
                  <input className={FIELD} value={editing[k] || ""} onChange={(e) => setEditing({ ...editing, [k]: e.target.value })} /></label>
              ))}
              {[
                ["short_da", "Short description (DA)"], ["short_en", "Short description (EN)"],
                ["seo_description_da", "Meta description (DA)"], ["seo_description_en", "Meta description (EN)"],
                ["description_da", "Description (DA)"], ["description_en", "Description (EN)"],
                ["applications_da", "Applications (DA)"], ["applications_en", "Applications (EN)"],
              ].map(([k, label]) => (
                <label key={k} className="text-sm sm:col-span-2"><span className="hjc-label block mb-1.5">{label}</span>
                  <textarea rows={3} className={FIELD} value={editing[k] || ""} onChange={(e) => setEditing({ ...editing, [k]: e.target.value })} /></label>
              ))}
              <label className="text-sm sm:col-span-2"><span className="hjc-label block mb-1.5">Image URLs (one per line)</span>
                <textarea rows={3} className={FIELD} value={(editing.images || []).join("\n")}
                  onChange={(e) => setEditing({ ...editing, images: e.target.value.split("\n").filter(Boolean) })} /></label>
              <label className="text-sm flex items-center gap-2 sm:col-span-2">
                <input type="checkbox" checked={!!editing.is_sample} onChange={(e) => setEditing({ ...editing, is_sample: e.target.checked })} />
                Marked as sample / draft data
              </label>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={save} className="bg-slate-900 text-white px-5 py-2.5 text-sm font-semibold">Save</button>
              <button onClick={() => setEditing(null)} className="border border-slate-300 px-5 py-2.5 text-sm font-semibold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
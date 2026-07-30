import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import AdminTable from "./AdminTable";

const FIELD = "w-full border border-slate-300 px-3 py-2 text-sm";

export function FaqAdmin({ faqs, reload }) {
  const [editing, setEditing] = useState(null);

  const save = async () => {
    const { id, ...rest } = editing;
    await base44.entities.Faq.update(id, rest);
    setEditing(null);
    reload();
  };

  return (
    <>
      <AdminTable
        columns={["Category", "Question (DA)", "Question (EN)", "Order", "Home", "Published", ""]}
        rows={faqs}
        empty="No FAQs yet."
        renderRow={(f) => (
          <tr key={f.id} className="border-t border-slate-100">
            <td className="px-3 py-2 hjc-mono text-[11px]">{f.category}</td>
            <td className="px-3 py-2 max-w-[260px]">{f.question_da}</td>
            <td className="px-3 py-2 max-w-[260px]">{f.question_en}</td>
            <td className="px-3 py-2 hjc-mono text-[11px]">{f.sort_order}</td>
            <td className="px-3 py-2">
              <input type="checkbox" checked={!!f.show_on_home} onChange={async (e) => { await base44.entities.Faq.update(f.id, { show_on_home: e.target.checked }); reload(); }} />
            </td>
            <td className="px-3 py-2">
              <input type="checkbox" checked={!!f.published} onChange={async (e) => { await base44.entities.Faq.update(f.id, { published: e.target.checked }); reload(); }} />
            </td>
            <td className="px-3 py-2"><button onClick={() => setEditing(f)} className="underline text-[12px] font-semibold">Edit</button></td>
          </tr>
        )}
      />
      {editing && (
        <div className="fixed inset-0 z-[80] bg-slate-900/50 flex items-start justify-center overflow-y-auto p-6">
          <div className="bg-white w-full max-w-2xl p-6">
            <h3 className="font-heading font-bold text-lg">Edit FAQ</h3>
            <div className="mt-5 space-y-4">
              {[["question_da", "Question (DA)"], ["question_en", "Question (EN)"]].map(([k, l]) => (
                <label key={k} className="block text-sm"><span className="hjc-label block mb-1.5">{l}</span>
                  <input className={FIELD} value={editing[k] || ""} onChange={(e) => setEditing({ ...editing, [k]: e.target.value })} /></label>
              ))}
              {[["answer_da", "Answer (DA)"], ["answer_en", "Answer (EN)"]].map(([k, l]) => (
                <label key={k} className="block text-sm"><span className="hjc-label block mb-1.5">{l}</span>
                  <textarea rows={4} className={FIELD} value={editing[k] || ""} onChange={(e) => setEditing({ ...editing, [k]: e.target.value })} /></label>
              ))}
              <label className="block text-sm"><span className="hjc-label block mb-1.5">Sort order</span>
                <input type="number" className={FIELD} value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></label>
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

export function PoliciesAdmin({ policies, reload }) {
  const [editing, setEditing] = useState(null);

  const save = async () => {
    const { id, ...rest } = editing;
    await base44.entities.PolicyPage.update(id, rest);
    setEditing(null);
    reload();
  };

  return (
    <>
      <div className="border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 mb-5">
        <p className="font-semibold">Launch checklist — policy drafts requiring legal review</p>
        <p className="mt-1">Every policy below is a draft written from confirmed company information only. Missing business-specific details are listed per policy and must be completed and legally reviewed before launch.</p>
      </div>
      <AdminTable
        columns={["Policy", "Slug (DA)", "Slug (EN)", "Missing information", "Legal review", "Published", ""]}
        rows={policies}
        empty="No policies yet."
        renderRow={(p) => (
          <tr key={p.id} className="border-t border-slate-100 align-top">
            <td className="px-3 py-2">{p.title_da}<span className="block text-[11px] text-slate-500">{p.title_en}</span></td>
            <td className="px-3 py-2 hjc-mono text-[11px]">{p.slug_da}</td>
            <td className="px-3 py-2 hjc-mono text-[11px]">{p.slug_en}</td>
            <td className="px-3 py-2 text-[11px] text-amber-800 max-w-[280px]">{(p.missing_info || []).join(" · ") || "—"}</td>
            <td className="px-3 py-2">
              <input type="checkbox" checked={!!p.needs_legal_review}
                onChange={async (e) => { await base44.entities.PolicyPage.update(p.id, { needs_legal_review: e.target.checked }); reload(); }} />
            </td>
            <td className="px-3 py-2">
              <input type="checkbox" checked={!!p.published}
                onChange={async (e) => { await base44.entities.PolicyPage.update(p.id, { published: e.target.checked }); reload(); }} />
            </td>
            <td className="px-3 py-2"><button onClick={() => setEditing(p)} className="underline text-[12px] font-semibold">Edit</button></td>
          </tr>
        )}
      />
      {editing && (
        <div className="fixed inset-0 z-[80] bg-slate-900/50 flex items-start justify-center overflow-y-auto p-6">
          <div className="bg-white w-full max-w-3xl p-6">
            <h3 className="font-heading font-bold text-lg">Edit policy</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[["title_da", "Title (DA)"], ["title_en", "Title (EN)"], ["slug_da", "Slug (DA)"], ["slug_en", "Slug (EN)"]].map(([k, l]) => (
                <label key={k} className="text-sm"><span className="hjc-label block mb-1.5">{l}</span>
                  <input className={FIELD} value={editing[k] || ""} onChange={(e) => setEditing({ ...editing, [k]: e.target.value })} /></label>
              ))}
              {[["body_da", "Body (DA)"], ["body_en", "Body (EN)"]].map(([k, l]) => (
                <label key={k} className="text-sm sm:col-span-2"><span className="hjc-label block mb-1.5">{l} — use "## " for headings</span>
                  <textarea rows={12} className={`${FIELD} hjc-mono text-[12px]`} value={editing[k] || ""} onChange={(e) => setEditing({ ...editing, [k]: e.target.value })} /></label>
              ))}
              <label className="text-sm sm:col-span-2"><span className="hjc-label block mb-1.5">Missing information (one per line)</span>
                <textarea rows={4} className={FIELD} value={(editing.missing_info || []).join("\n")}
                  onChange={(e) => setEditing({ ...editing, missing_info: e.target.value.split("\n").filter(Boolean) })} /></label>
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
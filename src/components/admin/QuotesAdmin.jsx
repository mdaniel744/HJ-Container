import React from "react";
import { base44 } from "@/api/base44Client";
import AdminTable from "./AdminTable";
import { formatDate } from "@/lib/i18n";

const STATUSES = ["new", "in_progress", "quoted", "won", "lost", "closed"];

export default function QuotesAdmin({ quotes, reload }) {
  return (
    <AdminTable
      columns={["Request", "Date", "Customer", "Requested", "Delivery", "Attachments", "Status"]}
      rows={quotes}
      empty="No quote requests yet."
      renderRow={(q) => (
        <tr key={q.id} className="border-t border-slate-100 align-top">
          <td className="px-3 py-2 hjc-mono text-[11px]">{q.request_number}</td>
          <td className="px-3 py-2 hjc-mono text-[11px]">{formatDate(q.created_date, "da")}</td>
          <td className="px-3 py-2">
            {q.full_name}
            <span className="block text-[11px] text-slate-500">{q.email} · {q.phone}</span>
            {q.company_name && <span className="block text-[11px] text-slate-500">{q.company_name} {q.cvr ? `· CVR ${q.cvr}` : ""}</span>}
          </td>
          <td className="px-3 py-2 text-[12px]">
            {(q.lines || []).map((l, i) => <span key={i} className="block">{l.quantity} × {l.title} {l.size} {l.condition}</span>)}
          </td>
          <td className="px-3 py-2 text-[12px]">
            {q.postcode} {q.city}
            <span className="block text-[11px] text-slate-500">{q.unloading_method}</span>
            {q.delivery_period && <span className="block text-[11px] text-slate-500">{q.delivery_period}</span>}
          </td>
          <td className="px-3 py-2 text-[11px]">
            {(q.attachments || []).map((a, i) => (
              <a key={a} href={a} target="_blank" rel="noreferrer" className="block underline">file {i + 1}</a>
            ))}
          </td>
          <td className="px-3 py-2">
            <select className="border border-slate-300 px-2 py-1 text-[12px]" value={q.status}
              onChange={async (e) => { await base44.entities.QuoteRequest.update(q.id, { status: e.target.value }); reload(); }}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </td>
        </tr>
      )}
    />
  );
}
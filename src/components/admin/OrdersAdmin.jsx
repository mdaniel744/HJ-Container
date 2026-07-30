import React from "react";
import { base44 } from "@/api/base44Client";
import AdminTable from "./AdminTable";
import { formatDKK, formatDate } from "@/lib/i18n";

const STATUSES = ["new", "awaiting_review", "awaiting_payment", "paid", "delivery_planning", "scheduled", "completed", "cancelled", "refunded"];

export default function OrdersAdmin({ orders, reload }) {
  return (
    <AdminTable
      columns={["Order", "Date", "Customer", "Items", "Total incl. VAT", "Payment", "Status"]}
      rows={orders}
      empty="No orders yet."
      renderRow={(o) => (
        <tr key={o.id} className="border-t border-slate-100 align-top">
          <td className="px-3 py-2 hjc-mono text-[11px]">{o.order_number}</td>
          <td className="px-3 py-2 hjc-mono text-[11px]">{formatDate(o.created_date, "da")}</td>
          <td className="px-3 py-2">
            {o.full_name}
            <span className="block text-[11px] text-slate-500">{o.email}</span>
            {o.company_name && <span className="block text-[11px] text-slate-500">{o.company_name} · CVR {o.cvr}</span>}
            <span className="block text-[11px] text-slate-500">{o.delivery_address}, {o.postcode} {o.city}</span>
          </td>
          <td className="px-3 py-2 text-[12px]">
            {(o.items || []).map((i) => <span key={i.sku} className="block">{i.quantity} × {i.sku}</span>)}
          </td>
          <td className="px-3 py-2 hjc-mono text-[11px]">{formatDKK(o.total_incl_vat, "da")}</td>
          <td className="px-3 py-2 text-[12px]">{o.payment_method}</td>
          <td className="px-3 py-2">
            <select className="border border-slate-300 px-2 py-1 text-[12px]" value={o.status}
              onChange={async (e) => { await base44.entities.Order.update(o.id, { status: e.target.value }); reload(); }}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </td>
        </tr>
      )}
    />
  );
}
import React from "react";

export default function AdminTable({ columns, rows, renderRow, empty }) {
  if (!rows.length) return <p className="text-sm text-slate-500 py-8">{empty}</p>;
  return (
    <div className="overflow-x-auto border border-slate-200">
      <table className="w-full text-sm min-w-[720px]">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((c) => (
              <th key={c} className="text-left px-3 py-2.5 hjc-label font-medium">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>{rows.map(renderRow)}</tbody>
      </table>
    </div>
  );
}
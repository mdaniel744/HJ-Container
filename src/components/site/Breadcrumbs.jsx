import React from "react";
import { Link } from "@/lib/next-router";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="hjc-mono text-[11px] text-slate-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={it.path || it.name} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3 h-3 text-slate-300" />}
            {i === items.length - 1 || !it.path ? (
              <span className="text-slate-700" aria-current="page">{it.name}</span>
            ) : (
              <Link to={it.path} className="hover:text-slate-900 underline-offset-2 hover:underline">{it.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
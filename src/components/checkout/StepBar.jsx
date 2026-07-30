import React from "react";

export default function StepBar({ steps, current }) {
  return (
    <ol className="flex flex-wrap gap-px bg-slate-200 border border-slate-200" aria-label="Progress">
      {steps.map((s, i) => (
        <li key={s} aria-current={i === current ? "step" : undefined}
          className={`flex-1 min-w-[120px] px-3 py-3 bg-white flex items-center gap-2 ${i === current ? "bg-slate-900 text-white" : i < current ? "text-slate-900" : "text-slate-400"}`}>
          <span className="hjc-mono text-[11px]">{String(i + 1).padStart(2, "0")}</span>
          <span className="text-xs font-medium">{s}</span>
        </li>
      ))}
    </ol>
  );
}
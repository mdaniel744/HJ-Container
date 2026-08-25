import React from "react";

export default function StepBar({ steps, current }) {
  return (
    <ol className="flex flex-wrap gap-px bg-slate-200 border border-slate-200" aria-label="Progress">
      {steps.map((s, i) => (
        <li key={s} aria-current={i === current ? "step" : undefined}
          className={`flex-1 min-w-[140px] px-3 py-3.5 bg-white flex items-center gap-2 ${i === current ? "bg-slate-900 text-white" : i < current ? "text-slate-900" : "text-slate-600"}`}>
          <span className="text-sm font-semibold">{String(i + 1).padStart(2, "0")}</span>
          <span className="text-sm font-semibold leading-5">{s}</span>
        </li>
      ))}
    </ol>
  );
}

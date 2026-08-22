import React, { useRef, useState } from "react";
import { Link } from "@/lib/next-router";
import { ChevronDown } from "lucide-react";

/** Hover-intent dropdown that also works on tap. */
export default function NavDropdown({ label, to, items }) {
  const [open, setOpen] = useState(false);
  const timer = useRef();

  const show = () => { clearTimeout(timer.current); setOpen(true); };
  const hide = () => { timer.current = setTimeout(() => setOpen(false), 220); };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      <div className="flex items-center">
        <Link to={to} className="py-2 text-sm font-medium text-slate-700 hover:text-slate-900">{label}</Link>
        <button
          type="button"
          aria-expanded={open}
          aria-label={`${label} — submenu`}
          onClick={() => setOpen((o) => !o)}
          className="p-1 text-slate-500 hover:text-slate-900"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {open && (
        <div className="absolute left-0 top-full z-50 w-72 border border-slate-200 bg-white shadow-lg">
          <ul className="py-2">
            {items.map((it) => (
              <li key={it.to}>
                <Link
                  to={it.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  <span>{it.label}</span>
                  {it.meta && <span className="hjc-mono text-[11px] text-slate-400">{it.meta}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
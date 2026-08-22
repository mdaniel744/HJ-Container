import React from "react";
import { useLocation, useNavigate } from "@/lib/next-router";
import { useLang } from "@/lib/i18n";
import { translatePath, useAltPath } from "@/lib/AltPath";

export default function LanguageSwitcher() {
  const lang = useLang();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const alt = useAltPath();

  const go = (target) => {
    if (target === lang) return;
    navigate(alt?.[target] || translatePath(pathname, target));
  };

  return (
    <div className="inline-flex items-center rounded-full border border-slate-200 p-0.5 hjc-mono text-xs" role="group" aria-label={lang === "en" ? "Language" : "Sprog"}>
      {["da", "en"].map((code) => (
        <button
          key={code}
          onClick={() => go(code)}
          aria-current={lang === code ? "true" : undefined}
          className={`px-2.5 py-1 rounded-full uppercase tracking-wider transition-colors ${
            lang === code ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
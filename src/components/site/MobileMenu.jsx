import React from "react";
import { Link } from "@/lib/next-router";
import { X } from "lucide-react";
import { L } from "@/lib/i18n";
import { path } from "@/lib/routes";
import LanguageSwitcher from "./LanguageSwitcher";

export default function MobileMenu({ open, onClose, lang, shopItems }) {
  if (!open) return null;
  const main = [
    { to: path("home", lang), label: L(lang, "Forside", "Home") },
    { to: path("shop", lang), label: L(lang, "Shop", "Shop") },
    { to: path("about", lang), label: L(lang, "Om os", "About Us") },
    { to: path("contact", lang), label: L(lang, "Kontakt", "Contact") },
    { to: path("faq", lang), label: L(lang, "FAQ", "FAQs") },
    { to: path("guides", lang), label: L(lang, "Viden og rådgivning", "Guides and Advice") },
  ];
  return (
    <div className="fixed inset-0 z-[60] bg-white lg:hidden overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200">
        <span className="font-heading font-extrabold text-slate-900">HJ CONTAINER</span>
        <button onClick={onClose} className="p-2" aria-label={L(lang, "Luk menu", "Close menu")}><X className="w-6 h-6" /></button>
      </div>
      <nav className="px-5 py-6" aria-label={L(lang, "Mobilnavigation", "Mobile navigation")}>
        <ul className="space-y-1">
          {main.map((m) => (
            <li key={m.to}>
              <Link to={m.to} onClick={onClose} className="block py-3 text-lg font-heading font-semibold text-slate-900 border-b border-slate-100">
                {m.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="hjc-label mt-8 mb-3">{L(lang, "Kategorier", "Categories")}</p>
        <ul className="space-y-1">
          {shopItems.map((s) => (
            <li key={s.to}>
              <Link to={s.to} onClick={onClose} className="block py-2 text-sm text-slate-600">{s.label}</Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex items-center gap-4">
          <LanguageSwitcher />
          <Link to={path("quote", lang)} onClick={onClose} className="flex-1 text-center bg-orange-500 text-white font-semibold py-3">
            {L(lang, "Få et tilbud", "Request a Quote")}
          </Link>
        </div>
      </nav>
    </div>
  );
}
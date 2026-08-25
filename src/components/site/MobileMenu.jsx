import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Link } from "@/lib/next-router";
import { ArrowRight, X } from "lucide-react";
import { L } from "@/lib/i18n";
import { path } from "@/lib/routes";
import LanguageSwitcher from "./LanguageSwitcher";

export default function MobileMenu({ open, onClose, lang, shopItems }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;
  const main = [
    { to: path("home", lang), label: L(lang, "Forside", "Home") },
    { to: path("shop", lang), label: L(lang, "Shop", "Shop") },
    { to: path("about", lang), label: L(lang, "Om os", "About Us") },
    { to: path("contact", lang), label: L(lang, "Kontakt", "Contact") },
    { to: path("faq", lang), label: L(lang, "FAQ", "FAQs") },
    { to: path("guides", lang), label: L(lang, "Viden og rådgivning", "Guides and Advice") },
  ];
  return createPortal(
    <div id="mobile-menu" className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default bg-slate-950/55 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label={L(lang, "Luk menu", "Close menu")}
      />
      <div className="absolute inset-y-0 right-0 flex h-dvh w-full max-w-[420px] flex-col bg-white shadow-2xl">
        <div className="flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 px-5">
          <Link to={path("home", lang)} onClick={onClose} className="flex items-center" aria-label={L(lang, "HJ Containers — Forside", "HJ Containers — Home")}>
            <Image
              src="/brand/hj-containers-logo.png"
              alt="HJ Containers"
              width={1400}
              height={1050}
              unoptimized
              sizes="64px"
              className="h-14 w-auto object-contain"
            />
          </Link>
          <h2 id="mobile-menu-title" className="sr-only">{L(lang, "Hovedmenu", "Main menu")}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center border border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-950"
            aria-label={L(lang, "Luk menu", "Close menu")}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5" aria-label={L(lang, "Mobilnavigation", "Mobile navigation")}>
          <ul>
            {main.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onClose}
                  className="group flex min-h-14 items-center justify-between gap-4 border-b border-slate-100 font-heading text-lg font-semibold text-slate-900"
                >
                  {item.label}
                  <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-orange-500" />
                </Link>
              </li>
            ))}
          </ul>

          <p className="hjc-section-tag mt-8 mb-3">{L(lang, "Shop efter", "Shop by")}</p>
          <ul className="grid grid-cols-2 gap-x-5">
            {shopItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to} onClick={onClose} className="block border-b border-slate-100 py-3 text-sm font-medium text-slate-600 hover:text-orange-600">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link to={path("quote", lang)} onClick={onClose} className="flex-1 bg-orange-500 px-4 py-3.5 text-center text-sm font-semibold text-white hover:bg-orange-600">
              {L(lang, "Få et tilbud", "Request a Quote")}
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

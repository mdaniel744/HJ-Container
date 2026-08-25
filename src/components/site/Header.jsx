import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Link, useNavigate } from "@/lib/next-router";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { useLang, L } from "@/lib/i18n";
import { path, COLLECTIONS } from "@/lib/routes";
import { useCart } from "@/lib/CartContext";
import LanguageSwitcher from "./LanguageSwitcher";
import NavDropdown from "./NavDropdown";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const lang = useLang();
  const navigate = useNavigate();
  const { count } = useCart();
  const [compact, setCompact] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shopItems = COLLECTIONS.map((c) => ({
    to: path("category", lang, c.slug[lang]),
    label: c.label[lang],
    meta: c.kind === "size" ? c.key : null,
  }));

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`${path("shop", lang)}?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className={`mx-auto max-w-7xl px-5 flex items-center gap-6 transition-all ${compact ? "h-14" : "h-20"}`}>
        <Link to={path("home", lang)} className="flex items-center shrink-0" aria-label={L(lang, "HJ Containers — Forside", "HJ Containers — Home")}>
          <Image
            src="/brand/hj-containers-logo.png"
            alt="HJ Containers"
            width={1400}
            height={1050}
            priority
            unoptimized
            sizes="(max-width: 640px) 64px, 86px"
            className={`w-auto object-contain transition-all duration-200 ${compact ? "h-11" : "h-16"}`}
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-7 ml-4" aria-label={L(lang, "Hovednavigation", "Main navigation")}>
          <Link to={path("home", lang)} className="text-sm font-medium text-slate-700 hover:text-slate-900">
            {L(lang, "Forside", "Home")}
          </Link>
          <NavDropdown label={L(lang, "Shop", "Shop")} to={path("shop", lang)} items={shopItems} />
          <Link to={path("about", lang)} className="text-sm font-medium text-slate-700 hover:text-slate-900">
            {L(lang, "Om os", "About Us")}
          </Link>
          <Link to={path("contact", lang)} className="text-sm font-medium text-slate-700 hover:text-slate-900">
            {L(lang, "Kontakt", "Contact")}
          </Link>
          <Link to={path("faq", lang)} className="text-sm font-medium text-slate-700 hover:text-slate-900">
            {L(lang, "FAQ", "FAQs")}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button onClick={() => setSearchOpen((s) => !s)} aria-label={L(lang, "Søg", "Search")} className="p-2 text-slate-600 hover:text-slate-900">
            <Search className="w-5 h-5" />
          </button>
          <div className="hidden sm:block"><LanguageSwitcher /></div>
          <Link to={path("cart", lang)} className="relative p-2 text-slate-600 hover:text-slate-900" aria-label={L(lang, "Kurv", "Cart")}>
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white hjc-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <Link
            to={path("quote", lang)}
            className="hidden md:inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 transition-colors"
          >
            {L(lang, "Få et tilbud", "Request a Quote")}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center text-slate-700 lg:hidden"
            aria-label={L(lang, "Åbn menu", "Open menu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-slate-200 bg-white">
          <form onSubmit={submitSearch} className="mx-auto max-w-7xl px-5 py-4 flex gap-3">
            <label htmlFor="site-search" className="sr-only">{L(lang, "Søg efter containere", "Search containers")}</label>
            <input
              id="site-search"
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={L(lang, "Søg efter containere, størrelse eller SKU", "Search containers, size or SKU")}
              className="flex-1 border border-slate-300 px-4 py-2.5 text-sm"
            />
            <button type="submit" className="bg-slate-900 text-white px-5 text-sm font-semibold">{L(lang, "Søg", "Search")}</button>
            <button type="button" onClick={() => setSearchOpen(false)} className="p-2 text-slate-500" aria-label={L(lang, "Luk søgning", "Close search")}>
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} lang={lang} shopItems={shopItems} />
    </header>
  );
}

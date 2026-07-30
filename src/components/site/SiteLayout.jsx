import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CookieConsent from "./CookieConsent";
import { L, useLang } from "@/lib/i18n";

export default function SiteLayout() {
  const lang = useLang();
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[80] focus:bg-slate-900 focus:text-white focus:px-4 focus:py-2">
        {L(lang, "Gå til indhold", "Skip to content")}
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
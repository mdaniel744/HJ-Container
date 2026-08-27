import React, { createContext, useContext, useEffect, useState } from "react";
import { ROUTES } from "@/lib/routes";

const AltPathContext = createContext({ alt: null, setAlt: () => {} });

export function AltPathProvider({ children }) {
  const [alt, setAlt] = useState(null);
  return <AltPathContext.Provider value={{ alt, setAlt }}>{children}</AltPathContext.Provider>;
}

/** Pages with translated slugs (products, policies) register their counterpart path here. */
export function useRegisterAltPath(paths) {
  const { setAlt } = useContext(AltPathContext);
  const serialized = JSON.stringify(paths || null);
  useEffect(() => {
    setAlt(paths || null);
    return () => setAlt(null);
  }, [serialized]);
}

export function useAltPath() {
  return useContext(AltPathContext).alt;
}

/**
 * Generic path translation for routes without dynamic slugs. Pages with a
 * translated slug (products, categories) register their own counterpart via
 * useRegisterAltPath instead — by the time someone can click the language
 * switcher on those pages, that registration has already run, so this is
 * only reached for the small set of static routes.
 */
export function translatePath(pathname, target) {
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const current = isEn ? "en" : "da";
  if (current === target) return pathname;

  for (const r of Object.values(ROUTES)) {
    if (r.da.includes(":slug")) continue;
    if (pathname === r[current]) return r[target];
  }

  return target === "en" ? "/en" : "/";
}
import React, { createContext, useContext, useEffect, useState } from "react";
import { CONTAINER_TYPES, ROUTES } from "@/lib/routes";

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

/** Generic path translation for routes without dynamic slugs. */
export function translatePath(pathname, target) {
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const current = isEn ? "en" : "da";
  if (current === target) return pathname;

  for (const r of Object.values(ROUTES)) {
    if (r.da.includes(":slug")) continue;
    if (pathname === r[current]) return r[target];
  }
  // Container-type categories
  const segs = pathname.split("/").filter(Boolean);
  const last = segs[segs.length - 1];
  const col = CONTAINER_TYPES.find((c) => c.slug[current] === last);
  if (col) return (target === "en" ? "/en/containers/" : "/containere/") + col.slug[target];

  return target === "en" ? "/en" : "/";
}
import { useEffect } from "react";

function upsert(selector, create) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

function meta(name, content, prop = "name") {
  const el = upsert(`meta[${prop}="${name}"]`, () => {
    const m = document.createElement("meta");
    m.setAttribute(prop, name);
    return m;
  });
  el.setAttribute("content", content || "");
}

function link(rel, href, hreflang) {
  const sel = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  const el = upsert(sel, () => {
    const l = document.createElement("link");
    l.setAttribute("rel", rel);
    if (hreflang) l.setAttribute("hreflang", hreflang);
    return l;
  });
  el.setAttribute("href", href);
}

/**
 * Sets title, meta description, canonical, hreflang, Open Graph and JSON-LD.
 */
export function useSeo({ lang = "da", title, description, image, daPath, enPath, noindex = false, jsonLd = [] }) {
  useEffect(() => {
    const origin = window.location.origin;
    if (title) document.title = title;
    document.documentElement.lang = lang === "en" ? "en" : "da-DK";
    meta("description", description);
    meta("robots", noindex ? "noindex,nofollow" : "index,follow");
    link("canonical", origin + window.location.pathname);
    if (daPath) link("alternate", origin + daPath, "da-DK");
    if (enPath) link("alternate", origin + enPath, "en");
    if (daPath) link("alternate", origin + daPath, "x-default");
    meta("og:title", title, "property");
    meta("og:description", description, "property");
    meta("og:type", "website", "property");
    meta("og:locale", lang === "en" ? "en" : "da_DK", "property");
    meta("og:url", origin + window.location.pathname, "property");
    if (image) meta("og:image", image.startsWith("http") ? image : origin + image, "property");
    meta("twitter:card", "summary_large_image");

    document.head.querySelectorAll("script[data-hjc-jsonld]").forEach((s) => s.remove());
    (jsonLd || []).filter(Boolean).forEach((data) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.dataset.hjcJsonld = "1";
      s.textContent = JSON.stringify(data);
      document.head.appendChild(s);
    });
  }, [lang, title, description, image, daPath, enPath, noindex, JSON.stringify(jsonLd)]);
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HJ Container ApS",
    url: window.location.origin,
    email: "contact@hjcontainer.com",
    identifier: "DKCVR.16217670",
    vatID: null,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Endelavevej 8A",
      postalCode: "8700",
      addressLocality: "Horsens",
      addressCountry: "DK",
    },
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: window.location.origin + it.path,
    })),
  };
}
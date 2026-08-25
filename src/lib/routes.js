// Central bilingual route map. Danish at root, English under /en/.
export const ROUTES = {
  home: { da: "/", en: "/en" },
  shop: { da: "/shop", en: "/en/shop" },
  category: { da: "/containere/:slug", en: "/en/containers/:slug" },
  product: { da: "/produkt/:slug", en: "/en/product/:slug" },
  cart: { da: "/kurv", en: "/en/cart" },
  checkout: { da: "/kasse", en: "/en/checkout" },
  confirmation: { da: "/ordrebekraeftelse", en: "/en/order-confirmation" },
  quote: { da: "/tilbud", en: "/en/quote" },
  about: { da: "/om-os", en: "/en/about-us" },
  contact: { da: "/kontakt", en: "/en/contact" },
  faq: { da: "/faq", en: "/en/faqs" },
  policy: { da: "/politik/:slug", en: "/en/policy/:slug" },
  guides: { da: "/viden", en: "/en/guides" },
  guide: { da: "/viden/:slug", en: "/en/guides/:slug" },
};

export function path(key, lang = "da", slug) {
  let p = ROUTES[key][lang] || ROUTES[key].da;
  if (slug) p = p.replace(":slug", slug);
  return p;
}

// Collections: canonical key -> localized slug + labels
export const COLLECTIONS = [
  { key: "standard", kind: "type", slug: { da: "standardcontainere", en: "standard-containers" }, label: { da: "Standardcontainere", en: "Standard Containers" } },
  { key: "high_cube", kind: "type", slug: { da: "high-cube-containere", en: "high-cube-containers" }, label: { da: "High Cube-containere", en: "High Cube Containers" } },
  { key: "open_side", kind: "type", slug: { da: "open-side-containere", en: "open-side-containers" }, label: { da: "Open Side-containere", en: "Open Side Containers" } },
  { key: "storage", kind: "type", slug: { da: "opbevaringscontainere", en: "storage-containers" }, label: { da: "Opbevaringscontainere", en: "Storage Containers" } },
  { key: "office", kind: "type", slug: { da: "kontorcontainere", en: "office-containers" }, label: { da: "Kontorcontainere", en: "Office Containers" } },
  { key: "insulated", kind: "type", slug: { da: "isolerede-containere", en: "insulated-containers" }, label: { da: "Isolerede containere", en: "Insulated Containers" } },
  { key: "tunnel", kind: "type", slug: { da: "tunnelcontainere", en: "tunnel-containers" }, label: { da: "Tunnelcontainere", en: "Tunnel Containers" } },
  { key: "10ft", kind: "size", slug: { da: "10-fods-containere", en: "10ft-containers" }, label: { da: "10 fods containere", en: "10ft Containers" } },
  { key: "20ft", kind: "size", slug: { da: "20-fods-containere", en: "20ft-containers" }, label: { da: "20 fods containere", en: "20ft Containers" } },
  { key: "40ft", kind: "size", slug: { da: "40-fods-containere", en: "40ft-containers" }, label: { da: "40 fods containere", en: "40ft Containers" } },
];

export function collectionBySlug(slug) {
  return COLLECTIONS.find((c) => c.slug.da === slug || c.slug.en === slug);
}

export const CATEGORY_LABEL = {
  standard: { da: "Standardcontainer", en: "Standard Container" },
  high_cube: { da: "High Cube-container", en: "High Cube Container" },
  open_side: { da: "Open Side-container", en: "Open Side Container" },
  storage: { da: "Opbevaringscontainer", en: "Storage Container" },
  office: { da: "Kontorcontainer", en: "Office Container" },
  insulated: { da: "Isoleret container", en: "Insulated Container" },
  tunnel: { da: "Tunnelcontainer", en: "Tunnel Container" },
};

export const SIZE_ORDER = { "10ft": 1, "20ft": 2, "40ft": 3 };

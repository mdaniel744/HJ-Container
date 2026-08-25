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

// Static nav/label helper for the 3 container-type categories, used by
// synchronous UI (header, footer, home cards) that shouldn't have to fetch
// live category data just to render a link label. The category *pages*
// fetch live data via useCategory() (src/lib/useCatalog.js) — this is kept
// in sync with the local sample categories in src/data/products.js.
export const CONTAINER_TYPES = [
  { key: "standard", slug: { da: "standardcontainere", en: "standard-containers" }, label: { da: "Standardcontainere", en: "Standard Containers" } },
  { key: "high_cube", slug: { da: "high-cube-containere", en: "high-cube-containers" }, label: { da: "High Cube-containere", en: "High Cube Containers" } },
  { key: "open_side", slug: { da: "open-side-containere", en: "open-side-containers" }, label: { da: "Open Side-containere", en: "Open Side Containers" } },
];

// "Size" is a product attribute in the shared schema, not a category, so
// there's no dedicated size category page — these are shop filter shortcuts.
export const SIZES = ["10ft", "20ft", "40ft"];
export const SIZE_ORDER = { "10ft": 1, "20ft": 2, "40ft": 3 };

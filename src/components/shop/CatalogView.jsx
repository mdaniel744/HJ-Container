import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal, X, LayoutGrid, List } from "lucide-react";
import ShopFilters from "./ShopFilters";
import ProductGrid from "./ProductGrid";
import { CONDITION_LABEL, L, pick } from "@/lib/i18n";
import { CATEGORY_LABEL, SIZE_ORDER, path } from "@/lib/routes";

const EMPTY = { category: [], size: [], condition: [], color: [], availability: [], flags: [], maxPrice: null };

export default function CatalogView({ lang, products, variants, lockedFilter, initialQuery = "" }) {
  const [filters, setFilters] = useState({ ...EMPTY });
  const [sort, setSort] = useState("recommended");
  const [q, setQ] = useState(initialQuery);
  const [view, setView] = useState("grid");
  const [limit, setLimit] = useState(12);
  const [drawer, setDrawer] = useState(false);

  const productByKey = useMemo(() => Object.fromEntries(products.map((p) => [p.key, p])), [products]);

  const allRows = useMemo(
    () => variants.map((v) => ({ variant: v, product: productByKey[v.product_key] })).filter((r) => r.product),
    [variants, productByKey]
  );

  const colors = useMemo(
    () => [...new Set(allRows.map((r) => pick(r.variant, "color", lang)).filter(Boolean))],
    [allRows, lang]
  );
  const maxPrice = useMemo(
    () => Math.max(50000, ...allRows.map((r) => r.variant.price_incl_vat || 0)),
    [allRows]
  );

  const rows = useMemo(() => {
    let list = allRows;
    if (lockedFilter?.category) list = list.filter((r) => r.product.category === lockedFilter.category);
    if (lockedFilter?.size) list = list.filter((r) => r.variant.size === lockedFilter.size);
    if (filters.category.length) list = list.filter((r) => filters.category.includes(r.product.category));
    if (filters.size.length) list = list.filter((r) => filters.size.includes(r.variant.size));
    if (filters.condition.length) list = list.filter((r) => filters.condition.includes(r.variant.condition));
    if (filters.color.length) list = list.filter((r) => filters.color.includes(pick(r.variant, "color", lang)));
    if (filters.availability.includes("in_stock")) list = list.filter((r) => r.variant.availability === "in_stock");
    if (filters.flags.includes("direct")) list = list.filter((r) => r.variant.direct_order);
    if (filters.flags.includes("quote")) list = list.filter((r) => !r.variant.direct_order);
    if (filters.maxPrice) list = list.filter((r) => !r.variant.price_incl_vat || r.variant.price_incl_vat <= filters.maxPrice);
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter((r) =>
        [pick(r.product, "name", lang), r.variant.sku, r.variant.size, pick(r.variant, "color", lang)]
          .filter(Boolean).join(" ").toLowerCase().includes(t)
      );
    }
    const sorters = {
      price_asc: (a, b) => (a.variant.price_incl_vat || 1e9) - (b.variant.price_incl_vat || 1e9),
      price_desc: (a, b) => (b.variant.price_incl_vat || 0) - (a.variant.price_incl_vat || 0),
      newest: (a, b) => new Date(b.variant.created_date || 0) - new Date(a.variant.created_date || 0),
      size: (a, b) => SIZE_ORDER[a.variant.size] - SIZE_ORDER[b.variant.size],
      availability: (a, b) => (a.variant.availability === "in_stock" ? -1 : 1) - (b.variant.availability === "in_stock" ? -1 : 1),
      recommended: (a, b) =>
        (b.variant.direct_order ? 1 : 0) - (a.variant.direct_order ? 1 : 0) ||
        SIZE_ORDER[a.variant.size] - SIZE_ORDER[b.variant.size],
    };
    return [...list].sort(sorters[sort] || sorters.recommended);
  }, [allRows, filters, q, sort, lang, lockedFilter]);

  const chips = [
    ...filters.category.map((c) => ({ key: "category", value: c, label: CATEGORY_LABEL[c][lang] })),
    ...filters.size.map((s) => ({ key: "size", value: s, label: s })),
    ...filters.condition.map((c) => ({ key: "condition", value: c, label: CONDITION_LABEL[c][lang] })),
    ...filters.color.map((c) => ({ key: "color", value: c, label: c })),
    ...filters.availability.map((c) => ({ key: "availability", value: c, label: L(lang, "På lager", "In stock") })),
    ...filters.flags.map((f) => ({ key: "flags", value: f, label: f === "direct" ? L(lang, "Direkte køb", "Direct order") : L(lang, "Kræver tilbud", "Quote required") })),
  ];

  const removeChip = (chip) =>
    setFilters({ ...filters, [chip.key]: filters[chip.key].filter((v) => v !== chip.value) });

  const filterPanel = <ShopFilters lang={lang} filters={filters} setFilters={setFilters} colors={colors} maxPrice={maxPrice} />;

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-10">
      <aside className="hidden lg:block">
        <h2 className="font-heading font-bold text-lg border-b border-slate-900 pb-3">{L(lang, "Filtre", "Filters")}</h2>
        {filterPanel}
        <button onClick={() => setFilters({ ...EMPTY })} className="mt-5 text-sm font-semibold underline underline-offset-4">
          {L(lang, "Ryd alle filtre", "Clear all filters")}
        </button>
      </aside>

      <div>
        <div className="flex flex-wrap items-center gap-3 border border-slate-200 p-3">
          <button onClick={() => setDrawer(true)} className="lg:hidden inline-flex items-center gap-2 border border-slate-300 px-3 py-2 text-sm font-medium">
            <SlidersHorizontal className="w-4 h-4" /> {L(lang, "Filtre", "Filters")}
          </button>
          <label className="flex-1 min-w-[180px]">
            <span className="sr-only">{L(lang, "Søg i katalog", "Search catalogue")}</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L(lang, "Søg efter navn eller SKU", "Search by name or SKU")}
              className="w-full border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-sm flex items-center gap-2">
            <span className="hjc-label">{L(lang, "Sortér", "Sort")}</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-slate-300 px-3 py-2 text-sm">
              <option value="recommended">{L(lang, "Anbefalet", "Recommended")}</option>
              <option value="price_asc">{L(lang, "Pris: lav til høj", "Price: low to high")}</option>
              <option value="price_desc">{L(lang, "Pris: høj til lav", "Price: high to low")}</option>
              <option value="newest">{L(lang, "Nyeste", "Newest")}</option>
              <option value="size">{L(lang, "Størrelse", "Size")}</option>
              <option value="availability">{L(lang, "Tilgængelighed", "Availability")}</option>
            </select>
          </label>
          <div className="hidden sm:flex border border-slate-300">
            <button onClick={() => setView("grid")} aria-pressed={view === "grid"} aria-label={L(lang, "Gittervisning", "Grid view")}
              className={`p-2 ${view === "grid" ? "bg-slate-900 text-white" : "text-slate-600"}`}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setView("list")} aria-pressed={view === "list"} aria-label={L(lang, "Listevisning", "List view")}
              className={`p-2 ${view === "list" ? "bg-slate-900 text-white" : "text-slate-600"}`}><List className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <p className="hjc-mono text-[11px] text-slate-500 mr-2">
            {rows.length} {L(lang, "varianter", "variants")}
          </p>
          {chips.map((c) => (
            <button key={c.key + c.value} onClick={() => removeChip(c)}
              className="inline-flex items-center gap-1.5 border border-slate-300 px-2.5 py-1 hjc-mono text-[11px] hover:bg-slate-50">
              {c.label} <X className="w-3 h-3" />
            </button>
          ))}
          {chips.length > 0 && (
            <button onClick={() => setFilters({ ...EMPTY })} className="hjc-mono text-[11px] underline">
              {L(lang, "Ryd alle", "Clear all")}
            </button>
          )}
        </div>

        <div className="mt-6">
          {rows.length === 0 ? (
            <div className="border border-slate-200 p-10 text-center">
              <p className="font-heading font-bold text-lg">{L(lang, "Ingen containere matcher dine filtre", "No containers match your filters")}</p>
              <p className="mt-2 text-sm text-slate-600">
                {L(lang, "Prøv at rydde filtrene, eller send en tilbudsforespørgsel — vi kan ofte skaffe en specifik variant.",
                  "Try clearing the filters, or send a quote request — we can often source a specific variant.")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <button onClick={() => { setFilters({ ...EMPTY }); setQ(""); }} className="bg-slate-900 text-white font-semibold px-5 py-3 text-sm">
                  {L(lang, "Ryd filtre", "Clear filters")}
                </button>
                <Link to={path("quote", lang)} className="border border-slate-900 font-semibold px-5 py-3 text-sm">
                  {L(lang, "Anmod om tilbud", "Request a quote")}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <ProductGrid rows={rows.slice(0, limit)} lang={lang} view={view} />
              {rows.length > limit && (
                <div className="mt-10 text-center">
                  <button onClick={() => setLimit((l) => l + 12)} className="border border-slate-900 font-semibold px-7 py-3.5 text-sm hover:bg-slate-50">
                    {L(lang, "Vis flere containere", "Load more containers")}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label={L(lang, "Filtre", "Filters")}>
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-[88%] max-w-sm bg-white overflow-y-auto p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg">{L(lang, "Filtre", "Filters")}</h2>
              <button onClick={() => setDrawer(false)} className="p-2" aria-label={L(lang, "Luk filtre", "Close filters")}><X className="w-5 h-5" /></button>
            </div>
            {filterPanel}
            <div className="mt-5 flex gap-3">
              <button onClick={() => setFilters({ ...EMPTY })} className="flex-1 border border-slate-300 py-3 text-sm font-semibold">
                {L(lang, "Ryd", "Clear")}
              </button>
              <button onClick={() => setDrawer(false)} className="flex-1 bg-slate-900 text-white py-3 text-sm font-semibold">
                {L(lang, "Vis resultater", "Show results")} ({rows.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
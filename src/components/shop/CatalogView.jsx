import React, { useMemo, useState } from "react";
import { Link } from "@/lib/next-router";
import { SlidersHorizontal, X, LayoutGrid, List } from "lucide-react";
import ShopFilters from "./ShopFilters";
import ProductGrid from "./ProductGrid";
import { L } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { useAttributeVocabulary } from "@/lib/useAttributeVocabulary";

const EMPTY_ATTRS = {};

export default function CatalogView({ lang, products, categories = [], lockedCategoryId, initialQuery = "", initialAttrs = EMPTY_ATTRS }) {
  const { facetDefinitions, resolve } = useAttributeVocabulary(lang);
  const [filters, setFilters] = useState({ category: [], attrs: initialAttrs, maxPrice: null });
  const [sort, setSort] = useState("recommended");
  const [q, setQ] = useState(initialQuery);
  const [view, setView] = useState("grid");
  const [limit, setLimit] = useState(12);
  const [drawer, setDrawer] = useState(false);

  const scoped = useMemo(
    () => (lockedCategoryId ? products.filter((p) => p.category_id === lockedCategoryId) : products),
    [products, lockedCategoryId]
  );

  const maxPrice = useMemo(() => Math.max(50000, ...scoped.map((p) => p.price || 0)), [scoped]);

  const rows = useMemo(() => {
    let list = scoped;
    if (filters.category.length) list = list.filter((p) => filters.category.includes(p.category_id));
    for (const [key, rawValues] of Object.entries(filters.attrs)) {
      if (rawValues && rawValues.length) list = list.filter((p) => rawValues.includes(String(p.attributes?.[key])));
    }
    if (filters.maxPrice) list = list.filter((p) => !p.price || p.price <= filters.maxPrice);
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter((p) => [p.name, p.short_description, ...Object.values(p.attributes || {})].filter(Boolean).join(" ").toLowerCase().includes(t));
    }
    const price = (p) => (p.sale_price > 0 ? p.sale_price : p.price) || 1e9;
    const sorters = {
      price_asc: (a, b) => price(a) - price(b),
      price_desc: (a, b) => (price(b) === 1e9 ? 0 : price(b)) - (price(a) === 1e9 ? 0 : price(a)),
      name: (a, b) => a.name.localeCompare(b.name),
      recommended: (a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0),
    };
    return [...list].sort(sorters[sort] || sorters.recommended);
  }, [scoped, filters, q, sort]);

  const categoryOptions = lockedCategoryId ? [] : categories.map((c) => ({ id: c.id, name: c.name }));

  const chips = [
    ...filters.category.map((id) => ({ group: "category", value: id, label: categories.find((c) => c.id === id)?.name || id })),
    ...Object.entries(filters.attrs).flatMap(([key, rawValues]) =>
      (rawValues || []).map((raw) => ({ group: "attrs", key, value: raw, label: resolve(key, raw).value }))
    ),
  ];

  const removeChip = (chip) => {
    if (chip.group === "category") setFilters({ ...filters, category: filters.category.filter((v) => v !== chip.value) });
    else setFilters({ ...filters, attrs: { ...filters.attrs, [chip.key]: (filters.attrs[chip.key] || []).filter((v) => v !== chip.value) } });
  };

  const clearAll = () => setFilters({ category: [], attrs: {}, maxPrice: null });

  const filterPanel = (
    <ShopFilters lang={lang} filters={filters} setFilters={setFilters} categories={categoryOptions} facetDefinitions={facetDefinitions} maxPrice={maxPrice} />
  );

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-10">
      <aside className="hidden lg:block">
        <h2 className="font-heading font-bold text-lg border-b border-slate-900 pb-3">{L(lang, "Filtre", "Filters")}</h2>
        {filterPanel}
        <button onClick={clearAll} className="mt-5 text-sm font-semibold underline underline-offset-4">
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
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L(lang, "Søg efter navn", "Search by name")}
              className="w-full border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-sm flex items-center gap-2">
            <span className="hjc-label">{L(lang, "Sortér", "Sort")}</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-slate-300 px-3 py-2 text-sm">
              <option value="recommended">{L(lang, "Anbefalet", "Recommended")}</option>
              <option value="price_asc">{L(lang, "Pris: lav til høj", "Price: low to high")}</option>
              <option value="price_desc">{L(lang, "Pris: høj til lav", "Price: high to low")}</option>
              <option value="name">{L(lang, "Navn", "Name")}</option>
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
            {rows.length} {L(lang, "containere", "containers")}
          </p>
          {chips.map((c) => (
            <button key={c.group + (c.key || "") + c.value} onClick={() => removeChip(c)}
              className="inline-flex items-center gap-1.5 border border-slate-300 px-2.5 py-1 hjc-mono text-[11px] hover:bg-slate-50">
              {c.label} <X className="w-3 h-3" />
            </button>
          ))}
          {chips.length > 0 && (
            <button onClick={clearAll} className="hjc-mono text-[11px] underline">
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
                <button onClick={() => { clearAll(); setQ(""); }} className="bg-slate-900 text-white font-semibold px-5 py-3 text-sm">
                  {L(lang, "Ryd filtre", "Clear filters")}
                </button>
                <Link to={path("quote", lang)} className="border border-slate-900 font-semibold px-5 py-3 text-sm">
                  {L(lang, "Anmod om tilbud", "Request a quote")}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <ProductGrid products={rows.slice(0, limit)} lang={lang} view={view} />
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
              <button onClick={clearAll} className="flex-1 border border-slate-300 py-3 text-sm font-semibold">
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

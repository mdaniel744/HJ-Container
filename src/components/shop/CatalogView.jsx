import React, { useMemo, useState } from "react";
import { Link } from "@/lib/next-router";
import { SlidersHorizontal, X, LayoutGrid, List } from "lucide-react";
import ShopFilters from "./ShopFilters";
import ProductGrid from "./ProductGrid";
import { L } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { useAttributeVocabulary } from "@/lib/useAttributeVocabulary";

const EMPTY = { category: [], attrs: {}, availability: [], maxPrice: null };

function effectivePrice(p) {
  return p.sale_price > 0 && p.sale_price < p.price ? p.sale_price : p.price;
}

export default function CatalogView({ lang, products, categories, lockedCategoryId, initialQuery = "", initialAttrs }) {
  const [filters, setFilters] = useState({ ...EMPTY, attrs: initialAttrs || {} });
  const [sort, setSort] = useState("recommended");
  const [q, setQ] = useState(initialQuery);
  const [view, setView] = useState("grid");
  const [limit, setLimit] = useState(12);
  const [drawer, setDrawer] = useState(false);
  const { facetDefinitions } = useAttributeVocabulary(lang);

  const maxPrice = useMemo(() => Math.max(50000, ...products.map((p) => p.price || 0)), [products]);

  const rows = useMemo(() => {
    let list = products;
    if (lockedCategoryId) list = list.filter((p) => p.category_id === lockedCategoryId);
    if (filters.category.length) list = list.filter((p) => filters.category.includes(p.category_id));
    Object.entries(filters.attrs).forEach(([key, values]) => {
      if (values.length) list = list.filter((p) => values.includes(p.attributes?.[key]));
    });
    if (filters.availability.includes("in_stock")) list = list.filter((p) => p.stock_quantity > 0);
    if (filters.maxPrice) list = list.filter((p) => !p.price || p.price <= filters.maxPrice);
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter((p) =>
        [p.name, p.sku, ...Object.values(p.attributes || {})].filter(Boolean).join(" ").toLowerCase().includes(t)
      );
    }
    const sorters = {
      price_asc: (a, b) => (effectivePrice(a) || 1e9) - (effectivePrice(b) || 1e9),
      price_desc: (a, b) => (effectivePrice(b) || 0) - (effectivePrice(a) || 0),
      name: (a, b) => a.name.localeCompare(b.name),
      recommended: (a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0),
    };
    return [...list].sort(sorters[sort] || sorters.recommended);
  }, [products, filters, q, sort, lockedCategoryId]);

  const chips = [
    ...filters.category.map((id) => ({ group: "category", value: id, label: categories.find((c) => c.id === id)?.name || id })),
    ...Object.entries(filters.attrs).flatMap(([key, values]) =>
      values.map((v) => ({
        group: "attrs",
        attrKey: key,
        value: v,
        label: facetDefinitions.find((f) => f.key === key)?.values.find((fv) => fv.raw === v)?.label || v,
      }))
    ),
    ...filters.availability.map((v) => ({ group: "availability", value: v, label: L(lang, "På lager", "In stock") })),
  ];

  const removeChip = (chip) => {
    if (chip.group === "attrs") {
      setFilters({ ...filters, attrs: { ...filters.attrs, [chip.attrKey]: filters.attrs[chip.attrKey].filter((v) => v !== chip.value) } });
    } else {
      setFilters({ ...filters, [chip.group]: filters[chip.group].filter((v) => v !== chip.value) });
    }
  };

  const filterPanel = (
    <ShopFilters
      lang={lang}
      filters={filters}
      setFilters={setFilters}
      categories={lockedCategoryId ? [] : categories}
      facetDefinitions={facetDefinitions}
      maxPrice={maxPrice}
    />
  );

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
          <p className="hjc-mono text-[11px] text-slate-500 mr-2">{rows.length} {L(lang, "containere", "containers")}</p>
          {chips.map((c) => (
            <button key={`${c.group}-${c.attrKey || ""}-${c.value}`} onClick={() => removeChip(c)}
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
                {L(lang,
                  "Prøv at rydde filtrene, eller send en tilbudsforespørgsel — vi kan ofte skaffe en specifik variant.",
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

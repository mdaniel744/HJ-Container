import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "@/lib/next-router";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Check, Mail, Minus, Plus } from "lucide-react";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import PageNotFoundContent from "@/components/site/PageNotFoundContent";
import Gallery from "@/components/product/Gallery";
import VariantSelector from "@/components/product/VariantSelector";
import SpecTable from "@/components/product/SpecTable";
import PriceBlock from "@/components/product/PriceBlock";
import DeliveryCalculator from "@/components/delivery/DeliveryCalculator";
import ProductCard from "@/components/shop/ProductCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CONDITION_LABEL, L, pick, useLang } from "@/lib/i18n";
import { CATEGORY_LABEL, COLLECTIONS, path } from "@/lib/routes";
import { useCatalog, startingVariant } from "@/lib/useCatalog";
import { useCart } from "@/lib/CartContext";
import { useSeo, breadcrumbJsonLd, organizationJsonLd } from "@/lib/seo";
import { useRegisterAltPath } from "@/lib/AltPath";
import { GUIDES } from "@/lib/guides";

const SCHEMA_AVAIL = { in_stock: "InStock", out_of_stock: "OutOfStock", on_request: "PreOrder", backorder: "BackOrder" };

export default function Product() {
  const lang = useLang();
  const { slug } = useParams();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products, variants, isLoading } = useCatalog();
  const { addItem } = useCart();
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [delivery, setDelivery] = useState(null);
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.slug_da === slug || p.slug_en === slug);
  const myVariants = useMemo(
    () => (product ? variants.filter((v) => v.product_key === product.key) : []),
    [product, variants]
  );

  const requestedSku = searchParams.get("variant");

  useEffect(() => {
    if (!myVariants.length) return;
    const match = myVariants.find((v) => v.sku === requestedSku);
    setSelected(match || startingVariant(myVariants));
  }, [myVariants.length, requestedSku, product?.key]);

  const selectVariant = (v) => {
    setSelected(v);
    setDelivery(null);
    navigate(`${pathname}?variant=${v.sku}`, { replace: true });
  };

  const { data: faqs = [] } = useQuery({
    queryKey: ["faqs-product"],
    queryFn: () => base44.entities.Faq.filter({ published: true }, "sort_order", 60),
  });

  useRegisterAltPath(product ? { da: path("product", "da", product.slug_da) + (selected ? `?variant=${selected.sku}` : ""), en: path("product", "en", product.slug_en) + (selected ? `?variant=${selected.sku}` : "") } : null);

  const name = product ? pick(product, "name", lang) : "";
  const variantTitle = selected ? `${name} — ${selected.size} ${CONDITION_LABEL[selected.condition][lang]}` : name;
  const images = selected?.image ? [selected.image, ...(product?.images || []).filter((i) => i !== selected.image)] : product?.images || [];

  const crumbs = product
    ? [
        { name: L(lang, "Forside", "Home"), path: path("home", lang) },
        { name: L(lang, "Shop", "Shop"), path: path("shop", lang) },
        { name: CATEGORY_LABEL[product.category][lang], path: path("category", lang, COLLECTIONS.find((c) => c.key === product.category).slug[lang]) },
        { name: variantTitle },
      ]
    : [];

  useSeo({
    lang,
    title: product ? (pick(product, "seo_title", lang) || `${variantTitle} | HJ Container ApS`) : "404",
    description: product ? (pick(product, "seo_description", lang) || pick(product, "short", lang)) : "",
    image: images[0],
    daPath: product && path("product", "da", product.slug_da),
    enPath: product && path("product", "en", product.slug_en),
    noindex: !product,
    jsonLd: product && selected
      ? [
          breadcrumbJsonLd(crumbs.filter((c) => c.path)),
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: variantTitle,
            description: pick(product, "description", lang),
            image: images,
            sku: selected.sku,
            mpn: selected.mpn || undefined,
            gtin: selected.gtin || undefined,
            brand: { "@type": "Brand", name: "HJ Container ApS" },
            inProductGroupWithID: selected.item_group_id,
            offers: {
              "@type": "Offer",
              url: `${typeof window === "undefined" ? "" : window.location.origin}${pathname}?variant=${selected.sku}`,
              priceCurrency: "DKK",
              price: selected.price_incl_vat || undefined,
              itemCondition: selected.condition === "new" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
              availability: `https://schema.org/${SCHEMA_AVAIL[selected.availability] || "PreOrder"}`,
              seller: organizationJsonLd(),
            },
          },
        ]
      : [],
  });

  if (isLoading) return <p className="mx-auto max-w-7xl px-5 py-20 hjc-mono text-sm text-slate-500">{L(lang, "Indlæser…", "Loading…")}</p>;
  if (!product || !selected) return <PageNotFoundContent />;

  const canOrder = selected.direct_order && selected.price_incl_vat > 0 && selected.availability !== "out_of_stock";
  const sizeCollection = COLLECTIONS.find((c) => c.kind === "size" && c.key === selected.size);
  const relatedProducts = products.filter((p) => p.key !== product.key).slice(0, 3);
  const relevantFaqs = faqs.filter((f) => ["delivery", "unloading", "ordering", "returns"].includes(f.category)).slice(0, 5);

  const addToCart = () => {
    addItem(
      {
        sku: selected.sku, title: variantTitle, size: selected.size, condition: selected.condition,
        quantity, unit_price_incl_vat: selected.price_incl_vat,
        product_slug: pick(product, "slug", lang), image: images[0],
      },
      L(lang, `${variantTitle} lagt i kurven.`, `${variantTitle} added to cart.`)
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 4000);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <Breadcrumbs items={crumbs} />

      <div className="mt-8 grid lg:grid-cols-2 gap-12">
        <Gallery images={images} alt={variantTitle} lang={lang} />

        <div>
          <p className="hjc-label">{CATEGORY_LABEL[product.category][lang]}</p>
          <h1 className="mt-3 font-heading text-3xl md:text-4xl font-extrabold leading-tight">{variantTitle}</h1>
          <p className="hjc-mono text-[11px] text-slate-400 mt-2">
            SKU {selected.sku} · {L(lang, "Produktgruppe", "Product group")} {selected.item_group_id}
          </p>
          <p className="mt-5 text-slate-600 leading-relaxed">{pick(product, "short", lang)}</p>

          <div className="mt-8"><VariantSelector variants={myVariants} selected={selected} onSelect={selectVariant} lang={lang} /></div>

          <div className="mt-8"><PriceBlock variant={selected} lang={lang} delivery={delivery} /></div>

          <div className="mt-6 flex flex-wrap items-stretch gap-3">
            <div className="flex items-center border border-slate-300">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-3" aria-label={L(lang, "Færre", "Decrease quantity")}><Minus className="w-4 h-4" /></button>
              <input value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                className="w-14 text-center hjc-mono text-sm border-x border-slate-300 py-3" aria-label={L(lang, "Antal", "Quantity")} />
              <button onClick={() => setQuantity((q) => q + 1)} className="p-3" aria-label={L(lang, "Flere", "Increase quantity")}><Plus className="w-4 h-4" /></button>
            </div>
            {canOrder && (
              <button onClick={addToCart} className="flex-1 min-w-[180px] bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3.5">
                {L(lang, "Læg i kurv", "Add to cart")}
              </button>
            )}
            <Link to={`${path("quote", lang)}?product=${product.key}&size=${selected.size}&condition=${selected.condition}`}
              className="flex-1 min-w-[180px] text-center border border-slate-900 text-slate-900 font-semibold px-6 py-3.5 hover:bg-slate-50">
              {L(lang, "Anmod om tilbud", "Request a quote")}
            </Link>
          </div>

          {added && (
            <p className="mt-4 flex items-center gap-2 text-sm text-emerald-700 font-medium">
              <Check className="w-4 h-4" /> {L(lang, "Lagt i kurven.", "Added to cart.")}{" "}
              <Link to={path("cart", lang)} className="underline">{L(lang, "Gå til kurv", "Go to cart")}</Link>
            </p>
          )}

          {!canOrder && (
            <p className="mt-4 text-sm text-slate-600 border-l-2 border-orange-500 pl-4">
              {L(lang, "Denne variant kan ikke bestilles direkte. Vi prissætter den individuelt gennem en tilbudsforespørgsel.",
                "This variant cannot be ordered directly. We price it individually through a quote request.")}
            </p>
          )}

          <a href="mailto:contact@hjcontainer.com" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-700 underline underline-offset-4">
            <Mail className="w-4 h-4" /> {L(lang, "Spørg om denne container", "Ask about this container")}
          </a>
        </div>
      </div>

      <div className="mt-16 grid lg:grid-cols-2 gap-12">
        <section>
          <h2 className="font-heading text-2xl font-extrabold">{L(lang, "Tekniske specifikationer", "Technical specifications")}</h2>
          <div className="mt-5 hidden md:block"><SpecTable variant={selected} lang={lang} /></div>
          <Accordion type="single" collapsible className="mt-5 md:hidden border border-slate-200 px-4">
            <AccordionItem value="specs" className="border-none">
              <AccordionTrigger className="font-heading font-semibold">{L(lang, "Vis alle mål og vægt", "Show all dimensions and weight")}</AccordionTrigger>
              <AccordionContent><SpecTable variant={selected} lang={lang} /></AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-extrabold">{L(lang, "Levering og aflæsning", "Delivery and unloading")}</h2>
          <div className="mt-5">
            <DeliveryCalculator lang={lang} variant={selected} quantity={quantity} onChange={({ result }) => setDelivery(result)} />
          </div>
        </section>
      </div>

      <section className="mt-16 grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="font-heading text-2xl font-extrabold">{L(lang, "Produktbeskrivelse", "Product description")}</h2>
          <p className="mt-4 text-slate-600 leading-relaxed whitespace-pre-line">{pick(product, "description", lang)}</p>
          <h3 className="mt-8 font-heading text-lg font-bold">{L(lang, "Typiske anvendelser", "Typical applications")}</h3>
          <p className="mt-3 text-slate-600 leading-relaxed whitespace-pre-line">{pick(product, "applications", lang)}</p>
          <h3 className="mt-8 font-heading text-lg font-bold">{L(lang, "Om standen", "About the condition")}</h3>
          <p className="mt-3 text-slate-600 leading-relaxed">
            {selected.condition === "new"
              ? L(lang, "One Trip-containere har kun gennemført en enkelt transport. Slitagen er minimal, og farven er ensartet.",
                  "One Trip containers have completed only a single voyage. Wear is minimal and the colour is uniform.")
              : L(lang, "Brugte containere har synlige brugsspor som ridser og buler. Det påvirker ikke funktionen, når containeren er tæt.",
                  "Used containers show visible signs of use such as scratches and dents. This does not affect function when the unit is tight.")}{" "}
            <Link to={path("guide", lang, GUIDES[8].slug[lang])} className="underline underline-offset-2 font-medium text-slate-900">
              {GUIDES[8].title[lang]}
            </Link>.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-extrabold">{L(lang, "Ofte stillede spørgsmål", "Frequently asked questions")}</h2>
          {relevantFaqs.length > 0 && (
            <Accordion type="single" collapsible className="mt-4">
              {relevantFaqs.map((f) => (
                <AccordionItem key={f.id} value={f.id}>
                  <AccordionTrigger className="text-left font-heading font-semibold">{pick(f, "question", lang)}</AccordionTrigger>
                  <AccordionContent className="text-slate-600">{pick(f, "answer", lang)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
          <div className="mt-8 border border-slate-200 p-5">
            <p className="hjc-label mb-3">{L(lang, "Relateret information", "Related information")}</p>
            <ul className="space-y-2 text-sm">
              {sizeCollection && (
                <li><Link className="underline underline-offset-2" to={path("category", lang, sizeCollection.slug[lang])}>{sizeCollection.label[lang]}</Link></li>
              )}
              <li><Link className="underline underline-offset-2" to={path("policy", lang, lang === "en" ? "shipping-and-delivery" : "levering-og-fragt")}>{L(lang, "Levering og fragt", "Shipping and delivery")}</Link></li>
              <li><Link className="underline underline-offset-2" to={path("policy", lang, lang === "en" ? "returns-and-refunds" : "returnering-og-tilbagebetaling")}>{L(lang, "Returnering og tilbagebetaling", "Returns and refunds")}</Link></li>
              <li><Link className="underline underline-offset-2" to={path("policy", lang, lang === "en" ? "right-of-withdrawal" : "fortrydelsesret")}>{L(lang, "Fortrydelsesret", "Right of withdrawal")}</Link></li>
              <li><Link className="underline underline-offset-2" to={path("guide", lang, GUIDES[1].slug[lang])}>{GUIDES[1].title[lang]}</Link></li>
              <li><Link className="underline underline-offset-2" to={path("guide", lang, GUIDES[0].slug[lang])}>{GUIDES[0].title[lang]}</Link></li>
            </ul>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="font-heading text-2xl font-extrabold border-b border-slate-200 pb-5">{L(lang, "Relaterede containere", "Related containers")}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((p) => {
              const list = variants.filter((v) => v.product_key === p.key);
              const v = list.find((x) => x.size === selected.size) || startingVariant(list);
              return <ProductCard key={p.key} product={p} variant={v} lang={lang} />;
            })}
          </div>
        </section>
      )}
    </div>
  );
}

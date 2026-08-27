import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@/lib/next-router";
import { Check, Mail, Minus, Plus } from "lucide-react";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import PageNotFoundContent from "@/components/site/PageNotFoundContent";
import Gallery from "@/components/product/Gallery";
import SpecTable from "@/components/product/SpecTable";
import PriceBlock from "@/components/product/PriceBlock";
import DeliveryCalculator from "@/components/delivery/DeliveryCalculator";
import ProductCard from "@/components/shop/ProductCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { L, pick, useLang } from "@/lib/i18n";
import { path } from "@/lib/routes";
import { useProduct, useProducts, useCategories } from "@/lib/useCatalog";
import { STORE_ID } from "@/lib/supabase/client";
import { fetchTranslationValue } from "@/lib/supabase/translations";
import { PRODUCTS as LOCAL_PRODUCTS } from "@/data/products";
import { useCart } from "@/lib/CartContext";
import { useSeo, breadcrumbJsonLd, organizationJsonLd } from "@/lib/seo";
import { useRegisterAltPath } from "@/lib/AltPath";
import { GUIDES } from "@/lib/guides";
import { applyFaqOverrides } from "@/lib/faqOverrides";
import { FAQS } from "@/data/content";
import RichText from "@/components/RichText";
import { stripHtmlToText } from "@/lib/richText";
import { findAttributeEntry } from "@/lib/localize";
import { useAttributeVocabulary } from "@/lib/useAttributeVocabulary";

const SIZE_KEYS = ["Størrelse", "Size"];
const SCHEMA_CONDITION = { new: "NewCondition", used: "UsedCondition", refurbished: "RefurbishedCondition" };

export default function Product() {
  const lang = useLang();
  const { slug } = useParams();
  const { product, isLoading } = useProduct(slug, lang);
  const { products } = useProducts(lang);
  const { categories } = useCategories(lang);
  const { addItem } = useCart();
  const { resolve } = useAttributeVocabulary(lang);
  const [quantity, setQuantity] = useState(1);
  const [delivery, setDelivery] = useState(null);
  const [added, setAdded] = useState(false);

  const faqs = applyFaqOverrides(FAQS.filter((f) => f.published));

  // The English URL for the alt-language switcher needs a translated slug
  // that isn't on the fetched row itself (product.slug is always the
  // source-locale value — see src/lib/supabase/products.js). On the Danish
  // page we look it up; on the English page the current URL param already
  // *is* a working English slug, so no lookup is needed there.
  const altSlugQuery = useQuery({
    queryKey: ["product-alt-slug", STORE_ID, product?.id, lang],
    queryFn: () =>
      STORE_ID
        ? fetchTranslationValue("product", product.id, "slug", "en")
        : Promise.resolve(LOCAL_PRODUCTS.find((p) => p.id === product.id)?.slug_en || null),
    enabled: lang === "da" && !!product,
  });

  useRegisterAltPath(
    product
      ? {
          da: path("product", "da", product.slug),
          en: path("product", "en", lang === "en" ? slug : altSlugQuery.data || product.slug),
        }
      : null
  );

  const name = product?.name || "";
  const images = product?.images || [];
  const imageAlts = product?.image_alts || [];
  const category = product && categories.find((c) => c.id === product.category_id);
  const attrs = product?.attributes || {};
  // Raw JSON keys are always source-locale, so only match the Danish key —
  // resolve() below handles translating the value for display.
  const sizeEntry = findAttributeEntry(attrs, SIZE_KEYS);
  const size = sizeEntry?.value || null;

  const crumbs = product
    ? [
        { name: L(lang, "Forside", "Home"), path: path("home", lang) },
        { name: L(lang, "Shop", "Shop"), path: path("shop", lang) },
        ...(category ? [{ name: category.name, path: path("category", lang, category.slug) }] : []),
        { name },
      ]
    : [];

  useSeo({
    lang,
    title: product ? `${name} | HJ Container ApS` : "404",
    description: product ? product.short_description || stripHtmlToText(product.description).slice(0, 158) : "",
    image: images[0],
    daPath: product && path("product", "da", product.slug),
    enPath: product && path("product", "en", lang === "en" ? slug : altSlugQuery.data || product.slug),
    noindex: !product,
    jsonLd: product
      ? [
          breadcrumbJsonLd(crumbs.filter((c) => c.path)),
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name,
            description: stripHtmlToText(product.description),
            image: images,
            sku: product.sku || undefined,
            mpn: product.mpn || undefined,
            gtin: product.gtin || undefined,
            brand: { "@type": "Brand", name: product.brand || "HJ Container ApS" },
            offers: {
              "@type": "Offer",
              url: `${typeof window === "undefined" ? "" : window.location.origin}${path("product", lang, product.slug)}`,
              priceCurrency: product.currency || "DKK",
              price: (product.sale_price > 0 ? product.sale_price : product.price) || undefined,
              itemCondition: `https://schema.org/${SCHEMA_CONDITION[product.condition] || "UsedCondition"}`,
              availability: `https://schema.org/${product.stock_quantity > 0 ? "InStock" : "PreOrder"}`,
              seller: organizationJsonLd(),
            },
          },
        ]
      : [],
  });

  if (isLoading) return <p className="mx-auto max-w-7xl px-5 py-20 hjc-mono text-sm text-slate-500">{L(lang, "Indlæser…", "Loading…")}</p>;
  if (!product) return <PageNotFoundContent />;

  const canOrder = product.price > 0;
  const relatedProducts = products.filter((p) => p.id !== product.id && p.category_id === product.category_id).slice(0, 3);
  const relevantFaqs = faqs.filter((f) => ["delivery", "unloading", "ordering", "returns"].includes(f.category)).slice(0, 5);

  const addToCart = () => {
    addItem(
      {
        sku: product.sku || product.id,
        title: name,
        size,
        condition: product.condition,
        quantity,
        unit_price_incl_vat: product.sale_price > 0 && product.sale_price < product.price ? product.sale_price : product.price,
        product_slug: product.slug,
        image: images[0],
      },
      L(lang, `${name} lagt i kurven.`, `${name} added to cart.`)
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 4000);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <Breadcrumbs items={crumbs} />

      <div className="mt-8 grid lg:grid-cols-2 gap-12">
        <Gallery images={images} imageAlts={imageAlts} alt={name} lang={lang} />

        <div>
          {category && <p className="hjc-label">{category.name}</p>}
          <h1 className="mt-3 font-heading text-3xl md:text-4xl font-extrabold leading-tight">{name}</h1>
          {product.sku && <p className="hjc-mono text-[11px] text-slate-400 mt-2">SKU {product.sku}</p>}
          {product.short_description && <p className="mt-5 text-slate-600 leading-relaxed">{product.short_description}</p>}

          <div className="mt-8"><PriceBlock product={product} lang={lang} delivery={delivery} /></div>

          <div className="mt-6 flex flex-wrap items-stretch gap-3">
            <div className="flex items-center border border-slate-300">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-3" aria-label={L(lang, "Færre", "Decrease quantity")}><Minus className="w-4 h-4" /></button>
              <input value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                className="w-14 text-center hjc-mono text-sm border-x border-slate-300 py-3" aria-label={L(lang, "Antal", "Quantity")} />
              <button onClick={() => setQuantity((q) => q + 1)} className="p-3" aria-label={L(lang, "Flere", "Increase quantity")}><Plus className="w-4 h-4" /></button>
            </div>
            {canOrder && (
              <button onClick={addToCart} className="flex-1 min-w-[180px] bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold px-6 py-3.5">
                {L(lang, "Læg i kurv", "Add to cart")}
              </button>
            )}
            <Link to={`${path("quote", lang)}?product=${product.id}`}
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
              {L(lang, "Denne container kan ikke bestilles direkte. Vi prissætter den individuelt gennem en tilbudsforespørgsel.",
                "This container cannot be ordered directly. We price it individually through a quote request.")}
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
          <div className="mt-5 hidden md:block"><SpecTable product={product} resolve={resolve} lang={lang} /></div>
          <Accordion type="single" collapsible className="mt-5 md:hidden border border-slate-200 px-4">
            <AccordionItem value="specs" className="border-none">
              <AccordionTrigger className="font-heading font-semibold">{L(lang, "Vis alle mål og vægt", "Show all dimensions and weight")}</AccordionTrigger>
              <AccordionContent><SpecTable product={product} resolve={resolve} lang={lang} /></AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-extrabold">{L(lang, "Levering og aflæsning", "Delivery and unloading")}</h2>
          <div className="mt-5">
            <DeliveryCalculator lang={lang} variant={{ size }} quantity={quantity} onChange={({ result }) => setDelivery(result)} />
          </div>
        </section>
      </div>

      <section className="mt-16 grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="font-heading text-2xl font-extrabold">{L(lang, "Produktbeskrivelse", "Product description")}</h2>
          <RichText html={product.description} className="mt-4 text-slate-600" />
          {product.condition && (
            <>
              <h3 className="mt-8 font-heading text-lg font-bold">{L(lang, "Om standen", "About the condition")}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">
                {product.condition === "new"
                  ? L(lang, "One Trip-containere har kun gennemført en enkelt transport. Slitagen er minimal, og farven er ensartet.",
                      "One Trip containers have completed only a single voyage. Wear is minimal and the colour is uniform.")
                  : L(lang, "Brugte containere har synlige brugsspor som ridser og buler. Det påvirker ikke funktionen, når containeren er tæt.",
                      "Used containers show visible signs of use such as scratches and dents. This does not affect function when the unit is tight.")}{" "}
                <Link to={path("guide", lang, GUIDES[8].slug[lang])} className="underline underline-offset-2 font-medium text-slate-900">
                  {GUIDES[8].title[lang]}
                </Link>.
              </p>
            </>
          )}
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
              {sizeEntry && (
                <li><Link className="underline underline-offset-2" to={`${path("shop", lang)}?size=${size}`}>{L(lang, `${size} containere`, `${size} containers`)}</Link></li>
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
            {relatedProducts.map((p) => <ProductCard key={p.id} product={p} lang={lang} />)}
          </div>
        </section>
      )}
    </div>
  );
}

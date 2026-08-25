import React from "react";
import Hero from "@/components/home/Hero";
import CategoryCards from "@/components/home/CategoryCards";
import SizeCards from "@/components/home/SizeCards";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TrustPoints from "@/components/home/TrustPoints";
import HowItWorks from "@/components/home/HowItWorks";
import DeliverySection from "@/components/home/DeliverySection";
import FaqPreview from "@/components/home/FaqPreview";
import FinalCta from "@/components/home/FinalCta";
import { useLang, L, pick } from "@/lib/i18n";
import { useProducts, useCategories } from "@/lib/useCatalog";
import { useSeo, organizationJsonLd } from "@/lib/seo";
import { path, CONTAINER_TYPES } from "@/lib/routes";
import { FAQS, POLICIES } from "@/data/content";

export default function Home() {
  const lang = useLang();
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const { products } = useProducts(lang);
  const { categories } = useCategories(lang);
  const faqs = FAQS.filter((f) => f.published && f.show_on_home);
  const policies = POLICIES.filter((p) => p.published);

  const counts = {};
  categories.forEach((cat) => {
    const type = CONTAINER_TYPES.find((c) => c.slug.da === cat.slug || c.slug.en === cat.slug);
    if (type) counts[type.key] = products.filter((p) => p.category_id === cat.id).length;
  });

  const deliveryPolicy = policies.find((p) => p.slug_da === "levering-og-fragt");

  useSeo({
    lang,
    title: L(lang,
      "Køb nye og brugte containere i Danmark | HJ Container ApS",
      "Buy new and used shipping containers in Denmark | HJ Container ApS"),
    description: L(lang,
      "Standard-, High Cube- og Open Side-containere i 10, 20 og 40 fod med tydelige priser i DKK. Bestil direkte eller anmod om et tilbud hos HJ Container ApS i Horsens.",
      "Standard, High Cube and Open Side containers in 10ft, 20ft and 40ft with clear prices in DKK. Order directly or request a quote from HJ Container ApS in Horsens, Denmark."),
    daPath: "/", enPath: "/en",
    jsonLd: [
      organizationJsonLd(),
      { "@context": "https://schema.org", "@type": "WebSite", name: "HJ Container ApS", url: origin,
        inLanguage: lang === "en" ? "en" : "da-DK",
        potentialAction: { "@type": "SearchAction", target: `${origin}${path("shop", lang)}?q={search_term_string}`, "query-input": "required name=search_term_string" } },
    ],
  });

  return (
    <>
      <Hero lang={lang} />
      <CategoryCards lang={lang} counts={counts} />
      <SizeCards lang={lang} />
      <FeaturedProducts lang={lang} products={products} />
      <TrustPoints lang={lang} />
      <HowItWorks lang={lang} />
      <DeliverySection lang={lang} deliveryPolicySlug={deliveryPolicy ? pick(deliveryPolicy, "slug", lang) : null} />
      <FaqPreview lang={lang} faqs={faqs} />
      <FinalCta lang={lang} />
    </>
  );
}

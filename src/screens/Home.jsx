import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
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
import { useCatalog } from "@/lib/useCatalog";
import { useSeo, organizationJsonLd } from "@/lib/seo";
import { path } from "@/lib/routes";
import { applyFaqOverrides } from "@/lib/faqOverrides";

export default function Home() {
  const lang = useLang();
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const { products, variants } = useCatalog();
  const { data: remoteFaqs = [] } = useQuery({
    queryKey: ["faqs-home"],
    queryFn: () => base44.entities.Faq.filter({ published: true, show_on_home: true }, "sort_order", 8),
  });
  const faqs = applyFaqOverrides(remoteFaqs);
  const { data: policies = [] } = useQuery({
    queryKey: ["policies"],
    queryFn: () => base44.entities.PolicyPage.filter({ published: true }, "sort_order", 50),
  });

  const deliveryPolicy = policies.find((p) => p.slug_da === "levering-og-fragt");

  useSeo({
    lang,
    title: L(lang,
      "Køb nye og brugte containere i Danmark | HJ Container ApS",
      "Buy new and used shipping containers in Denmark | HJ Container ApS"),
    description: L(lang,
      "Køb Standard-, High Cube- og Open Side-containere online, eller få tilbud på opbevarings-, kontor-, isolerede og ombyggede containerløsninger.",
      "Buy Standard, High Cube and Open Side containers online, or request a quote for storage, office, insulated and converted container solutions."),
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
      <CategoryCards lang={lang} />
      <SizeCards lang={lang} />
      <FeaturedProducts lang={lang} products={products} variants={variants} />
      <TrustPoints lang={lang} />
      <HowItWorks lang={lang} />
      <DeliverySection lang={lang} deliveryPolicySlug={deliveryPolicy ? pick(deliveryPolicy, "slug", lang) : null} />
      <FaqPreview lang={lang} faqs={faqs} />
      <FinalCta lang={lang} />
    </>
  );
}

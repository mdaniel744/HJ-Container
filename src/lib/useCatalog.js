import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useCatalog() {
  const products = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.filter({ status: "published" }, "sort_order", 200),
  });
  const variants = useQuery({
    queryKey: ["variants"],
    queryFn: () => base44.entities.Variant.filter({ status: "published" }, "sku", 500),
  });
  return {
    products: products.data || [],
    variants: variants.data || [],
    isLoading: products.isLoading || variants.isLoading,
  };
}

export function useSettings() {
  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await base44.entities.SiteSetting.list("-created_date", 1))[0] || null,
  });
  return data || {};
}

export function variantsOf(variants, productKey) {
  return variants.filter((v) => v.product_key === productKey);
}

export function startingVariant(list) {
  const priced = list.filter((v) => v.price_incl_vat > 0);
  const pool = priced.length ? priced : list;
  return [...pool].sort((a, b) => (a.price_incl_vat || 0) - (b.price_incl_vat || 0))[0];
}
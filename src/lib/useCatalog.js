import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { DEMO_PRODUCTS, DEMO_VARIANTS } from "@/data/demoCatalog";

export function isSupportedVariant(variant) {
  return !(variant.size === "10ft" && variant.product_key === "open_side");
}

export function useCatalog() {
  const products = useQuery({
    queryKey: ["products"],
    initialData: DEMO_PRODUCTS,
    queryFn: async () => {
      try {
        const records = await base44.entities.Product.filter({ status: "published" }, "sort_order", 200);
        if (!records.length) return DEMO_PRODUCTS;
        const remoteCategories = new Set(records.map((product) => product.category));
        const fallbackCategories = DEMO_PRODUCTS.filter((product) => !remoteCategories.has(product.category));
        return [...records, ...fallbackCategories];
      } catch {
        return DEMO_PRODUCTS;
      }
    },
  });
  const variants = useQuery({
    queryKey: ["variants"],
    initialData: DEMO_VARIANTS,
    queryFn: async () => {
      try {
        const records = await base44.entities.Variant.filter({ status: "published" }, "sku", 500);
        const supported = records.filter(isSupportedVariant);
        return supported.length ? supported : DEMO_VARIANTS;
      } catch {
        return DEMO_VARIANTS;
      }
    },
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

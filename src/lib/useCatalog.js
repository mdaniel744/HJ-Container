import { useQuery } from "@tanstack/react-query";
import { DEMO_PRODUCTS, DEMO_VARIANTS } from "@/data/demoCatalog";
import { SETTINGS } from "@/data/content";

export function isSupportedVariant(variant) {
  return !(variant.size === "10ft" && variant.product_key === "open_side");
}

export function useCatalog() {
  const productQuery = useQuery({
    queryKey: ["storefront-products"],
    initialData: DEMO_PRODUCTS,
    queryFn: () => Promise.resolve(DEMO_PRODUCTS),
  });
  const variantQuery = useQuery({
    queryKey: ["storefront-variants"],
    initialData: DEMO_VARIANTS,
    queryFn: () => Promise.resolve(DEMO_VARIANTS.filter(isSupportedVariant)),
  });

  return {
    products: productQuery.data || DEMO_PRODUCTS,
    variants: variantQuery.data || DEMO_VARIANTS,
    isLoading: productQuery.isLoading || variantQuery.isLoading,
  };
}

export function useProducts() {
  const { products, isLoading } = useCatalog();
  return { products, isLoading };
}

export function useSettings() {
  return SETTINGS;
}

export function variantsOf(variants, productKey) {
  return variants.filter((variant) => variant.product_key === productKey);
}

export function startingVariant(list) {
  const priced = list.filter((variant) => variant.price_incl_vat > 0);
  const pool = priced.length ? priced : list;
  return [...pool].sort((a, b) => (a.price_incl_vat || 0) - (b.price_incl_vat || 0))[0];
}

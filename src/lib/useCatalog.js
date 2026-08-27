import { useQuery } from "@tanstack/react-query";
import { SETTINGS } from "@/data/content";
import { STORE_ID } from "@/lib/supabase/client";
import { getProducts as getSupabaseProducts, getProductBySlug as getSupabaseProductBySlug } from "@/lib/supabase/products";
import { getCategories as getSupabaseCategories, getCategoryBySlug as getSupabaseCategoryBySlug } from "@/lib/supabase/categories";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import { localizeRow } from "@/lib/localize";

const PRODUCT_FIELDS = ["name", "slug", "short_description", "description"];
const CATEGORY_FIELDS = ["name", "slug", "description", "meta_title", "meta_description"];

function localProducts(locale) {
  return PRODUCTS.map((p) => localizeRow(p, locale, PRODUCT_FIELDS));
}

function localCategories(locale) {
  return CATEGORIES.map((c) => localizeRow(c, locale, CATEGORY_FIELDS));
}

// Live Supabase-backed catalog (flat one-row-per-product model). When
// NEXT_PUBLIC_STORE_ID is unset (local dev, or before this store is
// provisioned) every read falls back to the local sample catalog in
// src/data/products.js, which mirrors the same shape.
export function useProducts(locale = "da") {
  const query = useQuery({
    queryKey: ["products", STORE_ID, locale],
    queryFn: () => (STORE_ID ? getSupabaseProducts(locale) : Promise.resolve(localProducts(locale))),
  });
  return { products: query.data || [], isLoading: query.isLoading };
}

export function useProduct(slug, locale = "da") {
  const query = useQuery({
    queryKey: ["product", STORE_ID, slug, locale],
    queryFn: () =>
      STORE_ID
        ? getSupabaseProductBySlug(slug, locale)
        : Promise.resolve(localProducts(locale).find((p) => p.slug === slug) || null),
    enabled: !!slug,
  });
  return { product: query.data || null, isLoading: query.isLoading };
}

export function useCategories(locale = "da") {
  const query = useQuery({
    queryKey: ["categories", STORE_ID, locale],
    queryFn: () => (STORE_ID ? getSupabaseCategories(locale) : Promise.resolve(localCategories(locale))),
  });
  return { categories: query.data || [], isLoading: query.isLoading };
}

export function useCategory(slug, locale = "da") {
  const query = useQuery({
    queryKey: ["category", STORE_ID, slug, locale],
    queryFn: () =>
      STORE_ID
        ? getSupabaseCategoryBySlug(slug, locale)
        : Promise.resolve(localCategories(locale).find((c) => c.slug === slug) || null),
    enabled: !!slug,
  });
  return { category: query.data || null, isLoading: query.isLoading };
}

export function useSettings() {
  return SETTINGS;
}

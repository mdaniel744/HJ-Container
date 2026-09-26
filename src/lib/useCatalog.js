import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SETTINGS } from "@/data/content";
import { STORE_ID } from "@/lib/supabase/client";
import { getProducts as getSupabaseProducts, getProductBySlug as getSupabaseProductBySlug } from "@/lib/supabase/products";
import { getCategories as getSupabaseCategories, getCategoryBySlug as getSupabaseCategoryBySlug } from "@/lib/supabase/categories";
import { getFamilies as getSupabaseFamilies } from "@/lib/supabase/families";
import { PRODUCTS, CATEGORIES, FAMILIES } from "@/data/products";
import { localizeRow } from "@/lib/localize";
import { isListedContainerCategory, isListedContainerProduct } from "@/lib/containerTypes";

const PRODUCT_FIELDS = ["name", "slug", "short_description", "description"];
const CATEGORY_FIELDS = ["name", "slug", "description", "meta_title", "meta_description"];
const FAMILY_FIELDS = ["name", "slug"];
const CATALOG_STALE_TIME = 5 * 60 * 1000;

function localCategories(locale) {
  return CATEGORIES.map((c) => localizeRow(c, locale, CATEGORY_FIELDS));
}

function localProducts(locale) {
  return PRODUCTS.map((p) => localizeRow(p, locale, PRODUCT_FIELDS));
}

async function listedProducts(locale) {
  const [products, categories] = STORE_ID
    ? await Promise.all([getSupabaseProducts(locale), getSupabaseCategories(locale)])
    : [localProducts(locale), localCategories(locale)];
  const unlistedIds = new Set(categories.filter((category) => !isListedContainerCategory(category)).map((category) => category.id));
  return products.filter((product) => isListedContainerProduct(product, unlistedIds));
}

function localFamilies(locale) {
  return FAMILIES.map((f) => localizeRow(f, locale, FAMILY_FIELDS));
}

// Live Supabase-backed catalog (flat one-row-per-product model). When
// NEXT_PUBLIC_STORE_ID is unset (local dev, or before this store is
// provisioned) every read falls back to the local sample catalog in
// src/data/products.js, which mirrors the same shape.
export function useProducts(locale = "da") {
  const query = useQuery({
    queryKey: ["products", STORE_ID, locale],
    queryFn: () => listedProducts(locale),
    staleTime: CATALOG_STALE_TIME,
  });
  return { products: query.data || [], isLoading: query.isLoading };
}

export function useProduct(slug, locale = "da") {
  const queryClient = useQueryClient();
  const catalogKey = ["products", STORE_ID, locale];
  const query = useQuery({
    queryKey: ["product", STORE_ID, slug, locale],
    queryFn: () =>
      STORE_ID
        ? getSupabaseProductBySlug(slug, locale)
        : Promise.resolve(localProducts(locale).find((p) => p.slug === slug) || null),
    enabled: !!slug,
    // Variant choices are already full product rows in the catalogue. Use
    // that row immediately when navigating to a sibling, then let the next
    // normal refresh pick up later dashboard changes.
    initialData: () => queryClient.getQueryData(catalogKey)?.find((p) => p.slug === slug),
    initialDataUpdatedAt: () => queryClient.getQueryState(catalogKey)?.dataUpdatedAt,
    staleTime: CATALOG_STALE_TIME,
  });
  return { product: query.data || null, isLoading: query.isLoading };
}

export function useCategories(locale = "da") {
  const query = useQuery({
    queryKey: ["categories", STORE_ID, locale],
    queryFn: async () => (STORE_ID ? await getSupabaseCategories(locale) : localCategories(locale)).filter(isListedContainerCategory),
    staleTime: CATALOG_STALE_TIME,
  });
  return { categories: query.data || [], isLoading: query.isLoading };
}

export function useCategory(slug, locale = "da") {
  const query = useQuery({
    queryKey: ["category", STORE_ID, slug, locale],
    queryFn: async () => {
      const category = STORE_ID
        ? getSupabaseCategoryBySlug(slug, locale)
        : localCategories(locale).find((c) => c.slug === slug) || null;
      const resolved = await category;
      return resolved && isListedContainerCategory(resolved) ? resolved : null;
    },
    enabled: !!slug,
  });
  return { category: query.data || null, isLoading: query.isLoading };
}

// Family/variant grouping (proposed `product_families` table — see
// src/lib/supabase/families.js). Falls back to local sample families when
// STORE_ID is unset, or resolves to an empty list before the dashboard has
// created the real table — either way, product.family_id being unset for a
// given product just means it renders as a standalone listing, no picker.
export function useFamilies(locale = "da") {
  const query = useQuery({
    queryKey: ["families", STORE_ID, locale],
    queryFn: () => (STORE_ID ? getSupabaseFamilies(locale) : Promise.resolve(localFamilies(locale))),
    staleTime: CATALOG_STALE_TIME,
  });
  return { families: query.data || [], isLoading: query.isLoading };
}

export function useSettings() {
  return SETTINGS;
}

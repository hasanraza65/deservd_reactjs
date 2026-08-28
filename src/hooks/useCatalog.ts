import { useQuery } from '@tanstack/react-query'
import { catalogApi, type ProductListParams } from '@/api/catalog'
import { checkoutApi } from '@/api/checkout'
import { settingsApi } from '@/api/settings'

/**
 * The full catalogue in one call — there are only 8 products, so this is one
 * request that every page (Shop, Home, Cart, Build-a-Box) shares via React
 * Query's cache instead of each fetching/filtering independently.
 */
export function useAllProducts() {
  return useQuery({
    queryKey: ['products', 'all'],
    queryFn: () => catalogApi.products({ per_page: 100 }),
    select: (data) => data.items,
  })
}

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => catalogApi.products(params),
  })
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => catalogApi.product(slug!),
    enabled: Boolean(slug),
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => catalogApi.categories(),
  })
}

export function useBuildABoxOptions() {
  return useQuery({
    queryKey: ['build-a-box'],
    queryFn: () => catalogApi.buildABoxOptions(),
  })
}

export function useShippingMethods() {
  return useQuery({
    queryKey: ['shipping-methods'],
    queryFn: () => checkoutApi.shippingMethods(),
  })
}

export function usePublicSettings() {
  return useQuery({
    queryKey: ['settings', 'public'],
    queryFn: () => settingsApi.get(),
    staleTime: 5 * 60_000,
  })
}

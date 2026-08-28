import type { ApiProduct } from '@/types/api'

/** The primary image's URL, or the first image if none is flagged primary, or null (renders the "photo coming soon" tile). */
export function primaryImageUrl(product: Pick<ApiProduct, 'images'>): string | null {
  if (!product.images || product.images.length === 0) return null
  return (product.images.find((img) => img.is_primary) ?? product.images[0]).url
}

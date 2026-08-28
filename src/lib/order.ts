import type { BoxSelection } from '@/context/CartContext'
import type { CheckoutItem } from '@/types/api'

type Reorderable = {
  add: (productId: number, quantity?: number) => void
  addBox: (size: number, selections: BoxSelection[]) => void
}

/** Re-adds every item from a past order (via the /orders/{id}/reorder payload) to the current cart. */
export function reorderItems(cart: Reorderable, items: CheckoutItem[]): void {
  for (const item of items) {
    if (item.type === 'product') {
      cart.add(item.product_id, item.quantity)
    } else {
      cart.addBox(
        item.box_size,
        item.selections.map((s): BoxSelection => ({ productId: s.product_id, quantity: s.quantity })),
      )
    }
  }
}

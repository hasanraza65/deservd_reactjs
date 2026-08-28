export type Ingredient = {
  name: string
  image: string | null
}

/**
 * Homepage ingredient showcase. Butter and Brown Sugar have no accurate stock
 * photo available (see IMAGE-TODO.md) and render as icon tiles instead.
 */
export const INGREDIENTS: Ingredient[] = [
  { name: 'Protein Blend', image: '/images/ingredients/protein-blend.jpg' },
  { name: 'Chocolate', image: '/images/ingredients/chocolate.jpg' },
  { name: 'Eggs', image: '/images/ingredients/eggs.jpg' },
  { name: 'Butter', image: null },
  { name: 'Milk', image: '/images/ingredients/milk.jpg' },
  { name: 'Flour', image: '/images/ingredients/flour.jpg' },
  { name: 'Vanilla', image: '/images/ingredients/vanilla.jpg' },
  { name: 'Brown Sugar', image: null },
  { name: 'Oats', image: '/images/ingredients/oats.jpg' },
  { name: 'Sea Salt', image: '/images/ingredients/sea-salt.jpg' },
]

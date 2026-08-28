# Photography to replace

## Active catalogue (`src/data/products.ts`)

| Slug | Image | Source |
| --- | --- | --- |
| `classic-chocolate-chip` | stock | Pexels, stand-in for a real chocolate chip cookie |
| `triple-chocolate` | real | DESERV'D packshot, cropped |
| `marble-cookie` | stock | Pexels, stand-in |
| `cookies-and-cream` | **none** | no accurate match found — renders a "photo coming soon" tile |
| `smores` | real | DESERV'D packshot, cropped |
| `red-velvet` | **none** | no accurate match found — renders a "photo coming soon" tile |
| `xx-chocolate-chip` | stock | Pexels, stand-in |
| `xx-triple-chocolate` | stock | Pexels, stand-in |

### Real DESERV'D photography

Cropped from the supplied packshots; the baked-in logo/flavour text was trimmed
off the bottom of each. Sources live in `../client data/`.

- `cookies/triple-chocolate.jpg` — Triple Dark Chocolate
- `cookies/smores.jpg` — Marble base + S'mores
- `editorial/hero-cookie.jpg` — homepage hero (peach cobbler crop, wide)

Four more flavours were shot but are **not in the current catalogue** because
the client's product-data spec (prompt 2) lists exactly eight SKUs and these
aren't among them. Kept on disk for a future flavour/seasonal drop, and still
used decoratively in the homepage Instagram grid:

- `cookies/apple-cinnamon-cobbler.jpg`
- `cookies/peach-cobbler.jpg`
- `cookies/nutella-biscoff.jpg`
- `cookies/birthday-cake.jpg`

### Stock placeholders (replace before launch)

Licensed from Pexels, pinned by photo ID in `scripts/fetch-images.mjs`, credited
in `public/images/CREDITS.json`. None of these are the real product.

- `cookies/classic-chocolate-chip.jpg`
- `cookies/marble-cookie.jpg`
- `cookies/xx-chocolate-chip.jpg`
- `cookies/xx-triple-chocolate.jpg`
- `editorial/bakery-kitchen.jpg`
- `editorial/ingredients.jpg` (unused since the ingredient-grid rebuild below; kept for reference)

### Red Velvet & Cookies and Cream — no photo

Pexels has no accurate photo of either flavour as an actual cookie — searches
returned macarons, milkshakes, cake, and (for "chocolate cookie") a mismatched
dessert entirely. Rather than show the wrong dessert on a product card, both
render through `ProductImage` (`src/components/product/ProductImage.tsx`) as a
branded "Photo coming soon" tile (`Product.image = null`). Swap in a real photo
by setting `image` on the product entry once one exists — the placeholder
disappears automatically.

## Ingredient showcase (`src/data/ingredients.ts`, homepage + /nutrition)

Pinned by ID in `scripts/fetch-ingredients.mjs`, credited in
`public/images/ingredients/CREDITS.json`. Eight of ten ingredients have a
reasonable stock photo; **Butter** and **Brown Sugar** do not (searches
returned toast, cheese boards, croutons and caramel — nothing usable) and
render as icon tiles instead, same honesty rule as above.

## Logo

`../client data/DESERVD_Logo_Adobe_Master.svg` is a 1536x1024 PNG wrapped in SVG
— a glossy sticker-style mark that does not match the approved UI direction, and
its badge text misspells "HEALTHIER" as "IIEALTHIER". The header/footer lockup is
therefore set in type (`src/components/ui/Wordmark.tsx`), which stays sharp at
any size and works on both cream and chocolate grounds. Swap in a proper vector
wordmark when one exists.

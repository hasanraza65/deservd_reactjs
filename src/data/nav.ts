export type NavItem = { label: string; to: string }

export const MAIN_NAV: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Build a Box', to: '/build-a-box' },
  { label: 'Our Story', to: '/story' },
  { label: 'Nutrition', to: '/nutrition' },
  { label: 'FAQ', to: '/faq' },
]

export const FOOTER_NAV: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Shop',
    items: [
      { label: 'All Cookies', to: '/shop' },
      { label: 'Build a Box', to: '/build-a-box' },
      { label: 'XX 20G Protein Cookies', to: '/shop?tier=xx' },
      { label: 'Gift Boxes', to: '/shop?collection=gifting' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { label: 'Our Story', to: '/story' },
      { label: 'Ingredients', to: '/nutrition#ingredients' },
      { label: 'Nutrition', to: '/nutrition' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  {
    heading: 'Help',
    items: [
      { label: 'Shipping & Delivery', to: '/shipping' },
      { label: 'Returns & Refunds', to: '/refund-policy' },
      { label: 'My Account', to: '/account' },
      { label: 'Order Tracking', to: '/account/orders' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'FAQs', to: '/faq' },
    ],
  },
]

export type BenefitKey = 'protein' | 'baked' | 'macro' | 'dessert'

export const BENEFITS: { key: BenefitKey; label: string; short: string; copy: string }[] = [
  {
    key: 'protein',
    label: '13G+ Protein',
    short: '13g+ protein in every cookie',
    copy: '13g+ of protein in every standard cookie. 20g in our XX 150g protein cookies.',
  },
  {
    key: 'baked',
    label: 'Baked Fresh',
    short: 'Baked fresh',
    copy: 'Small batches baked daily for the best taste, texture and quality.',
  },
  {
    key: 'macro',
    label: 'Macro Conscious',
    short: 'Macro conscious',
    copy: 'Balanced with the right fats, carbs and protein to fit your lifestyle.',
  },
  {
    key: 'dessert',
    label: 'Real Dessert',
    short: 'Real dessert',
    copy: 'Indulgent flavour in every soft, chewy bite.',
  },
]

export type FaqItem = { id: string; question: string; answer: string }

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'different',
    question: 'What makes DESERV’D different?',
    answer:
      'We start from flavour first, then build the nutrition around it — not the other way around. Every cookie is baked fresh in small batches to taste like real dessert, with 13g+ of protein and more purposeful macros than a typical bakery cookie.',
  },
  {
    id: 'protein',
    question: 'How much protein is in each cookie?',
    answer:
      'Every standard DESERV’D cookie carries 13g+ of protein. Our DESERV’D XX line steps up to 20g of protein in a larger 150g cookie.',
  },
  {
    id: 'made',
    question: 'Where are DESERV’D cookies made?',
    answer: 'Every cookie is baked in small batches in our commercial kitchen in Miami, Florida.',
  },
  {
    id: 'storage',
    question: 'How should I store my cookies?',
    answer:
      'Keep them at room temperature in the resealable bag for the best texture, or refrigerate for longer freshness. They also freeze well.',
  },
  {
    id: 'freshness',
    question: 'How long do cookies stay fresh?',
    answer:
      'Best enjoyed within 5 days at room temperature, up to 3 weeks refrigerated, or up to 2 months frozen.',
  },
  {
    id: 'pickup',
    question: 'Do you offer local pickup?',
    answer: 'Yes — Miami-area customers can select Local Pickup at checkout for same-day collection, free of charge.',
  },
  {
    id: 'shipping',
    question: 'Do you ship nationwide?',
    answer:
      'Yes, we ship across the United States. Standard shipping is a flat rate and typically arrives in 3–5 business days; orders over the free-shipping threshold ship free automatically.',
  },
  {
    id: 'subscriptions',
    question: 'Do you offer subscriptions?',
    answer:
      'Not yet — subscriptions are on our roadmap. For now, Build a Box makes it easy to reorder your favourite mix any time.',
  },
  {
    id: 'gifts',
    question: 'Do you offer gift boxes?',
    answer: 'Yes — Build a Box works great as a gift, and dedicated gift packaging is coming soon.',
  },
]

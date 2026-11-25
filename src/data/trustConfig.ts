export type TrustBox = {
  key: string
  title: string
  big: string
  small: string
  detail: string
  link: string
  cta: string
  bg: 'pink' | 'lilac' | 'gold' | 'cream'
}

export const trustBoxes: TrustBox[] = [
  { key: 'justdial', title: 'JUSTDIAL', big: '5.0 ★', small: '14 REVIEWS', detail: 'Rated 5.0 across 14 reviews. Photo gallery of the store and products.', link: 'TODO_JUSTDIAL_URL', cta: 'SEE ON JUSTDIAL', bg: 'pink' },
  { key: 'google', title: 'GOOGLE MAPS', big: '5.0 ★', small: '13 REVIEWS', detail: 'Rated 5.0 across 13 reviews. Find the store on the map.', link: 'TODO_GOOGLE_URL', cta: 'OPEN MAP', bg: 'lilac' },
  { key: 'tailoring', title: 'CUSTOM TAILORING', big: 'GOOD FIT', small: 'FROM CUSTOMER REVIEWS', detail: 'Customers mention good fitting in their reviews.', link: '/tailoring', cta: 'BOOK A FITTING', bg: 'gold' },
  { key: 'instagram', title: 'INSTAGRAM', big: '@aandawomenstore', small: 'NEW KOREAN STOCK + REELS', detail: 'New stock and reels posted here. Send a DM or WhatsApp to order.', link: 'https://instagram.com/aandawomenstore', cta: 'FOLLOW', bg: 'cream' },
]
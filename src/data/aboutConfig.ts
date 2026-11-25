export const aboutConfig = {
  name: 'A & A Women Store',
  tagline: 'Imported. Trend-setting. Yours.',
  positioning: 'Specialist in supply of high-quality imported trend-setting Western wears, softest inner wears, lounge wears, and accessories, with a wide range of imported Korean dresses.',
  address: 'No. 108, PV Vaithiyalingam Road (Opposite IOB), Malliga Nagar, Krishnapuram, Old Pallavaram, Chennai 600117, Tamil Nadu',
  landmark: '', // TODO: sign shows "OMEGA SQUARE", confirm with shop before showing anywhere; show nothing if empty
  phone: '+91 79047 33345',
  whatsapp: '917904733345',
  instagram: 'aandawomenstore',
  hours: {
    monFri: '09:30-21:00',
    satSun: '09:30-22:00',
  }, // TODO: Justdial lists 9 PM daily, confirm
  payments: ['Cash', 'Credit Cards', 'Debit Cards', 'UPI / NFC mobile payments'],
  delivery: 'Local delivery and in-store pickup',
  categories: [
    { slug: 'korean', name: 'Korean Collection', line: 'Imported Korean dresses, tops, pants and accessories.', prop: '/hero/scarf.webp' },
    { slug: 'western', name: 'Western and Casual', line: 'Co-ord sets, crop tops, dresses, jumpsuits, denim jackets, trench coats, blazers, wide-leg pants, high-waist jeans, hoodies.', prop: '/hero/sunglasses.webp' },
    { slug: 'ethnic', name: 'Ethnic and Fusion', line: 'Kurtis, anarkalis, indo-western dresses, palazzos, leggings, dupattas, sarees.', prop: '/tailor/dressform.webp' },
    { slug: 'innerwear', name: 'Innerwear and Loungewear', line: 'Soft, lightweight innerwear, loungewear sets, shorts, tank tops.', prop: '/hero/hoodie.webp' },
    { slug: 'accessories', name: 'Accessories', line: 'Bags, sunglasses, scarves and more.', prop: '/hero/handbag.webp' },
    { slug: 'tailoring', name: 'Custom Tailoring', line: 'Stitched to your measurements.', prop: '/tailor/scissors.webp', link: '/tailoring' },
  ],
  story: '', // TODO: ask shop; hide the story block when empty
  reviews: [], // TODO
}
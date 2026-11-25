export type Garment = {
  id: string
  code: string
  name: string
  desc: string
  bg: string
  heroImage: string
  fabrics: string[]
  details: GarmentDetail[]
}

export type GarmentDetail = {
  id: string
  label: string
  options: { value: string; label: string; priceDelta: number }[]
}

export const garments: Garment[] = [
  {
    id: 'kurti',
    code: 'AA-TL-KU',
    name: 'KURTI',
    desc: 'Classic straight-cut kurti with customizable neck, sleeves, length',
    bg: '#FFF6E0',
    heroImage: '/products/tailoring/kurti.webp',
    fabrics: ['Cotton', 'Linen', 'Silk Blend', 'Chanderi'],
    details: [
      { id: 'neck', label: 'Neckline', options: [
        { value: 'round', label: 'Round', priceDelta: 0 },
        { value: 'v-neck', label: 'V-Neck', priceDelta: 100 },
        { value: 'mandarin', label: 'Mandarin Collar', priceDelta: 150 },
        { value: 'keyhole', label: 'Keyhole', priceDelta: 100 },
      ]},
      { id: 'sleeve', label: 'Sleeve', options: [
        { value: 'short', label: 'Short (6")', priceDelta: 0 },
        { value: 'three-quarter', label: '3/4 (18")', priceDelta: 50 },
        { value: 'full', label: 'Full (24")', priceDelta: 100 },
        { value: 'sleeveless', label: 'Sleeveless', priceDelta: -50 },
      ]},
      { id: 'length', label: 'Length', options: [
        { value: 'hip', label: 'Hip (28")', priceDelta: 0 },
        { value: 'knee', label: 'Knee (34")', priceDelta: 100 },
        { value: 'calf', label: 'Calf (40")', priceDelta: 200 },
      ]},
      { id: 'sideSlit', label: 'Side Slit', options: [
        { value: 'none', label: 'None', priceDelta: 0 },
        { value: '6', label: '6"', priceDelta: 50 },
        { value: '10', label: '10"', priceDelta: 100 },
      ]},
    ],
  },
  {
    id: 'jeans',
    code: 'AA-TL-JN',
    name: 'JEANS',
    desc: 'High-waist tailored jeans with custom rise, leg, length, pockets',
    bg: '#C9B6FF',
    heroImage: '/products/tailoring/jeans.webp',
    fabrics: ['Denim 12oz', 'Denim 14oz', 'Stretch Denim', 'Black Denim'],
    details: [
      { id: 'rise', label: 'Rise', options: [
        { value: 'high', label: 'High (11")', priceDelta: 0 },
        { value: 'mid', label: 'Mid (9")', priceDelta: 0 },
        { value: 'low', label: 'Low (7.5")', priceDelta: 0 },
      ]},
      { id: 'leg', label: 'Leg Shape', options: [
        { value: 'straight', label: 'Straight', priceDelta: 0 },
        { value: 'tapered', label: 'Tapered', priceDelta: 50 },
        { value: 'wide', label: 'Wide Leg', priceDelta: 100 },
        { value: 'flare', label: 'Flare', priceDelta: 150 },
      ]},
      { id: 'length', label: 'Inseam', options: [
        { value: 'ankle', label: 'Ankle (27")', priceDelta: 0 },
        { value: 'regular', label: 'Regular (30")', priceDelta: 50 },
        { value: 'tall', label: 'Tall (33")', priceDelta: 100 },
      ]},
      { id: 'pockets', label: 'Back Pockets', options: [
        { value: 'standard', label: 'Standard', priceDelta: 0 },
        { value: 'coin', label: 'Coin Pocket', priceDelta: 50 },
        { value: 'flap', label: 'Flap Pockets', priceDelta: 100 },
      ]},
    ],
  },
  {
    id: 'party',
    code: 'AA-TL-PT',
    name: 'PARTY',
    desc: 'Evening wear — silhouette, neckline, sleeve, embellishment',
    bg: '#FF4D8D',
    heroImage: '/products/tailoring/party.webp',
    fabrics: ['Georgette', 'Crepe', 'Velvet', 'Sequin Mesh'],
    details: [
      { id: 'silhouette', label: 'Silhouette', options: [
        { value: 'fit-flare', label: 'Fit & Flare', priceDelta: 0 },
        { value: 'sheath', label: 'Sheath', priceDelta: 100 },
        { value: 'a-line', label: 'A-Line', priceDelta: 50 },
        { value: 'empire', label: 'Empire Waist', priceDelta: 100 },
      ]},
      { id: 'neck', label: 'Neckline', options: [
        { value: 'sweetheart', label: 'Sweetheart', priceDelta: 0 },
        { value: 'halter', label: 'Halter', priceDelta: 100 },
        { value: 'off-shoulder', label: 'Off-Shoulder', priceDelta: 150 },
        { value: 'one-shoulder', label: 'One-Shoulder', priceDelta: 150 },
      ]},
      { id: 'sleeve', label: 'Sleeve', options: [
        { value: 'strapless', label: 'Strapless', priceDelta: 0 },
        { value: 'cap', label: 'Cap Sleeve', priceDelta: 50 },
        { value: 'long', label: 'Long Fitted', priceDelta: 100 },
        { value: 'bell', label: 'Bell Sleeve', priceDelta: 100 },
      ]},
      { id: 'embellish', label: 'Embellishment', options: [
        { value: 'none', label: 'None', priceDelta: 0 },
        { value: 'sequin', label: 'Sequin Panel', priceDelta: 300 },
        { value: 'embroidery', label: 'Thread Embroidery', priceDelta: 400 },
        { value: 'bead', label: 'Beadwork', priceDelta: 500 },
      ]},
    ],
  },
  {
    id: 'y2k',
    code: 'AA-TL-Y2',
    name: 'Y2K',
    desc: 'Low-rise, cargo, crop — early 2000s reconstructed',
    bg: '#D4AF55',
    heroImage: '/products/tailoring/y2k.webp',
    fabrics: ['Denim', 'Cargo Twill', 'Velour', 'Metallic Knit'],
    details: [
      { id: 'style', label: 'Style', options: [
        { value: 'low-rise', label: 'Low-Rise Cargo', priceDelta: 0 },
        { value: 'mini', label: 'Mini Skirt', priceDelta: -100 },
        { value: 'flare', label: 'Flare Pants', priceDelta: 100 },
        { value: 'crop-top', label: 'Crop Top', priceDelta: -150 },
      ]},
      { id: 'waist', label: 'Waist', options: [
        { value: 'elastic', label: 'Elastic', priceDelta: 0 },
        { value: 'drawstring', label: 'Drawstring', priceDelta: 50 },
        { value: 'button', label: 'Button Fly', priceDelta: 50 },
      ]},
      { id: 'pockets', label: 'Pockets', options: [
        { value: 'cargo', label: 'Cargo (6)', priceDelta: 0 },
        { value: 'patch', label: 'Patch Pockets', priceDelta: 50 },
        { value: 'none', label: 'Clean', priceDelta: -50 },
      ]},
      { id: 'hardware', label: 'Hardware', options: [
        { value: 'standard', label: 'Standard', priceDelta: 0 },
        { value: 'grommet', label: 'Grommets', priceDelta: 100 },
        { value: 'chain', label: 'Chain Detail', priceDelta: 150 },
      ]},
    ],
  },
]

export const basePrices: Record<string, number> = {
  kurti: 1899,
  jeans: 2299,
  party: 3499,
  y2k: 1999,
}
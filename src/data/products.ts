export type Product = {
  id: string
  code: string
  name: string
  collection: string
  image: string
  altImage: string
  images: string[]
  price: number
  mrp: number
  sizes: string[]
  colors: string[]
}

const SIZES = ['S', 'M', 'L', 'XL']

export const products: Product[] = [
  {
    id: 'kurti_01',
    code: 'AA-KU-01',
    name: 'Floral Kurti',
    collection: 'kurti',
    image: '/products/kurti_01.webp',
    altImage: '/tryon/kurti_01.webp',
    images: ['/products/kurti_01.webp', '/products/kurti_01_side.webp', '/products/kurti_01_back.webp'],
    price: 1299,
    mrp: 1899,
    sizes: SIZES,
    colors: ['Cream', 'Pink'],
  },
  {
    id: 'kurti_04',
    code: 'AA-KU-04',
    name: 'Embroidered Kurti',
    collection: 'kurti',
    image: '/products/kurti_04.webp',
    altImage: '/tryon/kurti_04.webp',
    images: ['/products/kurti_04.webp', '/products/kurti_04_side.webp', '/products/kurti_04_back.webp'],
    price: 1499,
    mrp: 2199,
    sizes: SIZES,
    colors: ['Lilac', 'Cream'],
  },
  {
    id: 'kurti_06',
    code: 'AA-KU-06',
    name: 'Printed Kurti',
    collection: 'kurti',
    image: '/products/kurti_06.webp',
    altImage: '/tryon/kurti_06.webp',
    images: ['/products/kurti_06.webp', '/products/kurti_06_side.webp', '/products/kurti_06_back.webp'],
    price: 1199,
    mrp: 1699,
    sizes: SIZES,
    colors: ['Ink', 'Gold'],
  },
  {
    id: 'jeans_01',
    code: 'AA-JN-01',
    name: 'Classic Denim',
    collection: 'jeans',
    image: '/products/jeans_01.webp',
    altImage: '/tryon/jeans_01.webp',
    images: ['/products/jeans_01.webp', '/products/jeans_01_side.webp', '/products/jeans_01_back.webp'],
    price: 1799,
    mrp: 2499,
    sizes: SIZES,
    colors: ['Blue', 'Ink'],
  },
  {
    id: 'jeans_02',
    code: 'AA-JN-02',
    name: 'High-Waist Denim',
    collection: 'jeans',
    image: '/products/jeans_02.webp',
    altImage: '/tryon/jeans_02.webp',
    images: ['/products/jeans_02.webp', '/products/jeans_02_side.webp', '/products/jeans_02_back.webp'],
    price: 1899,
    mrp: 2599,
    sizes: SIZES,
    colors: ['Blue', 'Black'],
  },
  {
    id: 'party_11',
    code: 'AA-PT-11',
    name: 'Party Edit',
    collection: 'party',
    image: '/products/party_11.webp',
    altImage: '/tryon/party_11.webp',
    images: ['/products/party_11.webp', '/products/party_11_side.webp', '/products/party_11_back.webp'],
    price: 2199,
    mrp: 3299,
    sizes: SIZES,
    colors: ['Pink', 'Gold'],
  },
  {
    id: 'y2k_06',
    code: 'AA-Y2-06',
    name: 'Y2K Street',
    collection: 'y2k',
    image: '/products/y2k_06.webp',
    altImage: '/tryon/y2k_06.webp',
    images: ['/products/y2k_06.webp', '/products/y2k_06_side.webp', '/products/y2k_06_back.webp'],
    price: 1599,
    mrp: 2299,
    sizes: SIZES,
    colors: ['Lilac', 'Pink'],
  },
]

export function getDiscount(p: Product): number {
  return Math.round(((p.mrp - p.price) / p.mrp) * 100)
}

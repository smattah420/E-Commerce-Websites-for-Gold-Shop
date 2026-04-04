export type GoldPurity = '18k' | '22k' | '24k'
export type Category = 'Necklaces' | 'Earrings' | 'Rings' | 'Bangles' | 'Challa'

export type Product = {
  id: string
  name: string
  category: Category
  purity: GoldPurity[]
  pricePKR: number
  compareAtPKR?: number
  rating: number
  reviewsCount: number
  image: string
  images: string[]
  badge?: 'Best Seller' | 'New' | 'Limited'
  description: string
}

const gold = (filename: string) => `/gold-assets/${filename}`

// Use only the provided gold jewellery assets (served via Vite `gold-assets` plugin).
// (We intentionally avoid the smallest image to prevent blur on zoom.)
const IMG_NECKLACE_1 = gold(
  'c__Users_Yousuf_Traders_AppData_Roaming_Cursor_User_workspaceStorage_bd58e352660bfe6ae2fac686c1f1baf4_images_image-010ccf32-28dc-483a-9654-7e74e0831588.png',
)
const IMG_NECKLACE_2 = gold(
  'c__Users_Yousuf_Traders_AppData_Roaming_Cursor_User_workspaceStorage_bd58e352660bfe6ae2fac686c1f1baf4_images_image-429908cd-620d-436d-a049-56fd92cb2620.png',
)
const IMG_BANGLES = gold(
  'c__Users_Yousuf_Traders_AppData_Roaming_Cursor_User_workspaceStorage_bd58e352660bfe6ae2fac686c1f1baf4_images_image-13e8fad6-1bd6-446a-814c-257f9317567a.png',
)
const IMG_EARRINGS = gold(
  'c__Users_Yousuf_Traders_AppData_Roaming_Cursor_User_workspaceStorage_bd58e352660bfe6ae2fac686c1f1baf4_images_image-b9538001-ca29-4ffe-b162-a0f7cb71923c.png',
)
const IMG_RING = gold(
  'c__Users_Yousuf_Traders_AppData_Roaming_Cursor_User_workspaceStorage_bd58e352660bfe6ae2fac686c1f1baf4_images_image-02fb022a-459f-4476-ab2d-f76d0ca3dd59.png',
)

export const categories: Array<{ label: Category; blurb: string }> = [
  { label: 'Necklaces', blurb: 'Statement sets for every occasion' },
  { label: 'Earrings', blurb: 'From studs to chandeliers' },
  { label: 'Rings', blurb: 'Minimal to bold silhouettes' },
  { label: 'Bangles', blurb: 'Stackable shine in pure gold' },
  { label: 'Challa', blurb: 'Heritage-inspired charm' },
]

export const products: Product[] = [
  {
    id: 'amj-aurora-necklace',
    name: 'Aurora Necklace Set',
    category: 'Necklaces',
    purity: ['18k', '22k'],
    pricePKR: 755000,
    compareAtPKR: 835000,
    rating: 4.8,
    reviewsCount: 128,
    badge: 'Best Seller',
    image: IMG_NECKLACE_1,
    images: [
      IMG_NECKLACE_1,
      IMG_NECKLACE_2,
      IMG_NECKLACE_2,
    ],
    description:
      'A luminous necklace set crafted for evening glamour—polished finishes, delicate geometry, and a comfortable silhouette.',
  },
  {
    id: 'amj-noor-earrings',
    name: 'Design Chain',
    category: 'Earrings',
    purity: ['18k', '22k', '24k'],
    pricePKR: 280000,
    rating: 4.6,
    reviewsCount: 76,
    badge: 'New',
    image: IMG_EARRINGS,
    images: [
      IMG_EARRINGS,
      IMG_NECKLACE_1,
      IMG_NECKLACE_1,
    ],
    description:
      'Sleek drops with a soft shimmer—made to elevate everyday fits and formal looks without feeling heavy.',
  },
  {
    id: 'amj-sahar-ring',
    name: 'Gold Pipe Bali',
    category: 'Rings',
    purity: ['18k', '22k'],
    pricePKR: 94000,
    compareAtPKR: 104000,
    rating: 4.7,
    reviewsCount: 54,
    image: IMG_RING,
    images: [
      IMG_RING,
      IMG_RING,
      IMG_NECKLACE_2,
    ],
    description:
      'A clean solitaire-inspired ring with a refined band profile—designed for a premium look and effortless stacking.',
  },
  {
    id: 'amj-zar-bangles',
    name: 'Zar Stack Bangles (Set of 2)',
    category: 'Bangles',
    purity: ['22k', '24k'],
    pricePKR: 925000,
    rating: 4.5,
    reviewsCount: 63,
    badge: 'Limited',
    image: IMG_BANGLES,
    images: [
      IMG_BANGLES,
      IMG_BANGLES,
      IMG_NECKLACE_1,
    ],
    description:
      'Three bangles with a subtle pattern play—wear together for statement shine or solo for minimalist elegance.',
  },
  {
    id: 'amj-challa-heritage',
    name: 'Heritage Challa Pendant',
    category: 'Challa',
    purity: ['18k', '22k'],
    pricePKR: 76000,
    rating: 4.4,
    reviewsCount: 41,
    image: IMG_NECKLACE_2,
    images: [
      IMG_NECKLACE_2,
      IMG_NECKLACE_1,
      IMG_BANGLES,
    ],
    description:
      'A modern take on heritage charm—delicate detailing, a premium polish, and a timeless silhouette.',
  },
  {
    id: 'amj-moonlight-earcuff',
    name: 'Design Chain',
    category: 'Earrings',
    purity: ['18k'],
    pricePKR: 225000,
    rating: 4.3,
    reviewsCount: 19,
    image: IMG_EARRINGS,
    images: [
      IMG_EARRINGS,
      IMG_EARRINGS,
      IMG_NECKLACE_2,
    ],
    description:
      'A lightweight cuff with a glossy finish—instant lift to any look, no piercing required.',
  },
]

export function getProductById(id: string) {
  return products.find((p) => p.id === id)
}


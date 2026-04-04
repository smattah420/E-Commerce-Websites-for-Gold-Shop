import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import axios from 'axios'

export type GoldPurity = '18k' | '22k' | '24k'
export type Category = 'Necklaces' | 'Earrings' | 'Rings' | 'Bangles' | 'Challa'

export type Product = {
  id: string // Mapped from _id
  _id?: string
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

type CartItem = {
  productId: string
  qty: number
  purity?: string
  size?: string
}

type StoreContextValue = {
  products: Product[]
  loading: boolean
  error: string | null
  wishlist: string[]
  cart: CartItem[]
  toggleWishlist: (id: string) => void
  addToCart: (id: string, qty?: number, purity?: string, size?: string) => void
  removeFromCart: (id: string, purity?: string, size?: string) => void
  updateQty: (id: string, qty: number, purity?: string, size?: string) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
  refreshProducts: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('amj-wishlist')
    return saved ? JSON.parse(saved) : []
  })
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('amj-cart')
    return saved ? JSON.parse(saved) : []
  })

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('http://localhost:5000/api/products')
      // Normalize MongoDB _id to id for frontend compatibility
      const normalized = data.map((p: any) => ({
        ...p,
        id: p._id,
      }))
      setProducts(normalized)
      setError(null)
    } catch (err: any) {
      console.error('Failed to fetch products:', err)
      setError('Could not load premium collection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    localStorage.setItem('amj-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    localStorage.setItem('amj-cart', JSON.stringify(cart))
  }, [cart])

  const toggleWishlist = (id: string) =>
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const addToCart = (id: string, qty = 1, purity?: string, size?: string) =>
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (x) => x.productId === id && x.purity === purity && x.size === size,
      )
      if (existingIdx > -1) {
        const next = [...prev]
        next[existingIdx] = {
          ...next[existingIdx],
          qty: Math.min(10, next[existingIdx].qty + qty),
        }
        return next
      }
      return [...prev, { productId: id, qty: Math.max(1, Math.min(10, qty)), purity, size }]
    })

  const removeFromCart = (id: string, purity?: string, size?: string) =>
    setCart((prev) =>
      prev.filter((item) => !(item.productId === id && item.purity === purity && item.size === size)),
    )

  const updateQty = (id: string, qty: number, purity?: string, size?: string) =>
    setCart((prev) =>
      prev.map((item) =>
        item.productId === id && item.purity === purity && item.size === size
          ? { ...item, qty: Math.max(1, Math.min(10, qty)) }
          : item,
      ),
    )

  const clearCart = () => setCart([])

  const itemCount = useMemo(() => cart.reduce((n, i) => n + i.qty, 0), [cart])
  
  const subtotal = useMemo(() => {
    return cart.reduce((sum, i) => {
      const p = products.find((x) => x.id === i.productId)
      return sum + (p?.pricePKR ?? 0) * i.qty
    }, 0)
  }, [cart, products])

  const value: StoreContextValue = {
    products,
    loading,
    error,
    wishlist,
    cart,
    toggleWishlist,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    itemCount,
    subtotal,
    refreshProducts: fetchProducts
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}

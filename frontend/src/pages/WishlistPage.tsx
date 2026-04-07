import { Link } from 'react-router-dom'
import { products } from '../lib/catalog'
import { formatPKR } from '../lib/format'
import { useStore } from '../store/StoreContext'

export function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore()
  const list = products.filter((p) => wishlist.includes(p.id))

  if (!list.length) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <h1 className="text-4xl">Your Wishlist is Empty</h1>
        <p className="mt-2 text-sm text-white/65">Tap hearts on products to save them here.</p>
        <Link className="btn mt-5" to="/products">Explore Products</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-5 text-4xl">Wishlist</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((p) => (
          <div key={p.id} className="glass grid gap-4 rounded-2xl p-4 sm:grid-cols-[120px_1fr_auto]">
            <img src={p.image} alt={p.name} className="h-28 w-full rounded-xl object-cover sm:w-28" />
            <div>
              <p className="font-serif text-2xl">{p.name}</p>
              <p className="text-sm text-white/60">{p.category}</p>
              <p className="mt-1 text-white/90">{formatPKR(p.pricePKR)}</p>
            </div>
            <div className="flex items-center gap-2 sm:flex-col sm:items-end">
              <button className="btn btn-gold" onClick={() => addToCart(p.id)}>Add to Cart</button>
              <button className="text-xs text-rose-300 hover:text-rose-200" onClick={() => toggleWishlist(p.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


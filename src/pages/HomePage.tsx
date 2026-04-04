import { ArrowRight, Sparkles, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories } from '../lib/catalog'
import { ProductCard } from '../components/ProductCard'
import { QuickViewModal } from '../components/QuickViewModal'
import { useMemo, useState } from 'react'
import { useStore } from '../store/StoreContext'
import { GoldPriceTicker } from '../components/GoldPriceTicker'

export function HomePage() {
  const { wishlist, toggleWishlist, addToCart, products, loading } = useStore()
  const [quick, setQuick] = useState<any>(null)

  const featured = useMemo(() => products.slice(0, 4), [products])
  const bestSellers = useMemo(() => products.filter((p) => p.badge === 'Best Seller').concat(products.slice(0, 4)), [products])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#d6b25e]" />
          <p className="mt-4 text-white/60 tracking-widest uppercase">Preparing Boutique...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <section className="glass relative overflow-hidden rounded-[2.5rem] p-8 md:p-14 border border-white/5">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#d6b25e]/10 blur-[100px]" />
        <div className="grid items-center gap-12 md:grid-cols-2 relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d6b25e]/30 bg-[#d6b25e]/10 text-[#f1dc9a] text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} /> Luxury Gold Collection
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-white">
              Elegance in Every <span className="gold-text">Golden Detail</span>
            </h1>
            <p className="max-w-xl text-lg text-white/60 leading-relaxed">
              Curated premium jewellery for modern women. Discover timeless designs from Al Majeed
              Jewellers crafted for celebrations, gifts, and everyday luxury.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link className="btn btn-gold !h-14 !px-10 text-lg shadow-[0_10px_30px_rgba(214,178,94,0.3)]" to="/products">
                Shop Now <ArrowRight size={20} className="ml-2" />
              </Link>
              <div className="hidden sm:block">
                <GoldPriceTicker />
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 rounded-3xl" />
            <img
              src="/hero-necklace.png"
              alt="Luxury gold necklace masterpiece"
              className="h-[30rem] w-full rounded-3xl object-cover shadow-2xl group-hover:scale-[1.02] transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.src = products[0]?.image || 'https://images.unsplash.com/photo-1515562141207-7a18b5ce3d8e'
              }}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-4xl font-bold gold-text">Shop by Category</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.label}
              to={`/products?category=${encodeURIComponent(c.label)}`}
              className="glass group rounded-2xl p-6 transition-all border border-white/5 hover:border-[#d6b25e]/30 hover:bg-[#d6b25e]/5"
            >
              <p className="text-2xl font-bold text-white group-hover:text-[#f1dc9a] transition-colors">{c.label}</p>
              <p className="mt-2 text-sm text-white/40 group-hover:text-white/60">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-8 flex items-end justify-between border-b border-white/5 pb-4">
          <h2 className="text-4xl font-bold gold-text">Featured Masterpieces</h2>
          <Link to="/products" className="text-sm text-[#f1dc9a] hover:text-white transition-colors uppercase tracking-widest font-bold">
            Explore All <ArrowRight size={14} className="inline ml-1" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wished={wishlist.includes(p.id)}
              onToggleWishlist={() => toggleWishlist(p.id)}
              onQuickView={() => setQuick(p)}
            />
          ))}
        </div>
      </section>

      <section className="glass rounded-3xl p-10 text-center border border-[#d6b25e]/20 bg-gradient-to-br from-[#d6b25e]/5 to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
           <Sparkles className="text-[#d6b25e]/30 h-20 w-20" />
        </div>
        <h2 className="text-5xl font-bold mb-4">
          Special Privilege: <span className="gold-text">Up to 25% Off</span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-white/60">
          Our limited-time boutique edit. Refined elegance now within reach. 
          Use exclusive code <span className="text-[#f1dc9a] font-bold">ALMAJEED25</span> at checkout.
        </p>
      </section>

      <section>
        <div className="mb-8 flex items-end justify-between border-b border-white/5 pb-4">
          <h2 className="text-4xl font-bold gold-text">Guest Favourites</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.slice(0, 4).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wished={wishlist.includes(p.id)}
              onToggleWishlist={() => toggleWishlist(p.id)}
              onQuickView={() => setQuick(p)}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          ['Areeba, Lahore', 'The craftsmanship on the 22k set exceeded my expectations. A true heirloom piece.'],
          ['Hina, Karachi', 'Remarkable service and the purity certification gave me great peace of mind. Highly recommended.'],
          ['Maham, Islamabad', 'Found the perfect gift for my mother. The bridal collection is absolutely breathtaking.'],
        ].map(([name, quote]) => (
          <div key={name} className="glass rounded-[2rem] p-8 border border-white/5 bg-white/[0.015] hover:bg-white/[0.03] transition-all">
            <div className="flex gap-1 mb-4 text-[#d6b25e]">
              {[...Array(5)].map((_, i) => <Sparkles key={i} size={14} className="fill-current" />)}
            </div>
            <p className="text-lg text-white/90 font-medium mb-4 italic italic leading-relaxed">"{quote}"</p>
            <p className="text-sm font-bold uppercase tracking-widest text-[#d6b25e]">— {name}</p>
          </div>
        ))}
      </section>

      <section className="glass rounded-[2.5rem] p-10 md:p-16 border border-white/5 bg-white/[0.01]">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-5xl font-bold mb-4">Elite Newsletter</h2>
            <p className="text-xl text-white/40">Receive exclusive invites to new launch galas and private offers.</p>
          </div>
          <div className="flex w-full gap-3 md:w-auto">
            <input className="input min-w-[300px] h-14 bg-white/5 border-white/10 focus:border-[#d6b25e]/40" placeholder="your@email.com" />
            <button className="btn btn-gold h-14 px-8 text-lg">Subscribe</button>
          </div>
        </div>
      </section>

      <QuickViewModal product={quick} onClose={() => setQuick(null)} onAddToCart={addToCart} />
    </div>
  )
}

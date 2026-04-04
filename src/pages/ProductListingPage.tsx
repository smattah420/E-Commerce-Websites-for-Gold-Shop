import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { QuickViewModal } from '../components/QuickViewModal'
import { useStore } from '../store/StoreContext'
import { Loader2, PackageX, RefreshCw } from 'lucide-react'

type Purity = '18k' | '22k' | '24k'

export function ProductListingPage() {
  const [params, setParams] = useSearchParams()
  const { wishlist, toggleWishlist, addToCart, products, loading, error, refreshProducts } = useStore()
  const [quick, setQuick] = useState<any>(null)

  const selectedCategory = params.get('category') ?? 'All'
  const search = (params.get('q') ?? '').toLowerCase()
  const sort = params.get('sort') ?? 'featured'
  const purity = (params.get('purity') as Purity | null) ?? null

  const setParam = (key: string, value?: string) => {
    const next = new URLSearchParams(params)
    if (!value || value === 'All') next.delete(key)
    else next.set(key, value)
    setParams(next)
  }

  const filtered = useMemo(() => {
    let list = [...products]
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory)
    }
    if (purity) list = list.filter((p) => p.purity.includes(purity))
    if (search) list = list.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(search))

    if (sort === 'price-asc') list.sort((a, b) => a.pricePKR - b.pricePKR)
    if (sort === 'price-desc') list.sort((a, b) => b.pricePKR - a.pricePKR)
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    return list
  }, [products, selectedCategory, purity, search, sort])

  // Dynamic Price Range
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 0 }
    const prices = products.map(p => p.pricePKR)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    }
  }, [products])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#d6b25e]" />
          <p className="mt-4 text-white/60 tracking-widest uppercase">Fetching Collection...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center p-8 text-center glass rounded-3xl border border-red-500/10 bg-red-500/5">
        <div>
          <PackageX className="mx-auto h-16 w-16 text-red-400/40 mb-4" />
          <h2 className="text-2xl gold-text mb-2">Collection Unavailable</h2>
          <p className="text-white/40 mb-6">{error}</p>
          <button onClick={refreshProducts} className="btn !bg-red-500/10 hover:!bg-red-500/20 border border-red-500/20">
            <RefreshCw size={14} className="mr-2" /> Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight gold-text">Shop Gold Jewellery</h1>
          <p className="text-sm text-white/65">Curated pieces for modern premium fashion.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs uppercase tracking-[0.15em] text-white/55">Sort By</label>
          <select className="input py-2 bg-white/5" value={sort} onChange={(e) => setParam('sort', e.target.value)}>
            <option value="featured" className="bg-[#0f0f12]">Featured</option>
            <option value="price-asc" className="bg-[#0f0f12]">Price: Low to High</option>
            <option value="price-desc" className="bg-[#0f0f12]">Price: High to Low</option>
            <option value="rating" className="bg-[#0f0f12]">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="glass h-fit rounded-2xl p-6 border border-white/5">
          <h3 className="mb-6 text-xl gold-text font-bold">Filters</h3>
          <div className="space-y-8">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.15em] text-white/55 font-bold">Category</p>
              <div className="flex flex-wrap gap-2">
                {['All', 'Necklaces', 'Earrings', 'Rings', 'Bangles', 'Challa'].map((c) => (
                  <button
                    key={c}
                    className={`chip !px-4 !py-2 transition-all ${selectedCategory === c ? 'border-[#d6b25e]/60 bg-[#d6b25e]/10 text-[#f1dc9a] shadow-[0_0_15px_rgba(214,178,94,0.1)]' : 'hover:border-white/30'}`}
                    onClick={() => setParam('category', c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.15em] text-white/55 font-bold">Gold Purity</p>
              <div className="flex gap-2">
                {(['18k', '22k', '24k'] as Purity[]).map((p) => (
                  <button
                    key={p}
                    className={`chip !px-5 !py-2 transition-all ${purity === p ? 'border-[#d6b25e]/60 bg-[#d6b25e]/10 text-[#f1dc9a] shadow-[0_0_15px_rgba(214,178,94,0.1)]' : 'hover:border-white/30'}`}
                    onClick={() => setParam('purity', purity === p ? undefined : p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.15em] text-white/55 font-bold">Price Filter Range</p>
              <div className="text-sm font-medium text-[#f1dc9a]">
                PKR {priceRange.min.toLocaleString()} - PKR {priceRange.max.toLocaleString()}
              </div>
              <p className="text-[10px] text-white/30 mt-1 uppercase tracking-widest">Calculated from inventory</p>
            </div>
          </div>
        </aside>

        <section>
          <p className="mb-6 text-sm text-white/40 tracking-wide">
            Found <span className="text-white font-bold">{filtered.length} exclusive pieces</span> matching your taste
          </p>
          
          {filtered.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  wished={wishlist.includes(p.id)}
                  onToggleWishlist={() => toggleWishlist(p.id)}
                  onQuickView={() => setQuick(p)}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center glass rounded-[2.5rem] border border-white/5 bg-white/[0.01]">
              <PackageX className="mx-auto h-20 w-20 text-white/5 mb-6" />
              <h3 className="text-xl gold-text mb-2">No Matches Found</h3>
              <p className="text-white/40">Adjust your filters or explore a different category.</p>
            </div>
          )}
        </section>
      </div>

      <QuickViewModal product={quick} onClose={() => setQuick(null)} onAddToCart={addToCart} />
    </div>
  )
}

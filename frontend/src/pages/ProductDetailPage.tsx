import { Heart, Minus, Plus, Star, Loader2, ChevronLeft } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatPKR } from '../lib/format'
import { useStore } from '../store/StoreContext'
import { useNotification } from '../store/NotificationContext'

export function ProductDetailPage() {
  const { id } = useParams()
  const { products, loading, toggleWishlist, wishlist, addToCart } = useStore()
  const { showNotification } = useNotification()
  
  const product = useMemo(() => {
    return products.find(p => p.id === id)
  }, [id, products])

  const [imageIndex, setImageIndex] = useState(0)
  const [qty, setQty] = useState(1)
  const [purity, setPurity] = useState('22k')
  const [size, setSize] = useState('')
  const [zoomed, setZoomed] = useState(false)

  const showSize = useMemo(() => ['Rings', 'Bangles', 'Challa'].includes(product?.category ?? ''), [product])
  const sizes = useMemo(() => product?.category === 'Bangles' ? ['2.2', '2.4', '2.6', '2.8'] : ['10', '12', '14', '16', '18', '20'], [product])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#d6b25e]" />
          <p className="mt-4 text-white/60 tracking-widest uppercase text-sm">Loading Masterpiece...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="glass rounded-[2rem] p-12 text-center border border-white/5 bg-white/[0.02]">
        <h1 className="text-4xl font-bold gold-text mb-4">Masterpiece Not Found</h1>
        <p className="text-white/40 mb-8 max-w-md mx-auto">The artistic piece you are looking for may have been curated out or moved to our private collection.</p>
        <Link to="/products" className="btn btn-gold !px-8 !py-4">
          <ChevronLeft className="mr-2" size={18} /> Back to Boutique
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <section className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <div
            className="glass overflow-hidden rounded-[2.5rem] border border-white/10 relative group cursor-zoom-in"
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
          >
             <div className="absolute top-6 left-6 z-20">
              {product.badge && (
                <span className="px-4 py-2 rounded-full border border-[#d6b25e]/30 bg-[#d6b25e]/10 text-[#f1dc9a] text-xs font-bold uppercase tracking-widest">
                  {product.badge}
                </span>
              )}
            </div>
            <img
              src={product.images[imageIndex] || product.image}
              alt={product.name}
              className={`h-[600px] w-full object-cover transition duration-700 ease-out ${zoomed ? 'scale-110' : ''}`}
            />
          </div>
          <div className="flex gap-4 p-2 overflow-x-auto no-scrollbar">
            {product.images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                className={`flex-shrink-0 w-24 h-24 overflow-hidden rounded-2xl border-2 transition-all ${i === imageIndex ? 'border-[#d6b25e] shadow-[0_0_15px_rgba(214,178,94,0.3)]' : 'border-white/5 hover:border-white/20'}`}
                onClick={() => setImageIndex(i)}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-[2.5rem] p-10 border border-white/5 bg-white/[0.015] flex flex-col">
          <div className="mb-8">
            <p className="text-[#d6b25e] text-sm font-bold uppercase tracking-[0.2em] mb-2">{product.category}</p>
            <h1 className="text-5xl font-bold leading-tight mb-4">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm text-[#f1dc9a]">
                <Star size={16} className="fill-current" />
                <span className="font-bold text-white">{product.rating}</span>
                <span className="text-white/40">({product.reviewsCount} reviews)</span>
              </div>
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="text-xs text-white/50 uppercase tracking-widest font-bold">In Stock</div>
            </div>
          </div>

          <div className="mb-10 flex items-center gap-4">
            <p className="text-4xl font-bold gold-text">{formatPKR(product.pricePKR)}</p>
            {product.compareAtPKR ? (
              <p className="text-xl text-white/20 line-through decoration-white/40">{formatPKR(product.compareAtPKR)}</p>
            ) : null}
          </div>

          <div className="space-y-8 mb-10">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/40">Exquisite Gold Purity</p>
              <div className="flex flex-wrap gap-3">
                {product.purity.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPurity(p)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold border transition-all ${purity === p ? 'border-[#d6b25e] bg-[#d6b25e] text-black shadow-[0_0_15px_rgba(214,178,94,0.3)]' : 'border-white/10 hover:border-white/30 text-white/60'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {showSize && (
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/40">Perfect Size Fitting</p>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`min-w-[50px] px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${size === s ? 'border-[#f1dc9a] bg-[#f1dc9a]/10 text-[#f1dc9a]' : 'border-white/10 hover:border-white/30 text-white/60'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto pt-10 border-t border-white/5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 p-1">
                <button className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <Minus size={20} className="text-white/60" />
                </button>
                <span className="w-12 text-center text-lg font-bold">{qty}</span>
                <button className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors" onClick={() => setQty((q) => Math.min(10, q + 1))}>
                  <Plus size={20} className="text-white/60" />
                </button>
              </div>
              <button
                className="btn btn-gold flex-1 !h-14 text-lg shadow-[0_10px_30px_rgba(214,178,94,0.2)]"
                onClick={() => {
                  if (showSize && !size) {
                    showNotification('Please select a size', 'error')
                    return
                  }
                  addToCart(product.id, qty, purity, size)
                  showNotification('Added to Cart', 'success')
                }}
              >
                Add to Cart
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <Link className="btn !h-14 !bg-white/5 hover:!bg-white/10 border-white/10 text-lg" to="/checkout">
                Buy Now
              </Link>
              <button
                className={`btn !h-14 !bg-transparent border-white/10 hover:!bg-white/5 transition-all ${wishlist.includes(product.id) ? 'border-rose-400/30 text-rose-400 bg-rose-400/5' : 'text-white/60'}`}
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart size={20} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} className="mr-2" />
                {wishlist.includes(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>

          <div className="mt-10 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
            <p className="text-sm text-white/50 italic leading-relaxed">
              <span className="text-[#f1dc9a] font-bold not-italic mr-2">Artisan's Note:</span>
              {product.description}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <h2 className="text-4xl font-bold gold-text">Patron Reviews</h2>
          <div className="flex items-center gap-2 text-[#f1dc9a] bg-[#f1dc9a]/10 px-4 py-2 rounded-full border border-[#f1dc9a]/20">
            <Star size={18} className="fill-current" />
            <span className="font-bold text-lg">4.8 / 5.0</span>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="glass rounded-[2rem] p-8 border border-white/5 bg-white/[0.015] hover:bg-white/[0.03] transition-all flex flex-col h-full">
            <div className="flex gap-1 text-[#d6b25e] mb-4">
               {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-current" />)}
            </div>
            <p className="text-white/80 italic leading-relaxed mb-6 flex-grow">“The detailing is far more intricate than what my screen could capture. Truly worth every rupee.”</p>
            <div className="pt-4 border-t border-white/5">
              <p className="text-sm font-bold uppercase tracking-widest text-[#d6b25e]">— Sana A. from Lahore</p>
            </div>
          </div>

          <div className="glass rounded-[2rem] p-8 border border-white/5 bg-white/[0.015] hover:bg-white/[0.03] transition-all flex flex-col h-full">
            <div className="flex gap-1 text-[#d6b25e] mb-4">
               {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-current" />)}
            </div>
            <p className="text-white/80 italic leading-relaxed mb-6 flex-grow">“Fastest delivery I've ever experienced for high-value items. Al Majeed's white-glove service is unmatched.”</p>
            <div className="pt-4 border-t border-white/5">
              <p className="text-sm font-bold uppercase tracking-widest text-[#d6b25e]">— Mahnoor K. from Karachi</p>
            </div>
          </div>

          <div className="glass rounded-[2rem] p-8 border border-white/5 bg-white/[0.015] hover:bg-white/[0.03] transition-all flex flex-col h-full">
            <div className="flex gap-1 text-[#d6b25e] mb-4">
               {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-current" />)}
            </div>
            <p className="text-white/80 italic leading-relaxed mb-6 flex-grow">“The purity certification and the packaging were both top-notch. Will definitely be a returning customer.”</p>
            <div className="pt-4 border-t border-white/5">
              <p className="text-sm font-bold uppercase tracking-widest text-[#d6b25e]">— Areeba Q-  from  Islamabad</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

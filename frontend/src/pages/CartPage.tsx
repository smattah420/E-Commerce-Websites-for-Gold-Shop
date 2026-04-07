import { Link } from 'react-router-dom'
import { formatPKR } from '../lib/format'
import { useStore } from '../store/StoreContext'
import { ShoppingCart, Trash2, ArrowRight, Loader2 } from 'lucide-react'

export function CartPage() {
  const { cart, subtotal, removeFromCart, updateQty, products, loading } = useStore()
  const shipping = cart.length ? 2500 : 0
  const total = subtotal + shipping

  if (loading) {
     return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#d6b25e]" />
          <p className="mt-4 text-white/60 tracking-widest uppercase text-sm">Reviewing Selection...</p>
        </div>
      </div>
    )
  }

  if (!cart.length) {
    return (
      <div className="glass rounded-[2.5rem] p-12 text-center border border-white/5 bg-white/[0.02]">
        <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart size={32} className="text-white/20" />
        </div>
        <h1 className="text-4xl font-bold gold-text mb-4">Your Boutique Cart is Empty</h1>
        <p className="mt-2 text-white/40 max-w-md mx-auto">Select your favorite artistic pieces from our curated collection to continue.</p>
        <Link className="btn btn-gold mt-10 !px-10 !h-14 text-lg shadow-[0_10px_30px_rgba(214,178,94,0.2)]" to="/products">
          Start Shopping <ArrowRight size={18} className="ml-2" />
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <h1 className="text-5xl font-bold gold-text">Shopping Bag</h1>
          <p className="text-white/40 uppercase tracking-widest text-xs font-bold">{cart.length} Masterpieces</p>
        </div>
        
        <div className="space-y-4">
          {cart.map((item) => {
            const p = products.find((x) => x.id === item.productId)
            if (!p) return null
            return (
              <div key={`${item.productId}-${item.purity}-${item.size}`} className="glass grid gap-6 rounded-[2rem] p-6 border border-white/5 bg-white/[0.015] hover:bg-white/[0.03] transition-all sm:grid-cols-[140px_1fr_auto]">
                <div className="h-32 w-full rounded-2xl overflow-hidden border border-white/10">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="mb-1">
                    <p className="text-[#d6b25e] text-[10px] font-bold uppercase tracking-widest">{p.category}</p>
                    <p className="text-2xl font-bold text-white">{p.name}</p>
                  </div>
                  <div className="flex gap-4 mt-2">
                    {item.purity && (
                      <div className="flex flex-col">
                        <span className="text-[10px] text-white/30 uppercase tracking-widest">Purity</span>
                        <span className="text-xs font-bold text-[#f1dc9a]">{item.purity}</span>
                      </div>
                    )}
                    {item.size && (
                      <div className="flex flex-col">
                        <span className="text-[10px] text-white/30 uppercase tracking-widest">Size</span>
                        <span className="text-xs font-bold text-[#f1dc9a]">{item.size}</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-4 text-xl font-bold gold-text">{formatPKR(p.pricePKR)}</p>
                </div>
                <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:justify-center">
                   <div className="flex flex-col items-end">
                    <span className="text-[10px] text-white/30 uppercase tracking-widest mb-1 mr-2">Quantity</span>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={item.qty}
                      onChange={(e) => updateQty(item.productId, Number(e.target.value), item.purity, item.size)}
                      className="input w-24 h-12 bg-white/5 border-white/10 text-center font-bold"
                    />
                  </div>
                  <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-400/60 hover:text-rose-400 transition-colors" onClick={() => removeFromCart(item.productId, item.purity, item.size)}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <aside className="space-y-6">
        <div className="glass h-fit rounded-[2.5rem] p-8 border border-white/5 bg-white/[0.02]">
          <h2 className="text-3xl font-bold gold-text mb-8">Order Summary</h2>
          <div className="space-y-6 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-white/40 font-medium uppercase tracking-widest">Subtotal</span>
              <span className="text-xl font-bold text-white">{formatPKR(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40 font-medium uppercase tracking-widest">Premium Shipping</span>
              <span className="text-lg font-bold text-white">{formatPKR(shipping)}</span>
            </div>
            <div className="h-[1px] bg-white/5 w-full my-4" />
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold gold-text uppercase tracking-widest">Total</span>
              <span className="text-3xl font-bold text-white">{formatPKR(total)}</span>
            </div>
          </div>
          <Link className="btn btn-gold mt-10 w-full !h-16 text-xl shadow-[0_10px_30px_rgba(214,178,94,0.3)]" to="/checkout">
            Check Out Now
          </Link>
          <p className="text-[10px] text-center text-white/30 mt-6 uppercase tracking-widest leading-relaxed">
            Complimentary white-glove delivery included for orders above PKR 500,000.
          </p>
        </div>
        
        <div className="glass rounded-2xl p-6 border border-white/5 bg-[#d6b25e]/5">
           <p className="text-xs text-[#f1dc9a] leading-relaxed">
             <span className="font-bold">Secured Transaction:</span> All our physical shipments are fully insured and require high-security authentication upon delivery.
           </p>
        </div>
      </aside>
    </div>
  )
}

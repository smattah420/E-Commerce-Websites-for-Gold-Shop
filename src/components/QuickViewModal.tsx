import { X, Star, ShoppingBag } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { type Product } from '../lib/catalog'
import { formatPKR } from '../lib/format'
import { Link } from 'react-router-dom'

type Props = {
  product: Product | null
  onClose: () => void
  onAddToCart: (id: string) => void
}

export function QuickViewModal({ product, onClose, onAddToCart }: Props) {
  return (
    <AnimatePresence>
      {product ? (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="glass w-full max-w-3xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2">
              <img src={product.image} alt={product.name} className="h-72 w-full object-cover md:h-full" />
              <div className="p-5">
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-2xl">{product.name}</h3>
                  <button className="rounded-full p-1.5 hover:bg-white/10" onClick={onClose}>
                    <X size={18} />
                  </button>
                </div>
                <p className="mb-2 text-xl font-semibold text-white/95">{formatPKR(product.pricePKR)}</p>
                <p className="mb-4 flex items-center gap-1 text-sm text-white/70">
                  <Star size={14} className="text-lux-gold2" fill="currentColor" />
                  {product.rating} ({product.reviewsCount} reviews)
                </p>
                <p className="text-sm text-white/70">{product.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {product.purity.map((p) => (
                    <span key={p} className="chip text-white/85">
                      {p}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex gap-2">
                  <button className="btn btn-gold" onClick={() => onAddToCart(product.id)}>
                    <ShoppingBag size={16} /> Add to Cart
                  </button>
                  <Link className="btn" to={`/product/${product.id}`} onClick={onClose}>
                    Open Product
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}


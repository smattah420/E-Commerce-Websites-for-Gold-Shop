import { Heart, Eye, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { type Product } from '../lib/catalog'
import { formatPKR } from '../lib/format'
import { cn } from '../lib/cn'

type Props = {
  product: Product
  wished: boolean
  onToggleWishlist: () => void
  onQuickView: () => void
}

export function ProductCard({
  product,
  wished,
  onToggleWishlist,
  onQuickView,
}: Props) {
  const discount = product.compareAtPKR
    ? Math.round(((product.compareAtPKR - product.pricePKR) / product.compareAtPKR) * 100)
    : 0

  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      className="group glass relative overflow-hidden rounded-2xl"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
        {product.badge ? (
          <span className="absolute left-3 top-3 chip border-lux-gold/40 text-white/90">
            {product.badge}
          </span>
        ) : null}
        <button
          className={cn(
            'absolute right-3 top-3 rounded-full border p-2 transition',
            wished
              ? 'border-rose-300/70 bg-rose-400/20 text-rose-200'
              : 'border-white/20 bg-black/35 text-white/80 hover:border-lux-gold/60',
          )}
          onClick={onToggleWishlist}
        >
          <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-white/55">{product.category}</p>
            <h3 className="text-xl">{product.name}</h3>
          </div>
          <button
            className="rounded-full border border-white/20 bg-white/5 p-2 text-white/70 hover:text-white/95"
            onClick={onQuickView}
            title="Quick view"
          >
            <Eye size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-white/95">{formatPKR(product.pricePKR)}</p>
            {product.compareAtPKR ? (
              <p className="text-xs text-white/50 line-through">
                {formatPKR(product.compareAtPKR)}
              </p>
            ) : null}
          </div>
          {discount > 0 ? <span className="chip text-lux-gold2">{discount}% OFF</span> : null}
        </div>

        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1 text-sm text-white/75">
            <Star size={14} className="text-lux-gold2" fill="currentColor" />
            {product.rating} ({product.reviewsCount})
          </p>
          <Link className="btn btn-gold text-xs" to={`/product/${product.id}`}>
            View Details
          </Link>
        </div>
      </div>
    </motion.article>
  )
}


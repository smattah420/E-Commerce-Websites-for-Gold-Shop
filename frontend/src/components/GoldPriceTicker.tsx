import { formatPKR } from '../lib/format'
import { useGoldPrice } from '../store/GoldPriceContext'

type Props = {
  compact?: boolean
}

export function GoldPriceTicker({ compact }: Props) {
  const { pkrPerTola, pkrPerGram, deltaPerTola } = useGoldPrice()
  const sign = deltaPerTola === 0 ? '' : deltaPerTola > 0 ? '+' : '−'

  return (
    <div
      className={[
        'chip',
        'backdrop-blur',
        compact ? 'px-2.5 py-1' : 'px-3 py-1.5',
      ].join(' ')}
      title="Live indicator (concept)"
    >
      <span className="text-[11px] uppercase tracking-[0.18em] text-white/60">
        Gold live
      </span>
      <span className="hidden sm:inline text-white/80">•</span>
      <span className="text-white/90">{formatPKR(Math.round(pkrPerTola))}</span>
      <span className="hidden md:inline text-white/50">
        /tola ({formatPKR(Math.round(pkrPerGram))}/g)
      </span>
      <span
        className={
          deltaPerTola === 0
            ? 'text-white/50'
            : deltaPerTola > 0
              ? 'text-lux-gold2'
              : 'text-rose-300'
        }
      >
        {deltaPerTola === 0 ? '—' : `${sign}${formatPKR(Math.abs(deltaPerTola))}`}
      </span>
    </div>
  )
}


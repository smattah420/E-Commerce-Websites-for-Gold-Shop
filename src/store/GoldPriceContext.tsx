import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type GoldPriceContextValue = {
  pkrPerTola: number
  pkrPerGram: number
  deltaPerTola: number
  updatedAt: string | null
  status: 'idle' | 'loading' | 'ok' | 'offline' | 'error'
}

const GoldPriceContext = createContext<GoldPriceContextValue | null>(null)

const LS_KEY = 'almajeed_gold_pkr_per_tola'
const DEFAULT_PKR_PER_TOLA = 464_639

export function GoldPriceProvider({ children }: { children: ReactNode }) {
  const prevRef = useRef<number | null>(null)

  const [pkrPerTola, setPkrPerTola] = useState(() => {
    if (typeof window === 'undefined') return 0
    const v = window.localStorage.getItem(LS_KEY)
    if (!v) return DEFAULT_PKR_PER_TOLA
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  })
  const [pkrPerGram, setPkrPerGram] = useState(() => DEFAULT_PKR_PER_TOLA / 11.664)
  const [deltaPerTola, setDeltaPerTola] = useState(0)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [status, setStatus] = useState<GoldPriceContextValue['status']>('idle')

  const value = useMemo(
    () => ({ pkrPerTola, pkrPerGram, deltaPerTola, updatedAt, status }),
    [pkrPerTola, pkrPerGram, deltaPerTola, updatedAt, status],
  )

  useEffect(() => {
    let alive = true
    const fetchGold = async () => {
      setStatus((s) => (s === 'ok' ? 'loading' : 'loading'))
      try {
        const resp = await fetch('/api/gold-rate', { cache: 'no-store' })
        if (!resp.ok) throw new Error('Gold rate fetch failed')
        const data = (await resp.json()) as {
          pkrPerTola: number
          pkrPerGram: number
          updatedAt: string
        }
        if (!alive) return

        const prev = prevRef.current ?? (pkrPerTola || null)
        prevRef.current = data.pkrPerTola

        setPkrPerTola(data.pkrPerTola)
        setPkrPerGram(data.pkrPerGram)
        setDeltaPerTola(prev == null ? 0 : Math.round(data.pkrPerTola - prev))
        setUpdatedAt(data.updatedAt)

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(LS_KEY, String(data.pkrPerTola))
        }
        setStatus('ok')
      } catch {
        if (!alive) return
        setStatus('offline')
      }
    }

    // Initialize previous to the current value so first delta is not noisy.
    prevRef.current = pkrPerTola || null
    void fetchGold()

    const id = window.setInterval(() => {
      void fetchGold()
    }, 15000)

    return () => {
      alive = false
      window.clearInterval(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <GoldPriceContext.Provider value={value}>{children}</GoldPriceContext.Provider>
}

export function useGoldPrice() {
  const ctx = useContext(GoldPriceContext)
  if (!ctx) throw new Error('useGoldPrice must be used inside GoldPriceProvider')
  return ctx
}


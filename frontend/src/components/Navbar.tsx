import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Heart, Search, ShoppingBag, LogIn, LogOut, ShieldCheck, Package } from 'lucide-react'
import { useMemo, useState, useRef, useEffect } from 'react'
import { Logo } from './Logo'
import { GoldPriceTicker } from './GoldPriceTicker'
import { useStore } from '../store/StoreContext'
import { useAuth } from '../store/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop' },
  { to: '/products?category=Necklaces', label: 'Necklaces' },
  { to: '/products?category=Rings', label: 'Rings' },
]

export function Navbar() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { wishlist, itemCount } = useStore()
  const { userInfo, logout } = useAuth()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const onSearch = () => {
    const query = q.trim()
    if (!query) return
    navigate(`/products?q=${encodeURIComponent(query)}`)
  }

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/home')
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeClass =
    'text-white/95 border-lux-gold/60 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]'

  const linkClass = useMemo(
    () =>
      [
        'rounded-full px-3 py-1.5 text-sm transition',
        'border border-transparent',
        'text-white/70 hover:text-white/90 hover:bg-white/5',
      ].join(' '),
    [],
  )

  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-[#07070a]/70 backdrop-blur-xl">
      <div className="container-lux flex items-center gap-3 py-3">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ''}`
              }
              end={it.to === '/'}
            >
              {it.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden xl:block">
          <GoldPriceTicker compact />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <Search size={16} className="text-white/60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => (e.key === 'Enter' ? onSearch() : undefined)}
              placeholder="Search gold jewellery…"
              className="w-44 bg-transparent text-sm text-white/90 placeholder:text-white/40 outline-none"
            />
            <button
              className="text-xs text-white/70 hover:text-white/90"
              onClick={onSearch}
            >
              Go
            </button>
          </div>

          <Link
            to="/wishlist"
            className="btn relative rounded-2xl px-3 py-2"
            aria-label="Wishlist"
          >
            <Heart size={18} className="text-white/80" />
            {wishlist.length ? (
              <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-lux-gold text-[10px] text-black">
                {wishlist.length}
              </span>
            ) : null}
          </Link>

          <Link
            to="/cart"
            className="btn btn-gold relative rounded-2xl px-3 py-2"
            aria-label="Cart"
          >
            <ShoppingBag size={18} className="text-white/90" />
            {itemCount ? (
              <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-white text-[10px] text-black">
                {itemCount}
              </span>
            ) : null}
          </Link>

          {/* Auth button */}
          {userInfo ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="btn rounded-2xl px-3 py-2 flex items-center gap-2"
                aria-label="Account"
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#f1dc9a]/60 to-[#d6b25e]/40 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-black">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:block text-sm text-white/80 max-w-[80px] truncate">
                  {userInfo.name.split(' ')[0]}
                </span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-52 glass rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-50"
                  >
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-semibold text-white/90 truncate">{userInfo.name}</p>
                      <p className="text-xs text-white/40 truncate">{userInfo.email}</p>
                    </div>
                    <div className="p-2 border-b border-white/5">
                      {userInfo.isAdmin && (
                        <>
                          <Link
                            to="/admin/users"
                            onClick={() => setDropdownOpen(false)}
                            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#f1dc9a] hover:bg-[#d6b25e]/10 transition-colors"
                          >
                            <ShieldCheck size={15} />
                            User Management
                          </Link>
                          <Link
                            to="/admin/products"
                            onClick={() => setDropdownOpen(false)}
                            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#f1dc9a] hover:bg-[#d6b25e]/10 transition-colors"
                          >
                            <Package size={15} />
                            Product Management
                          </Link>
                        </>
                      )}
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-gold rounded-2xl px-4 py-2 flex items-center gap-2"
            >
              <LogIn size={16} className="text-white/90" />
              <span className="hidden sm:block text-sm">Login</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

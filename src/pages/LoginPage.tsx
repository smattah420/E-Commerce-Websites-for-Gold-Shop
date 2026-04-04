import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '../store/AuthContext'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/home'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      // Error is handled by context
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass w-full max-w-md overflow-hidden rounded-3xl p-8 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f1dc9a]/20 to-[#d6b25e]/10 border border-[#d6b25e]/30">
            <LogIn className="h-8 w-8 text-[#f1dc9a]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight gold-text">Welcome Back</h1>
          <p className="mt-2 text-sm text-white/60">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/80 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 group-focus-within:text-[#d6b25e] transition-colors" />
              <input
                type="email"
                required
                className="input pl-11 h-12"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-medium text-white/80">Password</label>
              <a href="#" className="text-xs text-[#d6b25e] hover:text-[#f1dc9a] transition-colors">
                Forgot?
              </a>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 group-focus-within:text-[#d6b25e] transition-colors" />
              <input
                type="password"
                required
                className="input pl-11 h-12"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-gold w-full h-12 text-base group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </span>
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-white/50">
          Not a member?{' '}
          <Link to="/signup" className="font-medium text-[#d6b25e] hover:text-[#f1dc9a] transition-colors">
            Create an account
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

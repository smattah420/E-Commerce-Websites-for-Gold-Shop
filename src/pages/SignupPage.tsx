import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, Mail, Lock, User, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../store/AuthContext'

export function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  
  const { signup, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters')
      return
    }

    try {
      await signup(name, email, password)
      navigate('/home')
    } catch (err) {
      // Error is handled by context
    }
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass w-full max-w-lg overflow-hidden rounded-[2.5rem] p-10 shadow-2xl relative"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <UserPlus className="h-40 w-40 text-[#f1dc9a]" />
        </div>

        <div className="mb-10 text-center relative z-10">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#f1dc9a]/25 to-[#d6b25e]/10 border border-[#d6b25e]/40 shadow-inner">
            <UserPlus className="h-10 w-10 text-[#f1dc9a]" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight gold-text">Create Account</h1>
          <p className="mt-3 text-white/50 text-sm max-w-xs mx-auto">Join our exclusive community of luxury enthusiasts</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {(error || localError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{localError || error}</span>
            </motion.div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 group-focus-within:text-[#d6b25e] transition-colors" />
                <input
                  type="text"
                  required
                  className="input pl-12 h-14 bg-white/[0.03]"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 group-focus-within:text-[#d6b25e] transition-colors" />
                <input
                  type="email"
                  required
                  className="input pl-12 h-14 bg-white/[0.03]"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 group-focus-within:text-[#d6b25e] transition-colors" />
                <input
                  type="password"
                  required
                  className="input pl-12 h-14 bg-white/[0.03]"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Confirm</label>
              <div className="relative group">
                <CheckCircle2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 group-focus-within:text-[#d6b25e] transition-colors" />
                <input
                  type="password"
                  required
                  className="input pl-12 h-14 bg-white/[0.03]"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-gold w-full h-14 text-lg font-bold group mt-4 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {loading ? 'Creating Account...' : 'Get Started'}
              {!loading && <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />}
            </span>
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center relative z-10">
          <p className="text-sm text-white/40">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#d6b25e] hover:text-[#f1dc9a] transition-all underline underline-offset-4 decoration-[#d6b25e]/30">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Trash2, 
  ShieldCheck, 
  Search, 
  Loader2, 
  UserX,
  AlertTriangle,
  Mail,
  Calendar,
  ShieldAlert
} from 'lucide-react'
import { useAuth } from '../store/AuthContext'
import { useNotification } from '../store/NotificationContext'

type UserData = {
  _id: string
  name: string
  email: string
  isAdmin: boolean
  createdAt: string
}

export function AdminUserPage() {
  const { showNotification } = useNotification()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { userInfo } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/home')
      return
    }

    fetchUsers()
  }, [userInfo, navigate])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      }
      const { data } = await axios.get('http://localhost:5000/api/users', config)
      setUsers(data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const deleteHandler = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
        await axios.delete(`http://localhost:5000/api/users/${id}`, config)
        setUsers(users.filter((u) => u._id !== id))
        showNotification(`User "${name}" deleted successfully.`, 'success')
      } catch (err: any) {
        showNotification(err.response?.data?.message || 'Failed to delete user', 'error')
      }
    }
  }

  const promoteHandler = async (id: string) => {
    if (window.confirm('Make this user an Admin?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
        await axios.put(`http://localhost:5000/api/users/${id}/admin`, {}, config)
        fetchUsers()
        showNotification('User promoted to Admin status.', 'success')
      } catch (err: any) {
        showNotification(err.response?.data?.message || 'Failed to promote user', 'error')
      }
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading && users.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#d6b25e]" />
          <p className="mt-4 text-white/60">Loading user database...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-lux py-12">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d6b25e]/10 border border-[#d6b25e]/30">
              <Users className="h-6 w-6 text-[#d6b25e]" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight gold-text">User Management</h1>
          </div>
          <p className="text-white/60 max-w-xl">
            Monitor and manage registered members of your luxury boutique. 
            Promote trusted staff to administrative roles or manage access.
          </p>
        </div>

        <div className="relative group min-w-[300px]">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 group-focus-within:text-[#d6b25e] transition-colors" />
          <input
            className="input pl-12 h-12 bg-white/[0.03]"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-6 flex items-center gap-4 text-red-400"
          >
            <ShieldAlert className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-bold">Access Error</h3>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-white/40">Registered User</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-white/40">Contact Info</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-white/40">Status</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-white/40 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={user._id} 
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#f1dc9a]/40 to-[#d6b25e]/20 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform">
                          <span className="text-sm font-bold text-[#f1dc9a]">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-white/90">{user.name}</p>
                          <div className="flex items-center gap-1.5 text-xs text-white/40 mt-1">
                            <Calendar size={12} />
                            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Mail size={14} className="text-[#d6b25e]/60" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {user.isAdmin ? (
                        <div className="chip !bg-[#d6b25e]/10 !border-[#d6b25e]/30 !text-[#f1dc9a]">
                          <ShieldCheck size={14} />
                          <span>Administrator</span>
                        </div>
                      ) : (
                        <div className="chip !bg-white/5 !border-white/10 !text-white/60">
                          <span>Verified Store Member</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!user.isAdmin && (
                          <button
                            onClick={() => promoteHandler(user._id)}
                            className="btn !bg-transparent hover:!bg-[#d6b25e]/10 !border-white/10 hover:!border-[#d6b25e]/30 !p-2 transition-all active:scale-95"
                            title="Promote to Admin"
                          >
                            <ShieldCheck className="h-4 w-4 text-[#d6b25e]" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteHandler(user._id, user.name)}
                          disabled={user.isAdmin}
                          className={`btn !bg-transparent !p-2 transition-all active:scale-95 ${
                            user.isAdmin 
                              ? 'opacity-20 cursor-not-allowed grayscale' 
                              : 'hover:!bg-red-500/10 !border-white/10 hover:!border-red-500/30 text-white/40 hover:text-red-400'
                          }`}
                          title="Remove User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <UserX className="mx-auto h-12 w-12 text-white/10 mb-4" />
                    <p className="text-white/30 text-lg">No users found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 flex items-center gap-4 rounded-2xl border border-[#d6b25e]/20 bg-[#d6b25e]/5 p-4 text-[#f1dc9a]/80 text-sm">
        <AlertTriangle className="h-5 w-5 shrink-0" />
        <p>
          <strong>Premium Dashboard Protection:</strong> All actions here are logged and strictly limited to high-privilege accounts.
          Removing users will permanently revoke their access to store features.
        </p>
      </div>
    </div>
  )
}

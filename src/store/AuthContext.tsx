import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import axios from 'axios'

type UserInfo = {
  _id: string
  name: string
  email: string
  isAdmin: boolean
  token: string
}

type AuthContextValue = {
  userInfo: UserInfo | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    const saved = localStorage.getItem('amj-userInfo')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userInfo) {
      localStorage.setItem('amj-userInfo', JSON.stringify(userInfo))
    } else {
      localStorage.removeItem('amj-userInfo')
    }
  }, [userInfo])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password })
      setUserInfo(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.post('http://localhost:5000/api/users', { name, email, password })
      setUserInfo(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUserInfo(null)
  }

  return (
    <AuthContext.Provider value={{ userInfo, login, signup, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

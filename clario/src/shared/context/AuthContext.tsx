import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
/*eslint-disable react-refresh/only-export-components*/

const API_URL = 'http://localhost:3001'

export interface User {
  id: number
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
}

export interface RegisterPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
}

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  register: (payload: RegisterPayload) => Promise<User>
  login: (email: string, password: string) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('clario_user')
    if (stored) {
      try {
        const parsed: User = JSON.parse(stored)
        setUser(parsed)
      } catch {
        localStorage.removeItem('clario_user')
      }
    }
  }, [])

  const isAuthenticated = !!user

  async function register(payload: RegisterPayload): Promise<User> {
    setLoading(true)
    setError(null)
    try {
      const email = payload.email
      const resCheck = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`)
      if (!resCheck.ok) {
        throw new Error('Помилка під час реєстрації')
      }
      const existing: User[] = await resCheck.json()
      if (existing.length > 0) {
        throw new Error('Користувач з таким email вже існує')
      }

      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        throw new Error('Помилка під час реєстрації')
      }
      const newUser: User = await res.json()
      setUser(newUser)
      localStorage.setItem('clario_user', JSON.stringify(newUser))
      return newUser
    } catch (e) {
      const err = e as Error
      setError(err.message || 'Сталася помилка')
      throw e
    } finally {
      setLoading(false)
    }
  }

  async function login(email: string, password: string): Promise<User> {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `${API_URL}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      )
      if (!res.ok) {
        throw new Error('Помилка під час входу')
      }
      const data: User[] = await res.json()
      if (data.length === 0) {
        throw new Error('Невірний email або пароль')
      }
      const loggedInUser = data[0]
      setUser(loggedInUser)
      localStorage.setItem('clario_user', JSON.stringify(loggedInUser))
      return loggedInUser
    } catch (e) {
      const err = e as Error
      setError(err.message || 'Сталася помилка')
      throw e
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('clario_user')
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth має використовуватись всередині AuthProvider')
  }
  return ctx
}

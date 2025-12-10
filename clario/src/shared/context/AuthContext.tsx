import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { AxiosError } from 'axios'
import { clearToken, getTokenKey, getUnauthorizedEventName, persistToken } from '@/api/axios'
import {
  login as loginRequest,
  register as registerRequest,
  fetchProfile,
} from '@/services/auth.api'
import type { AuthUser, RegisterPayload } from '@/services/auth.api'
/*eslint-disable react-refresh/only-export-components*/

const USER_STORAGE_KEY = 'clario_user'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  register: (payload: RegisterPayload) => Promise<AuthUser>
  login: (email: string, password: string) => Promise<AuthUser>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const persistUser = useCallback((next: AuthUser | null) => {
    if (typeof window === 'undefined') return
    if (!next) {
      window.localStorage.removeItem(USER_STORAGE_KEY)
      return
    }
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(next))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setError(null)
    persistUser(null)
    clearToken()
  }, [persistUser])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem(USER_STORAGE_KEY)
    if (stored) {
      try {
        const parsed: AuthUser = JSON.parse(stored)
        setUser(parsed)
      } catch {
        window.localStorage.removeItem(USER_STORAGE_KEY)
      }
    }

    const token = window.localStorage.getItem(getTokenKey())
    if (!token) {
      return
    }

    fetchProfile()
      .then((profile) => {
        setUser(profile)
        persistUser(profile)
      })
      .catch(() => {
        logout()
      })
  }, [logout, persistUser])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const eventName = getUnauthorizedEventName()
    function handleUnauthorized() {
      logout()
    }
    window.addEventListener(eventName, handleUnauthorized)
    return () => {
      window.removeEventListener(eventName, handleUnauthorized)
    }
  }, [logout])

  const isAuthenticated = !!user

  function extractErrorMessage(err: unknown): string {
    if (typeof err === 'string') return err
    if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
      return err.message
    }
    const axiosErr = err as AxiosError<{ message?: string }>
    return axiosErr.response?.data?.message ?? 'Сталася помилка'
  }

  async function register(payload: RegisterPayload): Promise<AuthUser> {
    setLoading(true)
    setError(null)
    try {
      const { user: nextUser, token } = await registerRequest(payload)
      persistToken(token)
      setUser(nextUser)
      persistUser(nextUser)
      return nextUser
    } catch (e) {
      const message = extractErrorMessage(e)
      setError(message)
      throw e
    } finally {
      setLoading(false)
    }
  }

  async function login(email: string, password: string): Promise<AuthUser> {
    setLoading(true)
    setError(null)
    try {
      const { user: nextUser, token } = await loginRequest({ email, password })
      persistToken(token)
      setUser(nextUser)
      persistUser(nextUser)
      return nextUser
    } catch (e) {
      const message = extractErrorMessage(e)
      setError(message)
      throw e
    } finally {
      setLoading(false)
    }
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

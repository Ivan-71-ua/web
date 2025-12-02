import axios from 'axios'

const DEFAULT_BASE_URL = 'http://localhost:3001'
const TOKEN_STORAGE_KEY = 'clario_token'
const UNAUTHORIZED_EVENT = 'clario:unauthorized'

type MaybeToken = string | null | undefined

function getBaseUrl() {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  if (typeof process !== 'undefined' && process.env?.VITE_API_URL) {
    return process.env.VITE_API_URL as string | undefined
  }
  return DEFAULT_BASE_URL
}

function readToken(): MaybeToken {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

export function persistToken(token: MaybeToken) {
  if (typeof window === 'undefined') return
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
    } else {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  } catch {
    return
  }
}

export function clearToken() {
  persistToken(null)
}

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
})

api.interceptors.request.use(
  (config) => {
    const token = readToken()
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401 || status === 403) {
      clearToken()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
      }
    }
    return Promise.reject(error)
  },
)

export function getUnauthorizedEventName() {
  return UNAUTHORIZED_EVENT
}

export function getTokenKey() {
  return TOKEN_STORAGE_KEY
}

export default api

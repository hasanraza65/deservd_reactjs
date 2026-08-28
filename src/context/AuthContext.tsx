import { createContext, use, useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { authApi, type LoginPayload, type RegisterPayload } from '@/api/auth'
import { getStoredToken, setStoredToken } from '@/lib/api'
import type { ApiUser } from '@/types/api'

/**
 * One auth context for both the storefront and the React admin panel — both
 * are just `users` rows distinguished by `role`, exactly as the API models
 * them. `isAdmin` is what the admin route guard checks; nothing else about
 * the login flow differs between a customer and an admin.
 */

type AuthContextValue = {
  user: ApiUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (payload: LoginPayload) => Promise<ApiUser>
  register: (payload: RegisterPayload) => Promise<ApiUser>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!getStoredToken()) {
      setUser(null)
      setIsLoading(false)
      return
    }
    try {
      const me = await authApi.me()
      setUser(me)
    } catch {
      setStoredToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const login = useCallback(async (payload: LoginPayload) => {
    const { user: loggedInUser, token } = await authApi.login(payload)
    setStoredToken(token)
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    const { user: newUser, token } = await authApi.register(payload)
    setStoredToken(token)
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // Token might already be dead server-side — clear local state regardless.
    }
    setStoredToken(null)
    setUser(null)
  }, [])

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    refresh,
  }

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuth(): AuthContextValue {
  const context = use(AuthContext)
  if (!context) throw new Error('useAuth must be used inside an AuthProvider')
  return context
}

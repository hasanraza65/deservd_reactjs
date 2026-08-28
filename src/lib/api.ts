import axios, { AxiosError } from 'axios'
import type { AxiosInstance } from 'axios'

/**
 * Every Laravel response follows the same envelope (see the backend's
 * app/Exceptions/Handler.php and Http/Controllers/Concerns/ApiResponses.php):
 *   { success: true,  message: string, data: T }
 *   { success: false, message: string, errors: Record<string, string[]> }
 */
export type ApiSuccess<T> = { success: true; message: string; data: T }
export type ApiFailure = { success: false; message: string; errors: Record<string, string[]> }

export type Paginated<T> = {
  items: T[]
  pagination: { current_page: number; last_page: number; total: number; per_page?: number }
}

const TOKEN_KEY = 'deservd.auth.token'

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Storage unavailable (private mode) — auth just won't persist across reloads.
  }
}

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api/v1',
  headers: { Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/**
 * A 401 means the stored token is dead (expired, revoked, or never valid).
 * Clearing it here — once, centrally — means every call site can just await
 * a request and let the AuthContext's next render reflect "logged out"
 * instead of each hook duplicating this check.
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      setStoredToken(null)
    }
    return Promise.reject(error)
  },
)

/** Unwraps {success, message, data} and throws a plain Error with the backend's message on failure. */
export async function unwrap<T>(promise: Promise<{ data: ApiSuccess<T> | ApiFailure }>): Promise<T> {
  try {
    const response = await promise
    if (response.data.success) return response.data.data
    throw new ApiError(response.data.message, {})
  } catch (err) {
    throw toApiError(err)
  }
}

export class ApiError extends Error {
  errors: Record<string, string[]>

  constructor(message: string, errors: Record<string, string[]>) {
    super(message)
    this.name = 'ApiError'
    this.errors = errors
  }

  /** First validation message for a field, if any — handy for inline form errors. */
  fieldError(field: string): string | undefined {
    return this.errors[field]?.[0]
  }
}

function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err

  if (axios.isAxiosError(err)) {
    const payload = err.response?.data as ApiFailure | undefined
    const message = payload?.message ?? err.message ?? 'Something went wrong. Please try again.'
    return new ApiError(message, payload?.errors ?? {})
  }

  return new ApiError(err instanceof Error ? err.message : 'Something went wrong. Please try again.', {})
}

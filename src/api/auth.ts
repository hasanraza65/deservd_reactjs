import { api, unwrap } from '@/lib/api'
import type { ApiUser } from '@/types/api'

export type LoginPayload = { email: string; password: string }
export type RegisterPayload = {
  first_name: string
  last_name: string
  email: string
  phone?: string
  password: string
  password_confirmation: string
}
export type AuthResponse = { user: ApiUser; token: string }

export const authApi = {
  login: (payload: LoginPayload) => unwrap<AuthResponse>(api.post('/auth/login', payload)),
  register: (payload: RegisterPayload) => unwrap<AuthResponse>(api.post('/auth/register', payload)),
  logout: () => unwrap<null>(api.post('/auth/logout')),
  me: () => unwrap<ApiUser>(api.get('/auth/me')),
}

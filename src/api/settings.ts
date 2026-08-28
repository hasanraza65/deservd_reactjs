import { api, unwrap } from '@/lib/api'

/** The public subset of store settings — see Api\V1\SettingController on the backend. */
export type PublicSettings = {
  store_name: string
  store_email: string
  store_phone_primary: string
  store_phone_secondary: string
  currency: string
  free_shipping_threshold_cents: number
  local_pickup_enabled: boolean
  store_open: boolean
}

export const settingsApi = {
  get: () => unwrap<PublicSettings>(api.get('/settings')),
}

import { api, unwrap } from '@/lib/api'
import type { AppSettings } from '@/types/api'

export const adminSettingsApi = {
  get: () => unwrap<AppSettings>(api.get('/admin/settings')),
  update: (values: Partial<AppSettings>) => unwrap<AppSettings>(api.put('/admin/settings', values)),
}

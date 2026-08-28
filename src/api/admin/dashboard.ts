import { api, unwrap } from '@/lib/api'
import type { DashboardData } from '@/types/api'

export type DashboardRangeParams = { range?: string; from?: string; to?: string }

export const adminDashboardApi = {
  get: (params?: DashboardRangeParams) => unwrap<DashboardData>(api.get('/admin/dashboard', { params })),
}

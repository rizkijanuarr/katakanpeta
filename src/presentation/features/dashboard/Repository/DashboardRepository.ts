import { networkModule } from '@/core/network/NetworkModule'
import { AppRoutes } from '@/core/common/AppRoutes'

export interface DashboardSubscription {
  status: string | null
  start_date: string | null
  end_date: string | null
  days_remaining: number | null
}

export interface DashboardScrape {
  id: string
  query: string
  createddate: string
  result_count: number
}

export interface UserDashboardResponse {
  success: boolean
  message: string
  data: {
    subscription: DashboardSubscription
    total_scrapes: number
    recent_scrapes: DashboardScrape[]
  }
}

export interface AdminDashboardStats {
  total_users: number
  total_transactions: number
  pending_approvals: number
  active_subscriptions: number
  total_scrapes: number
  recent_transactions: any[]
  recent_users: any[]
}

export interface AdminDashboardResponse {
  success: boolean
  message: string
  data: AdminDashboardStats
}

export const DashboardRepository = {
  getUserDashboard: async (): Promise<UserDashboardResponse> => {
    return await networkModule.request<UserDashboardResponse>(AppRoutes.DASHBOARD.USER, {
      method: 'GET',
      requiresAuth: true,
    })
  },

  getAdminDashboard: async (): Promise<AdminDashboardResponse> => {
    return await networkModule.request<AdminDashboardResponse>(AppRoutes.DASHBOARD.ADMIN, {
      method: 'GET',
      requiresAuth: true,
    })
  },
}

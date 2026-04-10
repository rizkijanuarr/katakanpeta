import { networkModule } from '@/core/network/NetworkModule'
import { AppRoutes } from '@/core/common/AppRoutes'

export interface Subscription {
  id: string
  user_id: string
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'REJECTED'
  start_date: string | null
  end_date: string | null
  active: boolean
  createddate: string
  modifieddate: string | null
}

export const SubscriptionRepository = {
  subscribe: async (): Promise<Subscription> => {
    return await networkModule.request<Subscription>(AppRoutes.TRANSACTIONS.SUBSCRIBE, {
      method: 'POST',
      requiresAuth: true,
    })
  },

  getMyTransactions: async (): Promise<Subscription[]> => {
    return await networkModule.request<Subscription[]>(AppRoutes.TRANSACTIONS.MY_TRANSACTIONS, {
      method: 'GET',
      requiresAuth: true,
    })
  },
}

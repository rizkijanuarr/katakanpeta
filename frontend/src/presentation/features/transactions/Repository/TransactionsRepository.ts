import { networkModule } from '@/core/network/NetworkModule'
import { AppRoutes } from '@/core/common/AppRoutes'

export interface Transaction {
  id: string
  user_id: string
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'REJECTED'
  start_date: string | null
  end_date: string | null
  active: boolean
  createddate: string
  modifieddate: string | null
  user_name?: string
  user_email?: string
}

export const TransactionsRepository = {
  getAllTransactions: async (): Promise<Transaction[]> => {
    const response = await networkModule.request<{ success: boolean; message: string; data: Transaction[] }>(AppRoutes.TRANSACTIONS.GET_ALL, {
      method: 'GET',
      requiresAuth: true,
    })
    return response.data
  },

  approveTransaction: async (id: string): Promise<Transaction> => {
    const endpoint = AppRoutes.TRANSACTIONS.APPROVE.replace(':id', id)
    const response = await networkModule.request<{ success: boolean; message: string; data: Transaction }>(endpoint, {
      method: 'POST',
      requiresAuth: true,
    })
    return response.data
  },

  rejectTransaction: async (id: string): Promise<Transaction> => {
    const endpoint = AppRoutes.TRANSACTIONS.REJECT.replace(':id', id)
    const response = await networkModule.request<{ success: boolean; message: string; data: Transaction }>(endpoint, {
      method: 'POST',
      requiresAuth: true,
    })
    return response.data
  },
}

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
    return await networkModule.request<Transaction[]>(AppRoutes.TRANSACTIONS.GET_ALL, {
      method: 'GET',
      requiresAuth: true,
    })
  },

  approveTransaction: async (id: string): Promise<Transaction> => {
    const endpoint = AppRoutes.TRANSACTIONS.APPROVE.replace(':id', id)
    return await networkModule.request<Transaction>(endpoint, {
      method: 'POST',
      requiresAuth: true,
    })
  },

  rejectTransaction: async (id: string): Promise<Transaction> => {
    const endpoint = AppRoutes.TRANSACTIONS.REJECT.replace(':id', id)
    return await networkModule.request<Transaction>(endpoint, {
      method: 'POST',
      requiresAuth: true,
    })
  },
}

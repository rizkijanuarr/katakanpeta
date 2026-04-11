import { useState, useEffect } from 'react'
import { TransactionsRepository, Transaction } from '../Repository/TransactionsRepository'
import { toast } from 'sonner'

export function useTransactionsViewModel() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>('ALL')

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const data = await TransactionsRepository.getAllTransactions()
      setTransactions(data)
    } catch (error: any) {
      toast.error('Failed to load transactions', {
        description: error?.message || 'Could not fetch transactions',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      await TransactionsRepository.approveTransaction(id)
      toast.success('Transaction approved', {
        description: 'Subscription has been activated',
      })
      await fetchData()
    } catch (error: any) {
      toast.error('Failed to approve', {
        description: error?.message || 'Could not approve transaction',
      })
    }
  }

  const handleReject = async (id: string) => {
    try {
      await TransactionsRepository.rejectTransaction(id)
      toast.success('Transaction rejected', {
        description: 'Subscription request has been rejected',
      })
      await fetchData()
    } catch (error: any) {
      toast.error('Failed to reject', {
        description: error?.message || 'Could not reject transaction',
      })
    }
  }

  const filteredTransactions = filter === 'ALL'
    ? transactions
    : transactions.filter((tx) => tx.status === filter)

  return {
    transactions: filteredTransactions,
    isLoading,
    filter,
    setFilter,
    handleApprove,
    handleReject,
    fetchData,
  }
}

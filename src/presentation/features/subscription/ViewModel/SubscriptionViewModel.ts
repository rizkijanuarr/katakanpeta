import { useState, useEffect } from 'react'
import { SubscriptionRepository, Subscription } from '../Repository/SubscriptionRepository'
import { toast } from 'sonner'

export function useSubscriptionViewModel() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [transactions, setTransactions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubscribing, setIsSubscribing] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const data = await SubscriptionRepository.getMyTransactions()
      setTransactions(data)
      
      // Get latest subscription
      if (data.length > 0) {
        setSubscription(data[0])
      }
    } catch (error: any) {
      toast.error('Failed to load subscription data', {
        description: error?.message || 'Could not fetch subscription info',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubscribe = async () => {
    setIsSubscribing(true)
    try {
      await SubscriptionRepository.subscribe()
      toast.success('Subscription requested', {
        description: 'Your subscription is pending admin approval',
      })
      await fetchData()
    } catch (error: any) {
      toast.error('Subscription failed', {
        description: error?.message || 'Could not request subscription',
      })
    } finally {
      setIsSubscribing(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'text-yellow-500',
      ACTIVE: 'text-green-500',
      EXPIRED: 'text-gray-500',
      REJECTED: 'text-red-500',
    }
    return colors[status] || 'text-gray-500'
  }

  const getDaysRemaining = (endDate: string | null): number | null => {
    if (!endDate) return null
    const end = new Date(endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  return {
    subscription,
    transactions,
    isLoading,
    isSubscribing,
    handleSubscribe,
    getStatusColor,
    getDaysRemaining,
  }
}

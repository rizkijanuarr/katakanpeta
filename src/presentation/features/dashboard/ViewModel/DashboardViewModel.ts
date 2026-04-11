import { useState, useEffect } from 'react'
import { DashboardRepository, UserDashboardResponse, AdminDashboardResponse } from '../Repository/DashboardRepository'
import { useAuthStore } from '@/core/store/authStore'
import { toast } from 'sonner'

export function useDashboardViewModel() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const userRole = useAuthStore((state) => state.user?.role)
  
  const [userDashboard, setUserDashboard] = useState<UserDashboardResponse['data'] | null>(null)
  const [adminDashboard, setAdminDashboard] = useState<AdminDashboardResponse['data'] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        if (userRole === 'ADMIN') {
          // Fetch admin dashboard data
          const response = await DashboardRepository.getAdminDashboard()
          setAdminDashboard(response.data)
        } else {
          // Fetch user dashboard data
          const response = await DashboardRepository.getUserDashboard()
          setUserDashboard(response.data)
        }
      } catch (err: any) {
        const message = err?.message || 'Failed to load dashboard data'
        setError(message)
        toast.error('Dashboard Error', {
          description: message,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userRole])

  return {
    isLoading,
    error,
    userRole,
    userDashboard,
    adminDashboard,
  }
}

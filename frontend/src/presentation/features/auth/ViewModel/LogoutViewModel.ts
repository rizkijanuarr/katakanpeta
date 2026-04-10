import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/core/store/authStore'
import { AuthRepository } from '../Repository/AuthRepository'
import { toast } from 'sonner'

export function useLogoutViewModel() {
  const [isLoading, setIsLoading] = useState(false)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      // Call backend logout endpoint
      await AuthRepository.logout()

      // Clear local storage and state
      logout()

      toast.success('Logged out', {
        description: 'You have been successfully logged out',
      })

      // Redirect to landing page
      navigate({ to: '/' })
    } catch (error: any) {
      console.error('Logout failed:', error)
      // Still logout locally even if backend fails
      logout()
      toast.success('Logged out', {
        description: 'You have been successfully logged out',
      })
      navigate({ to: '/' })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    handleLogout,
  }
}

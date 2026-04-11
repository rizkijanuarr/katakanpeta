import { networkModule } from '@/core/network/NetworkModule'
import { AppRoutes } from '@/core/common/AppRoutes'

export const AuthRepository = {
  logout: async (): Promise<{ success: boolean; message: string }> => {
    return await networkModule.request<{ success: boolean; message: string }>(AppRoutes.AUTH.LOGOUT, {
      method: 'POST',
      requiresAuth: true,
    })
  }
}

import { networkModule } from '@/core/network/NetworkModule'
import { AppRoutes } from '@/core/common/AppRoutes'
import { ForgotPasswordResponse } from '../Response/ForgotPasswordResponse'

export const ForgotPasswordRepository = {
  requestReset: async (data: { email: string; newPassword: string }): Promise<ForgotPasswordResponse> => {
    const response = await networkModule.request<ForgotPasswordResponse>(AppRoutes.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      body: data,
    })
    return response
  }
}

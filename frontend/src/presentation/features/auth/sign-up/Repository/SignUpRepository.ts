
import { networkModule } from '@/core/network/NetworkModule'
import { AppRoutes } from '@/core/common/AppRoutes'
import { SignUpResponse } from '../Response/SignUpResponse'

export const SignUpRepository = {
  register: async (data: { name: string; email: string; password: string }): Promise<void> => {
    await networkModule.request<SignUpResponse>(AppRoutes.AUTH.REGISTER, {
      method: 'POST',
      body: data,
    })
  }
}

import { networkModule } from '@/core/network/NetworkModule'
import { AppRoutes } from '@/core/common/AppRoutes'
import { SignInResponse } from '../Response/SignInResponse'

export const SignInRepository = {
  login: async (credentials: { email: string; password: string }): Promise<SignInResponse['data']> => {
    const response = await networkModule.request<SignInResponse>(AppRoutes.AUTH.LOGIN, {
      method: 'POST',
      body: credentials,
    })
    
    // Return data langsung agar lebih mudah dipakai di ViewModel
    return response.data
  }
}

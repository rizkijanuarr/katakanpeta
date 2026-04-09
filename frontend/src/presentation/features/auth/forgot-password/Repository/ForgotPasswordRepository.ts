import { ForgotPasswordResponse } from '../Response/ForgotPasswordResponse'
import { sleep } from '@/lib/utils'

export const ForgotPasswordRepository = {
  requestReset: async (email: string): Promise<ForgotPasswordResponse> => {
    // Simulasi request network
    await sleep(2000)
    return {
      message: `Password reset link sent to ${email}`,
    }
  }
}

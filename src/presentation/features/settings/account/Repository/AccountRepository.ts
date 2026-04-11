import { AccountResponse } from '../Response/AccountResponse'
import { sleep } from '@/lib/utils'

export const AccountRepository = {
  updateAccount: async (data: any): Promise<AccountResponse> => {
    // Simulasi request network
    await sleep(1500)
    return {
      message: 'Account updated successfully',
      user: {
        name: data.name,
        dob: data.dob.toISOString(),
        language: data.language,
      }
    }
  }
}

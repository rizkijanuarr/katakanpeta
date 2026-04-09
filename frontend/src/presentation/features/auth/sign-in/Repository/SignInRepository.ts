import { SignInService } from '../Service/SignInService'
import { SignInResponse } from '../Response/SignInResponse'

// Ini mock API untuk contoh, nanti bisa diganti dengan axios dari NetworkModule
export const SignInRepository = {
  login: async (credentials: any): Promise<SignInResponse> => {
    // Simulasi loading selama 2 detik
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: "mock-jwt-token-12345",
          user: {
            id: "u-1",
            name: "Admin User",
            email: credentials.email,
          }
        })
      }, 2000)
    })
  }
}

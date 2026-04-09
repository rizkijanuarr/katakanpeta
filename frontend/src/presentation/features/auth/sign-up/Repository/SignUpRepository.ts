
import { SignUpResponse } from '../Response/SignUpResponse'

export const SignUpRepository = {
  register: async (credentials: any): Promise<SignUpResponse> => {
    // Simulasi loading 2 detik
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: "Registration successful",
          user: {
            id: "u-12345",
            email: credentials.email,
          }
        })
      }, 2000)
    })
  }
}

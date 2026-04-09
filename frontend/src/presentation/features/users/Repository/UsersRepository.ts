import { users } from '../Model/users-mock'
import { User } from '../Model/UserSchema'

export const UsersRepository = {
  getUsers: async (): Promise<User[]> => {
    // Simulasi delay fetch API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(users)
      }, 1000)
    })
  }
}

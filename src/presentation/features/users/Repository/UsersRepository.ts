import { networkModule } from '@/core/network/NetworkModule'
import { AppRoutes } from '@/core/common/AppRoutes'
import { User, CreateUserRequest, UpdateUserRequest, UserListResponse, UserResponse } from '../Model/UserSchema'

export const UsersRepository = {
  getUsers: async (): Promise<User[]> => {
    const response = await networkModule.request<UserListResponse>(AppRoutes.USERS.GET_ALL, {
      method: 'GET',
      requiresAuth: true,
    })
    return response.data
  },

  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await networkModule.request<UserResponse>(AppRoutes.USERS.CREATE, {
      method: 'POST',
      body: data,
      requiresAuth: true,
    })
    return response.data
  },

  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const endpoint = AppRoutes.USERS.UPDATE.replace(':id', id)
    const response = await networkModule.request<UserResponse>(endpoint, {
      method: 'PUT',
      body: data,
      requiresAuth: true,
    })
    return response.data
  },

  deleteUser: async (id: string): Promise<void> => {
    const endpoint = AppRoutes.USERS.DELETE.replace(':id', id)
    await networkModule.request<{ message: string }>(endpoint, {
      method: 'DELETE',
      requiresAuth: true,
    })
  },
}

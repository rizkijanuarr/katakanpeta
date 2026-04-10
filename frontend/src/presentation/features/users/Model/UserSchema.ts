export interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'USER'
  active: boolean
  createdDate: string
  modifiedDate: string | null
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role: 'ADMIN' | 'USER'
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  password?: string
  role?: 'ADMIN' | 'USER'
}

export interface UserListResponse {
  success: boolean
  message: string
  data: User[]
}

export interface UserResponse {
  success: boolean
  message: string
  data: User
}

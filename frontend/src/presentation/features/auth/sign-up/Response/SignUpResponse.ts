export interface SignUpResponse {
  success: boolean
  message: string
  data: {
    id: string
    name: string
    email: string
    role: string
    token: string
  }
}

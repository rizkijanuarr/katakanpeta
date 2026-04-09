export interface SignInResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}

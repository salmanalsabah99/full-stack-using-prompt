export interface CreateUserInput {
  name: string
  email: string
  password: string
}

export interface UserResponse {
  success: boolean
  user?: {
    id: string
    name: string | null
    email: string
  }
  error?: string
} 
import { apiRequest } from './client'

export type User = {
  id: number
  name: string
  email: string
  createdAt: string
}

type LoginResponse = {
  token: string
}

export function login(email: string, password: string) {
  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

export function register(name: string, email: string, password: string) {
  return apiRequest<User>('/api/users', {
    method: 'POST',
    body: { name, email, password },
  })
}

import {
  UserResponseSchema,
  UsersResponseSchema,
  type CreateUserForm,
  type UpdateUserForm,
  type User,
} from '../schemas/user'
import apiClient from './client'

export type { User }

export async function getUsers(): Promise<User[]> {
  const res = await apiClient.get<unknown>('/users')
  return UsersResponseSchema.parse(res.data).data
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/users/${id}`)
}

export async function activateUser(id: string): Promise<User> {
  const res = await apiClient.patch<unknown>(`/users/${id}/activate`)
  return UserResponseSchema.parse(res.data).data
}

export async function deactivateUser(id: string): Promise<User> {
  const res = await apiClient.patch<unknown>(`/users/${id}/deactivate`)
  return UserResponseSchema.parse(res.data).data
}

export async function createUser(data: CreateUserForm): Promise<User> {
  const res = await apiClient.post<unknown>('/users', data)
  return UserResponseSchema.parse(res.data).data
}

export async function updateUser(id: string, data: UpdateUserForm): Promise<User> {
  const res = await apiClient.put<unknown>(`/users/${id}`, data)
  return UserResponseSchema.parse(res.data).data
}

import {
  CategoriesResponseSchema,
  CategoryResponseSchema,
  ContentResponseSchema,
  ContentsResponseSchema,
  type Category,
  type CategoryForm,
  type Content,
  type ContentForm,
} from '../schemas/content'
import apiClient from './client'

export type { Content, Category }

export async function getContents(): Promise<Content[]> {
  const res = await apiClient.get<unknown>('/articles')
  return ContentsResponseSchema.parse(res.data).data
}

export async function getCategories(): Promise<Category[]> {
  const res = await apiClient.get<unknown>('/categories')
  return CategoriesResponseSchema.parse(res.data).data
}

export async function createContent(data: ContentForm): Promise<Content> {
  const res = await apiClient.post<unknown>('/articles', data)
  return ContentResponseSchema.parse(res.data).data
}

export async function updateContent(id: string, data: ContentForm): Promise<Content> {
  const res = await apiClient.put<unknown>(`/articles/${id}`, data)
  return ContentResponseSchema.parse(res.data).data
}

export async function deleteContent(id: string): Promise<void> {
  await apiClient.delete(`/articles/${id}`)
}

export async function createCategory(data: CategoryForm): Promise<Category> {
  const res = await apiClient.post<unknown>('/categories', data)
  return CategoryResponseSchema.parse(res.data).data
}

export async function updateCategory(id: string, data: CategoryForm): Promise<Category> {
  const res = await apiClient.put<unknown>(`/categories/${id}`, data)
  return CategoryResponseSchema.parse(res.data).data
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`)
}

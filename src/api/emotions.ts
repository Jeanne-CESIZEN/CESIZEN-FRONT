import apiClient from './client'
import {
  BaseEmotionsResponseSchema,
  BaseEmotionResponseSchema,
  DetailedEmotionsResponseSchema,
  DetailedEmotionResponseSchema,
  type BaseEmotion,
  type DetailedEmotion,
  type Emotion,
  type EmotionForm,
} from '../schemas/emotion'

export type { BaseEmotion, DetailedEmotion, Emotion }

/** Fetch base emotions and detailed emotions, then combine them */
export async function getEmotions(): Promise<Emotion[]> {
  const [baseRes, detailedRes] = await Promise.all([
    apiClient.get<unknown>('/base-emotions'),
    apiClient.get<unknown>('/detailed-emotions'),
  ])

  const baseEmotions = BaseEmotionsResponseSchema.parse(baseRes.data).data
  const detailedEmotions = DetailedEmotionsResponseSchema.parse(detailedRes.data).data

  return baseEmotions.map((base) => ({
    ...base,
    detailedEmotions: detailedEmotions.filter((d) => d.baseEmotionId === base.id),
  }))
}

export async function updateBaseEmotion(id: string, data: EmotionForm): Promise<BaseEmotion> {
  const res = await apiClient.put<unknown>(`/base-emotions/${id}`, data)
  return BaseEmotionResponseSchema.parse(res.data).data
}

export async function addDetailedEmotion(baseEmotionId: string, name: string): Promise<DetailedEmotion> {
  const res = await apiClient.post<unknown>('/detailed-emotions', { name, baseEmotionId })
  return DetailedEmotionResponseSchema.parse(res.data).data
}

export async function removeDetailedEmotion(id: string): Promise<void> {
  await apiClient.delete(`/detailed-emotions/${id}`)
}


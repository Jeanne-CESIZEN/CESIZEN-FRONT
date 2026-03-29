import { z } from 'zod'

export const DetailedEmotionSchema = z.object({
  id: z.string(),
  baseEmotionId: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const BaseEmotionSchema = z.object({
  id: z.string(),
  name: z.string(),
  emoji: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  score: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const BaseEmotionsResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(BaseEmotionSchema),
})

export const BaseEmotionResponseSchema = z.object({
  success: z.boolean(),
  data: BaseEmotionSchema,
})

export const DetailedEmotionsResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(DetailedEmotionSchema),
})

export const DetailedEmotionResponseSchema = z.object({
  success: z.boolean(),
  data: DetailedEmotionSchema,
})

// Combined type used in the UI (base emotion + its detailed emotions)
export const EmotionSchema = BaseEmotionSchema.extend({
  detailedEmotions: z.array(DetailedEmotionSchema).default([]),
})

export type BaseEmotion = z.infer<typeof BaseEmotionSchema>
export type DetailedEmotion = z.infer<typeof DetailedEmotionSchema>
export type Emotion = z.infer<typeof EmotionSchema>

export const EmotionFormSchema = z.object({
  name: z.string().min(2, 'Nom requis (2 caractères minimum)'),
  emoji: z.string().min(1, 'Emoji requis'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Couleur hex invalide (#rrggbb)'),
  score: z.number().int('Score entier').min(1, 'Minimum 1').max(5, 'Maximum 5'),
})

export type EmotionForm = z.infer<typeof EmotionFormSchema>

// Stats
export const TrackerStatsDistributionItemSchema = z.object({
  key: z.string(),
  count: z.number(),
  percent: z.number(),
})

export const TrackerStatsEmotionSchema = z.object({
  key: z.string(),
  name: z.string(),
  emoji: z.string(),
  color: z.string(),
})

export const TrackerStatsResponseSchema = z.object({
  period: z.number(),
  summary: z.object({
    dominantEmotion: z
      .object({ key: z.string(), name: z.string(), emoji: z.string(), color: z.string(), count: z.number() })
      .nullable(),
    averageMood: z.object({ score: z.number(), count: z.number() }),
    trend: z.object({ direction: z.enum(['up', 'down', 'stable']), percent: z.number() }),
  }),
  emotions: z.array(TrackerStatsEmotionSchema),
  distribution: z.array(TrackerStatsDistributionItemSchema),
  timeline: z.array(z.unknown()),
})

export const TrackerStatsApiResponseSchema = z.object({
  success: z.boolean(),
  data: TrackerStatsResponseSchema,
})

export type TrackerStats = z.infer<typeof TrackerStatsResponseSchema>

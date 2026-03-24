import { z } from "zod";

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  color: z.string(),
  iconName: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CategoriesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(CategorySchema),
  count: z.number(),
});

export const CategoryResponseSchema = z.object({
  success: z.boolean(),
  data: CategorySchema,
});

export type Category = z.infer<typeof CategorySchema>;

export const CategoryFormSchema = z.object({
  name: z.string().min(2, "Nom requis (2 caractères minimum)"),
  description: z.string().max(500, "500 caractères maximum").optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Couleur hex invalide"),
  iconName: z.string().min(1, "Nom d'icône requis"),
});

export type CategoryForm = z.infer<typeof CategoryFormSchema>;

export const ContentSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ContentsResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(ContentSchema),
  count: z.number(),
});

export const ContentResponseSchema = z.object({
  success: z.boolean(),
  data: ContentSchema,
});

export type Content = z.infer<typeof ContentSchema>;

export const ContentFormSchema = z.object({
  title: z.string().min(2, "Titre requis (2 caractères minimum)"),
  description: z.string().max(500, "500 caractères maximum").optional(),
  content: z.string().min(1, "Contenu requis"),
  categoryId: z.string().min(1, "Catégorie requise"),
});

export type ContentForm = z.infer<typeof ContentFormSchema>;

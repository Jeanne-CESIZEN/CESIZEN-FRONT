import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.email(),
  role: z.enum(["USER", "ADMIN"]),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const UsersResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(UserSchema),
  count: z.number(),
});

export const UserResponseSchema = z.object({
  success: z.boolean(),
  data: UserSchema,
});

export type User = z.infer<typeof UserSchema>;

const UserFormBaseSchema = z.object({
  firstname: z.string().min(1, "Prénom requis"),
  lastname: z.string().min(1, "Nom requis"),
  email: z.email("Email invalide"),
  role: z.enum(["USER", "ADMIN"]),
});

export const CreateUserSchema = UserFormBaseSchema.extend({
  password: z.string().min(8, "8 caractères minimum"),
});

export const UpdateUserSchema = UserFormBaseSchema;

export type CreateUserForm = z.infer<typeof CreateUserSchema>;
export type UpdateUserForm = z.infer<typeof UpdateUserSchema>;

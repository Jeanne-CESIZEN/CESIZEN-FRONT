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

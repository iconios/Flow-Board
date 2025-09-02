import { z } from "zod";

const UserCreateSchema = z.object({
  email: z.string(),
  password_hash: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export type UserCreateType = z.infer<typeof UserCreateSchema>;

const UserCreateInputSchema = UserCreateSchema.pick({ email: true });

export const UserCreateInputTypeSchema = UserCreateInputSchema.extend({
  password: z.string(),
});

export type UserCreateInputType = z.infer<typeof UserCreateInputTypeSchema>;

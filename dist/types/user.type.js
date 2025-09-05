import { z } from "zod";
const UserCreateSchema = z.object({
  firstname: z.string().trim(),
  lastname: z.string().trim(),
  email: z.email().trim(),
  password_hash: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  isVerified: z.boolean(),
  verificationToken: z.string(),
  verificationTokenExpires: z.iso.datetime(),
  resetPasswordToken: z.string(),
  resetPasswordTokenExpires: z.iso.datetime(),
  generateVerificationToken: z.function(),
  generatePasswordResetToken: z.function(),
});
const UserCreateInputSchema = UserCreateSchema.pick({
  email: true,
  firstname: true,
  lastname: true,
});
export const UserInputTypeSchema = UserCreateInputSchema.extend({
  password: z
    .string()
    .min(8, { message: "Password must be minimum 8 characters" })
    .max(20, { message: "Password should be maximum 20 characters" })
    .refine((password) => /[A-Z]/.test(password), {
      message: "Password must have at least one uppercase character",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "Password must have at least one lowercase character",
    })
    .refine((password) => /\d/.test(password), {
      message: "Password must have at least one numeric character",
    })
    .refine((password) => /[`!@#$%^&*()_=+\\[\]'";:/?.>,<|{}]/.test(password), {
      message: "Password must have at least one special character",
    })
    .trim(),
});
export const UserLoginInputSchema = UserInputTypeSchema.omit({
  firstname: true,
  lastname: true,
});
const UserCreateMessageSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  error: z.string().optional(),
  token: z.string().optional(),
  id: z.string().optional(),
});
const UserLoginMessageSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  error: z.string().optional(),
  token: z.string().optional(),
  id: z.string().optional(),
});
export const userUpdateInputSchema = UserCreateSchema.pick({
  firstname: true,
  lastname: true,
  email: true,
});
//# sourceMappingURL=user.type.js.map

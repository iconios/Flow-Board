import { z } from "zod";

const UserCreateSchema = z.object({
  firstname: z.string().min(2).trim(),
  lastname: z.string().min(2).trim(),
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

export type UserCreateType = z.infer<typeof UserCreateSchema>;

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

export const UserPasswordSchema = z
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
  .trim();

export type UserPasswordType = z.infer<typeof UserPasswordSchema>;

export type UserInputType = z.infer<typeof UserInputTypeSchema>;

export const UserLoginInputSchema = UserInputTypeSchema.omit({
  firstname: true,
  lastname: true,
});

export type UserLoginInputType = z.infer<typeof UserLoginInputSchema>;

const UserCreateMessageSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  error: z.string().optional(),
  token: z.string().optional(),
});

export type UserCreateMessageType = z.infer<typeof UserCreateMessageSchema>;

const TokenSchema = z.object({
  email: z.email(),
  firstname: z.string(),
});

export type TokenType = z.infer<typeof TokenSchema>;

export const UserEmailSchema = z.object({
  email: z.email(),
});
export type UserEmailType = z.infer<typeof UserEmailSchema>;

const UserLoginMessageSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  error: z.string().optional(),
  token: z.string().optional(),
  user: TokenSchema.optional(),
});

export type UserLoginMessageType = z.infer<typeof UserLoginMessageSchema>;

export const userUpdateInputSchema = UserCreateSchema.pick({
  firstname: true,
  lastname: true,
  email: true,
});

export type UserUpdateInputType = z.infer<typeof userUpdateInputSchema>;

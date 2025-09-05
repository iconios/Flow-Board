import { z } from "zod";
declare const UserCreateSchema: z.ZodObject<
  {
    firstname: z.ZodString;
    lastname: z.ZodString;
    email: z.ZodEmail;
    password_hash: z.ZodString;
    created_at: z.ZodISODateTime;
    updated_at: z.ZodISODateTime;
    isVerified: z.ZodBoolean;
    verificationToken: z.ZodString;
    verificationTokenExpires: z.ZodISODateTime;
    resetPasswordToken: z.ZodString;
    resetPasswordTokenExpires: z.ZodISODateTime;
    generateVerificationToken: z.ZodFunction<
      z.core.$ZodFunctionArgs,
      z.core.$ZodFunctionOut
    >;
    generatePasswordResetToken: z.ZodFunction<
      z.core.$ZodFunctionArgs,
      z.core.$ZodFunctionOut
    >;
  },
  z.core.$strip
>;
export type UserCreateType = z.infer<typeof UserCreateSchema>;
export declare const UserInputTypeSchema: z.ZodObject<
  {
    firstname: z.ZodString;
    lastname: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
  },
  z.core.$strip
>;
export type UserInputType = z.infer<typeof UserInputTypeSchema>;
export declare const UserLoginInputSchema: z.ZodObject<
  {
    email: z.ZodEmail;
    password: z.ZodString;
  },
  z.core.$strip
>;
export type UserLoginInputType = z.infer<typeof UserLoginInputSchema>;
declare const UserCreateMessageSchema: z.ZodObject<
  {
    success: z.ZodBoolean;
    message: z.ZodString;
    error: z.ZodOptional<z.ZodString>;
    token: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
  },
  z.core.$strip
>;
export type UserCreateMessageType = z.infer<typeof UserCreateMessageSchema>;
declare const UserLoginMessageSchema: z.ZodObject<
  {
    success: z.ZodBoolean;
    message: z.ZodString;
    error: z.ZodOptional<z.ZodString>;
    token: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
  },
  z.core.$strip
>;
export type UserLoginMessageType = z.infer<typeof UserLoginMessageSchema>;
export declare const userUpdateInputSchema: z.ZodObject<
  {
    firstname: z.ZodString;
    lastname: z.ZodString;
    email: z.ZodEmail;
  },
  z.core.$strip
>;
export type UserUpdateInputType = z.infer<typeof userUpdateInputSchema>;
export {};
//# sourceMappingURL=user.type.d.ts.map

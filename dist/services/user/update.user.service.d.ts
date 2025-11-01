import { type UserUpdateInputType } from "../../types/user.type.js";
declare const UpdateUserService: (userUpdateInput: UserUpdateInputType) => Promise<(import("mongoose").Document<unknown, {}, {
    firstname: string;
    lastname: string;
    email: string;
    password_hash: string;
    created_at: string;
    updated_at: string;
    isVerified: boolean;
    verificationToken: string;
    verificationTokenExpires: string;
    resetPasswordToken: string;
    resetPasswordTokenExpires: string;
    generateVerificationToken: import("zod/v4/core").$InferOuterFunctionType<import("zod/v4/core").$ZodFunctionArgs, import("zod/v4/core").$ZodFunctionOut>;
    generatePasswordResetToken: import("zod/v4/core").$InferOuterFunctionType<import("zod/v4/core").$ZodFunctionArgs, import("zod/v4/core").$ZodFunctionOut>;
}> & {
    firstname: string;
    lastname: string;
    email: string;
    password_hash: string;
    created_at: string;
    updated_at: string;
    isVerified: boolean;
    verificationToken: string;
    verificationTokenExpires: string;
    resetPasswordToken: string;
    resetPasswordTokenExpires: string;
    generateVerificationToken: import("zod/v4/core").$InferOuterFunctionType<import("zod/v4/core").$ZodFunctionArgs, import("zod/v4/core").$ZodFunctionOut>;
    generatePasswordResetToken: import("zod/v4/core").$InferOuterFunctionType<import("zod/v4/core").$ZodFunctionArgs, import("zod/v4/core").$ZodFunctionOut>;
} & {
    _id: import("mongoose").Types.ObjectId;
}) | null>;
export default UpdateUserService;
//# sourceMappingURL=update.user.service.d.ts.map
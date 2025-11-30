import mongoose from "mongoose";
declare const User: mongoose.Model<{
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
}, {}, {}, {}, mongoose.Document<unknown, {}, {
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
    _id: mongoose.Types.ObjectId;
}, any>;
export default User;
//# sourceMappingURL=user.model.d.ts.map
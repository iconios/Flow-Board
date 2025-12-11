import mongoose from "mongoose";
declare const BoardMember: mongoose.Model<
  {
    board_id: string;
    user_id: string;
    role: string;
    created_at: string;
    updated_at: string;
    isVerified: boolean;
    verificationToken: string;
    verificationTokenExpires: string;
    generateVerificationToken: import("zod/v4/core").$InferOuterFunctionType<
      import("zod/v4/core").$ZodFunctionArgs,
      import("zod/v4/core").$ZodFunctionOut
    >;
  },
  {},
  {},
  {},
  mongoose.Document<
    unknown,
    {},
    {
      board_id: string;
      user_id: string;
      role: string;
      created_at: string;
      updated_at: string;
      isVerified: boolean;
      verificationToken: string;
      verificationTokenExpires: string;
      generateVerificationToken: import("zod/v4/core").$InferOuterFunctionType<
        import("zod/v4/core").$ZodFunctionArgs,
        import("zod/v4/core").$ZodFunctionOut
      >;
    }
  > & {
    board_id: string;
    user_id: string;
    role: string;
    created_at: string;
    updated_at: string;
    isVerified: boolean;
    verificationToken: string;
    verificationTokenExpires: string;
    generateVerificationToken: import("zod/v4/core").$InferOuterFunctionType<
      import("zod/v4/core").$ZodFunctionArgs,
      import("zod/v4/core").$ZodFunctionOut
    >;
  } & {
    _id: mongoose.Types.ObjectId;
  },
  any
>;
export default BoardMember;
//# sourceMappingURL=boardMember.model.d.ts.map

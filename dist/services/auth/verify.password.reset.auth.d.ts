import { ZodError } from "zod";
declare const VerifyPasswordResetService: (
  resetPasswordToken: string,
) => Promise<
  | {
      success: boolean;
      message: string;
      error: string;
    }
  | {
      success: boolean;
      message: string;
      error?: never;
    }
  | {
      success: boolean;
      message: ZodError<unknown>;
      error: string;
    }
>;
export default VerifyPasswordResetService;
//# sourceMappingURL=verify.password.reset.auth.d.ts.map

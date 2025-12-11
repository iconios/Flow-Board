import { ZodError } from "zod";
import { type UserPasswordType } from "../../types/user.type.js";
declare const PasswordUpdateService: (
  resetPasswordToken: string,
  password: UserPasswordType,
) => Promise<
  | {
      success: boolean;
      message: string;
      error: string;
    }
  | {
      success: boolean;
      message: ZodError<unknown>;
      error: string;
    }
>;
export default PasswordUpdateService;
//# sourceMappingURL=password.update.auth.d.ts.map

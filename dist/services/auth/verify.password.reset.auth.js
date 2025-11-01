/*
#Plan:
0. Log every step of the process for audit
1. Validate the received token
2. Notify the caller
*/
import { ZodError } from "zod";
import User from "../../models/user.model.js";
const VerifyPasswordResetService = async (resetPasswordToken) => {
    try {
        // Validate that the token exists in the DB
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordTokenExpires: { $gt: new Date(Date.now()) },
        }).exec();
        if (!user) {
            console.log("Invalid reset password token link");
            return {
                success: false,
                message: "Invalid or Expired Link",
                error: "INVALID LINK",
            };
        }
        // Notify the caller
        return {
            success: true,
            message: "Password reset verified successfully",
        };
    }
    catch (error) {
        console.log("Error during password update", error);
        if (error instanceof ZodError) {
            return {
                success: false,
                message: error,
                error: "ZOD VALIDATION ERROR",
            };
        }
        return {
            success: false,
            message: "Internal server error",
            error: "SERVER ERROR",
        };
    }
};
export default VerifyPasswordResetService;
//# sourceMappingURL=verify.password.reset.auth.js.map
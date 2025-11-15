/*
#Plan:
0. Log every step of the process for audit
1. Validate that the token exists in the DB
2. Ensure password policy is enforced
3. Hash and store the password
4. Invalidate the token
5. Send confirmation email
6. Notify the caller
*/
import { ZodError } from "zod";
import User from "../../models/user.model.js";
import { UserPasswordSchema } from "../../types/user.type.js";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { sendPasswordUpdateConfirmationEmail } from "../../utils/mailer.util.js";
dotenv.config();
const PasswordUpdateService = async (resetPasswordToken, password) => {
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
    // Ensure password policy is enforced
    const validatedPassword = UserPasswordSchema.parse(password);
    console.log("User password update validated");
    // Hash and store the password
    const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const password_hash = await bcrypt.hash(validatedPassword, salt);
    const email = user.email;
    await User.findOneAndUpdate({ email }, { password_hash });
    // Invalidate the token received
    await User.findOneAndUpdate(
      { email },
      {
        resetPasswordToken: "",
        resetPasswordTokenExpires: "",
        updated_at: new Date(Date.now()),
      },
    );
    console.log(`User ${email} password reset token invalidated`);
    // Send confirmation email
    sendPasswordUpdateConfirmationEmail(email, user.firstname);
    console.log("Password update confirmation email sent");
    return {
      success: true,
      message: "Password update successful",
      error: "Null",
    };
  } catch (error) {
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
export default PasswordUpdateService;
//# sourceMappingURL=password.update.auth.js.map

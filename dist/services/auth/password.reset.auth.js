/*
#Plan:
0. Log every step of the process for audit
1. Check if the email exists on the DB else return generic message
2. Generate and store a hashed password reset token
3. Send the passsword reset link email
4. Notify the caller
*/
import User from "../../models/user.model.js";
import { sendPasswordResetEmail } from "../../utils/mailer.util.js";
const PasswordResetRequestService = async (rawEmail) => {
  try {
    // Check if the email exists on the DB else return generic message
    const email = rawEmail.trim().toLowerCase();
    const user = await User.findOne({ email }).exec();
    if (!user) {
      console.log("User not found for password request", email);
      return {
        success: true,
        message:
          "If an account with that email exists, a reset link has been sent",
        error: "INVALID EMAIL",
      };
    }
    // Generate and store a hashed password reset token
    await user.generatePasswordResetToken();
    await User.findOneAndUpdate(
      {
        email: user.email,
      },
      {
        resetPasswordToken: user.resetPasswordToken,
        resetPasswordTokenExpires: user.resetPasswordTokenExpires,
      },
    );
    console.log("Password reset token", user.resetPasswordToken);
    console.log("Password reset token expires", user.resetPasswordTokenExpires);
    // Send the passsword reset link email
    sendPasswordResetEmail(user.email, user.firstname, user.resetPasswordToken);
    // Notify the caller
    return {
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent",
      error: "Null",
    };
  } catch (error) {
    console.log("Error during password reset", error);
    return {
      success: false,
      message: "Internal server error",
      error: "SERVER ERROR",
    };
  }
};
export default PasswordResetRequestService;
//# sourceMappingURL=password.reset.auth.js.map

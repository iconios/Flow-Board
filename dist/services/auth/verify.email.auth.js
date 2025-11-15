/*
#Plan: User Verification
0. Validate input
1. Check if a user exists with the verification token
2. Check if the user (found) is not already verified
3. Declare the validated input
4. Invalidate the used verification token
5. Send a welcome email to the account holder
6. Notify the caller
*/
import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendSuccessVerificationEmail } from "../../utils/mailer.util.js";
const JWT_SECRET = process.env.JWT_SECRET;
const VerifyEmailAuth = async (verificationToken) => {
  // Check if a user exists with the verification token
  const userExist = await User.findOne({
    verificationToken,
    verificationTokenExpires: { $gt: new Date(Date.now()) },
  });
  if (!userExist) {
    console.log("User with verification token does not exist");
    return {
      success: false,
      message: "The verification link is invalid or has expired",
      error: "INVALID OR EXPIRED LINK",
    };
  }
  // Check if the user is not already verified
  if (userExist.isVerified) {
    console.log("User verification already done");
    return {
      success: false,
      message: "Account already verified",
      error: "VERIFIED_USER",
    };
  }
  // Declare the validated input
  const email = userExist.email;
  const firstname = userExist.firstname;
  const lastname = userExist.lastname;
  // Invalidate the used verification token
  await User.findOneAndUpdate(
    { email },
    {
      isVerified: true,
      verificationToken: "",
      verificationTokenExpires: "",
      updated_at: new Date(Date.now()),
    },
  ).exec();
  console.log(`User ${email} is verified and records updated`);
  // Send a welcome email to the account holder
  sendSuccessVerificationEmail(email, firstname);
  // Generate and send token to the caller
  const token = jwt.sign(
    {
      firstname,
      lastname,
      email,
    },
    JWT_SECRET,
  );
  // Notify the caller
  return {
    success: true,
    message: "Thank you, your account has been verified",
    token,
  };
};
export default VerifyEmailAuth;
//# sourceMappingURL=verify.email.auth.js.map

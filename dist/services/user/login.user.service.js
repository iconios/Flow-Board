/*
#Plan:
0. Declare the variables
1. Validate the user input
2. Check if user doesn't exist
3. Check if user password doesn't match the hash
4. Check if the user isn't verified
5. Generate token with user details
6. Send token to the caller
*/
import { UserLoginInputSchema, } from "../../types/user.type.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { ZodError } from "zod";
import ConfirmUserExists from "../../utils/user.exist.util.js";
import { sendVerificationEmail } from "../../utils/mailer.util.js";
dotenv.config();
const UserLoginService = async (userLoginInput) => {
    // Declare the variables
    try {
        // Validate the user input
        const validatedInput = UserLoginInputSchema.parse(userLoginInput);
        const email = validatedInput.email;
        const password = validatedInput.password;
        // Check if user doesn't exist
        const userExist = await ConfirmUserExists(email);
        if (!userExist) {
            return {
                success: false,
                message: "Username or password incorrect",
            };
        }
        // Check if user password doesn't match the hash
        const passwordMatch = await bcrypt.compare(password, userExist.password_hash);
        if (!passwordMatch) {
            return {
                success: false,
                message: "Username or password incorrect",
            };
        }
        // Check if the user isn't verified
        if (!userExist.isVerified) {
            sendVerificationEmail(userExist.email, userExist.firstname, userExist.verificationToken);
            return {
                success: false,
                message: "A verification email has been sent to your email address.",
            };
        }
        // Generate token with user details
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            return {
                success: false,
                message: "Fatal error. JWT token undefined",
            };
        }
        const token = jwt.sign({
            id: userExist._id.toString(),
            email: userExist.email,
            firstname: userExist.firstname,
        }, JWT_SECRET);
        // Send token to the caller
        return {
            success: true,
            message: "Login successful",
            token,
            user: {
                id: userExist._id.toString(),
                email: userExist.email,
                firstname: userExist.firstname,
            },
        };
    }
    catch (error) {
        if (error instanceof ZodError) {
            console.log("Error with Zod", error);
            return {
                success: false,
                message: "Error validating user",
                error: "Error validating user",
            };
        }
        console.log("Something went wrong. Please try again", error);
        return {
            success: false,
            message: "Something went wrong. Please try again",
            error: "Something went wrong. Please try again",
        };
    }
};
export default UserLoginService;
//# sourceMappingURL=login.user.service.js.map
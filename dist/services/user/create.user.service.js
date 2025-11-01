/*
#Plan:
0. Declare the needed variables or constants
1. Validate the user details input
2. Check if the email already exist on the db and terminate op
3. Generate the hash of the password
4. Save the new user object on the db
5. Generate and send token to the caller
*/
import { UserInputTypeSchema, } from "../../types/user.type.js";
import bcrypt from "bcrypt";
import User from "../../models/user.model.js";
import { ZodError } from "zod";
import * as dotenv from "dotenv";
dotenv.config();
import ConfirmUserExists from "../../utils/user.exist.util.js";
import { sendVerificationEmail } from "../../utils/mailer.util.js";
const CreateUserService = async (createUserInput) => {
    // Declare the needed variables or constants
    const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
    console.log("Salt rounds", SALT_ROUNDS);
    try {
        // Validate the user details input against the schema
        const validatedInput = UserInputTypeSchema.parse(createUserInput);
        const { email, firstname, lastname, password } = validatedInput;
        // Check if the user already exist on the db and terminate op
        const userExist = await ConfirmUserExists(email);
        if (userExist) {
            return {
                success: false,
                message: "User already exists",
                error: "EMAIL_EXISTS",
            };
        }
        // Generate the hash of the password
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const password_hash = await bcrypt.hash(password, salt);
        // Create a new user
        const newUser = new User({
            email,
            password_hash,
            firstname,
            lastname,
        });
        await newUser.generateVerificationToken();
        // Save new user
        const user = await newUser.save();
        console.log("Verification token", user.verificationToken);
        console.log("Verification token expires", user.verificationTokenExpires);
        //Send verification email
        sendVerificationEmail(email, user.firstname, user.verificationToken);
        return {
            success: true,
            message: "A verification email has been sent to your e-mailbox.",
        };
    }
    catch (error) {
        if (error instanceof ZodError) {
            console.log("Error with Zod", error);
            return {
                success: false,
                message: "Invalid input data",
                error: "INVALID DATA",
            };
        }
        console.log("Something went wrong", error);
        return {
            success: false,
            message: "Internal server error",
            error: "SERVER ERROR",
        };
    }
};
export default CreateUserService;
//# sourceMappingURL=create.user.service.js.map
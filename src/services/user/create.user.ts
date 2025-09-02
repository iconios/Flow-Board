import {
  UserCreateInputType,
  UserCreateInputTypeSchema,
} from "../../types/user.create.type";
import bcrypt from "bcrypt";
import User from "../../models/user.model";
import { ZodError } from "zod";

/*
#Plan:
0. Declare the needed variables or constants
1. Validate the user details input
2. Generate the hash of the password
3. Create the created_at and updated_at field values
4. Save the new user object on the db
5. Let the caller know if the save was successful or not
*/

const CreateUserService = async (
  createUserInput: UserCreateInputType,
): Promise<boolean> => {
  // Declare the needed variables or constants
  const Salt = 10;

  try {
    // Validate the user details input against the schema
    UserCreateInputTypeSchema.parse(createUserInput);

    // Generate the hash of the password
    const password_hash = await bcrypt.hash(createUserInput.password, Salt);

    // Create the created_at and updated_at field values
    const created_at = new Date().toISOString();
    const updated_at = created_at;
    const email = createUserInput.email;

    // Save the new user object on the db
    const newUser = new User({
      email,
      password_hash,
      created_at,
      updated_at,
    });

    await newUser.save();

    // Let the caller know if the save was successful or not
    return true;

  } catch (error) {
    if (error instanceof ZodError) {
      console.log("Error with Zod", error);
      return false;
    }

    console.log("Something went wrong. Please try again", error);
    return false;
  }
};

export default CreateUserService;

/*
#Plan:
1. Validate the email
*/

import User from "../../models/user.model.js";
import {
  userUpdateInputSchema,
  type UserUpdateInputType,
} from "../../types/user.type.js";

const UpdateUserService = async (userUpdateInput: UserUpdateInputType) => {
  const validatedInput = userUpdateInputSchema.parse(userUpdateInput);
  const { email, firstname, lastname } = validatedInput;
  return await User.findOneAndUpdate({ email }, { firstname, lastname });
};

export default UpdateUserService;

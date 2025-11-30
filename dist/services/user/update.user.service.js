/*
#Plan:
1. Validate the email
*/
import User from "../../models/user.model.js";
import { userUpdateInputSchema, } from "../../types/user.type.js";
const UpdateUserService = async (userUpdateInput) => {
    const validatedInput = userUpdateInputSchema.parse(userUpdateInput);
    const { email, firstname, lastname } = validatedInput;
    return await User.findOneAndUpdate({ email }, { firstname, lastname });
};
export default UpdateUserService;
//# sourceMappingURL=update.user.service.js.map
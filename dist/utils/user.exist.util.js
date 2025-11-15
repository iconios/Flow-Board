/*
#Plan: Verify if a user exists in the DB
1. Search for the email on the DB
2. Return the result to the caller
*/
import User from "../models/user.model.js";
const ConfirmUserExists = async (email) => {
  return await User.findOne({ email }).exec();
};
export default ConfirmUserExists;
//# sourceMappingURL=user.exist.util.js.map

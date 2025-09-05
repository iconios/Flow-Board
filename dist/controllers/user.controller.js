import express from "express";
import User from "../models/user.model.js";
const UserRouter = express.Router();
// Get the list of all registered users
UserRouter.get("/", async (_req, res) => {
  try {
    const users = await User.find({}).select("-password_hash");
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.log("Error fetching users", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
export default UserRouter;
//# sourceMappingURL=user.controller.js.map

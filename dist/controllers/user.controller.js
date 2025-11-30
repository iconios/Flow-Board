import express, {} from "express";
import User from "../models/user.model.js";
import RateLimiter from "../utils/rateLimit.util.js";
import { UserEmailSchema } from "../types/user.type.js";
import { ZodError } from "zod";
import TokenExtraction from "../middlewares/token.extraction.util.js";
import DeleteUserService from "../services/user/delete.user.service.js";
const UserRouter = express.Router();
// Get a registered user
UserRouter.get("/:email", RateLimiter, TokenExtraction, async (req, res) => {
    const user = req.userId;
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthenticated user",
            data: null,
        });
    }
    try {
        const { email } = UserEmailSchema.parse(req.params);
        const normalizedEmail = email.trim().toLowerCase();
        const userFound = await User.findOne({ email: normalizedEmail })
            .select("_id, firstname, email")
            .lean()
            .exec();
        if (!userFound) {
            return res.status(200).json({
                success: false,
                message: "No user found",
                data: null,
            });
        }
        return res.status(200).json({
            success: true,
            message: "User found",
            data: {
                id: userFound._id.toString(),
                firstname: userFound.firstname,
                email: userFound.email,
            },
        });
    }
    catch (error) {
        console.log("Error fetching user", error);
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: "Error validating email parameter",
                data: null,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
        });
    }
});
// Delete User Controller
/*
#Plan
1. Confirm user id availability
2. Pass the user id to the DeleteUserService
3. Return result to client
*/
UserRouter.delete("/delete", TokenExtraction, async (req, res) => {
    try {
        // 1. Confirm user id availability
        const userId = req.userId;
        if (!userId?.trim()) {
            return res.status(401).json({
                success: false,
                message: "User authentication required",
            });
        }
        // 2. Pass the user id to the DeleteUserService
        const result = await DeleteUserService(userId);
        if (!result.success) {
            console.log("User deletion failed");
            return res.status(400).json(result);
        }
        // 3. Return result to client
        console.log("User deletion successful");
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("Unknown error", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
export default UserRouter;
//# sourceMappingURL=user.controller.js.map
/*
#Plan:
1. Validate the token exists
2. Show the user the proper message
*/
import express, {} from "express";
import VerifyEmailAuth from "../services/auth/verify.email.auth.js";
import * as dotenv from "dotenv";
dotenv.config();
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import CreateUserService from "../services/user/create.user.service.js";
import UserLoginService from "../services/user/login.user.service.js";
import RateLimiter from "../utils/rateLimit.util.js";
import PasswordResetRequestService from "../services/auth/password.reset.auth.js";
import VerifyPasswordResetService from "../services/auth/verify.password.reset.auth.js";
import PasswordUpdateService from "../services/auth/password.update.auth.js";
const AuthRouter = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));
// Email verification
AuthRouter.get("/verify-email", async (req, res) => {
    // Validate the token exists
    const query = req.query.token;
    const token = Array.isArray(query) ? query[0] : query;
    if (typeof token !== "string" || !token) {
        res.status(400).sendFile(join(__dirname, "expired-token.html"));
        return;
    }
    // Show the user the proper message
    const result = await VerifyEmailAuth(token);
    if (result.success === false) {
        console.log("Expired token handler hit");
        res.status(400).sendFile(join(__dirname, "expired-token.html"));
        return;
    }
    console.log("Successful token verification handler hit");
    res.status(200).sendFile(join(__dirname, "successful-verification.html"));
});
// Register a new user
AuthRouter.post("/register", RateLimiter, async (req, res) => {
    console.log("User details", req.body);
    try {
        const result = await CreateUserService(req.body);
        if (result.success) {
            res.status(201).json({
                success: true,
                message: result.message,
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: result.message,
                error: result.error,
            });
        }
    }
    catch (error) {
        console.log("Error registering user", error);
        res.status(500).json({
            success: false,
            message: "Unknown error",
        });
    }
});
// Login a user
AuthRouter.post("/login", RateLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Received email", email);
        console.log("Received password", password);
        const result = await UserLoginService({ email, password });
        if (result.success) {
            res.status(200).json({
                success: true,
                message: result.message,
                token: result.token,
                user: result.user,
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: result.message,
                error: result.error,
            });
        }
    }
    catch (error) {
        console.log("Error login", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: "Internal server error",
        });
    }
});
// Forgot Password Request API
AuthRouter.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Forgot password for", email);
        const result = await PasswordResetRequestService(email);
        if (!result.success) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: "Internal server error",
            });
            return;
        }
        res.status(200).json({
            success: result.success,
            message: result.message,
            error: result.error,
        });
    }
    catch (error) {
        console.log("Password reset request error", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: "Internal server error",
        });
    }
});
// Token Validation (The Reset Page) API
AuthRouter.get("/reset-password", async (req, res) => {
    try {
        // Validate the token exists
        const query = req.query.token;
        console.log("Token received");
        const token = Array.isArray(query) ? query[0] : query;
        if (typeof token !== "string" || !token) {
            console.error("Expired token handler 1 hit");
            res.status(400).sendFile(join(__dirname, "expired-token.html"));
            return;
        }
        // Handle the request
        const result = await VerifyPasswordResetService(token);
        if (!result.success) {
            console.error("Expired token handler 2 hit");
            res.status(400).sendFile(join(__dirname, "expired-token.html"));
        }
        //Send the password reset page
        if (result.success) {
            console.error("Successful token handler hit");
            res.status(200).sendFile(join(__dirname, "password-reset-page.html"));
        }
    }
    catch (error) {
        console.log("Token validation error", error);
        res.status(500).send("Server Error");
    }
});
// Password Update Service API
AuthRouter.post("/password-update", RateLimiter, async (req, res) => {
    try {
        // Validate the token exists
        const query = req.query.token;
        const token = Array.isArray(query) ? query[0] : query;
        console.log("Received token", token);
        if (typeof token !== "string" || !token) {
            res.status(400).sendFile(join(__dirname, "expired-token.html"));
            return;
        }
        // Receive the password
        const { password } = req.body;
        console.log("Received password", password);
        // Handle the request
        const result = await PasswordUpdateService(token, password);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: result.message,
            });
            return;
        }
        res.status(201).send({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        console.log("Password update error", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
export default AuthRouter;
//# sourceMappingURL=auth.controller.js.map
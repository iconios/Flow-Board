/*
#Plan:
1. Validate the token exists
2. Show the user the proper message
*/
import express from "express";
import VerifyEmailAuth from "../services/auth/verify.email.auth.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import CreateUserService from "../services/user/create.user.service.js";
import UserLoginService from "../services/user/login.user.service.js";
import RateLimiter from "../utils/rateLimit.util.js";
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
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error,
      });
    }
  } catch (error) {
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
    const result = await UserLoginService(req.body);
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        token: result.token,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error,
      });
    }
  } catch (error) {
    console.log("Error login", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "Internal server error",
    });
  }
});
export default AuthRouter;
//# sourceMappingURL=auth.controller.js.map

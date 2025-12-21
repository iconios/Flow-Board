/*
#Plan:
0. Extend the express request object to access the token object
1. Receive the client request and retrieve the token
2. Validate the token
3. Attach the user id to the request and pass it to the next handler
*/
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const TokenExtraction = async (req, res, next) => {
    // 1. Receive the client request and retrieve the token
    const auth = req.headers.authorization;
    if (!auth) {
        return res.status(401).json({
            success: false,
            message: "Authorization header missing",
        });
    }
    const [scheme, token] = auth.split(" ");
    if (scheme?.toLowerCase() !== "bearer") {
        return res.status(401).json({
            success: false,
            message: "Invalid scheme",
        });
    }
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Missing token",
        });
    }
    try {
        // 2. Validate the token
        if (!JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Fatal error. JWT token undefined",
            });
        }
        const decodedToken = jwt.verify(token, JWT_SECRET, {
            algorithms: ["HS256"],
        });
        if (!decodedToken || typeof decodedToken === "string") {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }
        // 3. Attach the user id to the request and pass it to the next handler
        if (!Object.hasOwn(decodedToken, "id")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const userId = decodedToken.id;
        console.log("Received userId", userId);
        req.userId = userId;
        next();
    }
    catch (error) {
        console.error("Error validating user request", error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: `Invalid token: ${error.message}`,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Unknown error. Please try again",
        });
    }
};
export default TokenExtraction;
//# sourceMappingURL=token.extraction.util.js.map
/*
#Plan:
1. Receive the socket auth data and retrieve the token
2. Validate the token
3. Attach the user id to the socket and pass it to the next handler
*/

import type { ExtendedError, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from 'cookie';
import * as dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const SocketTokenExtraction = (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void,
) => {
  // 1. Receive the socket auth data and retrieve the token
  const header = socket.request.headers.cookie || "";
  if (!header) {
    return next(new Error("Authorization header missing"));
  }  
  const cookies = cookie.parse(header);      
  const token = cookies.token; 

  if (!token) {
    return next(new Error("Not authenticated"));
  }

  // 2. Validate the token
  if (!JWT_SECRET) {
    return next(new Error("Fatal error. JWT token undefined"));
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });
    if (!decodedToken || typeof decodedToken === "string") {
      return next(new Error("Invalid token"));
    }

    // 3. Attach the user id to the socket and pass it to the next handler
    if (!Object.hasOwn(decodedToken, "id")) {
      return next(new Error("Invalid token: user ID not found"));
    }
    const userId = decodedToken.id;
    console.log("Received socket userId", userId);
    socket.data.userId = userId;
    next();
  } catch (error) {
    console.error("Error extracting user from token", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return next(new Error(`Invalid token: ${error.message}`));
    }

    return next(new Error("Unknown error. Please try again"));
  }
};

export default SocketTokenExtraction;

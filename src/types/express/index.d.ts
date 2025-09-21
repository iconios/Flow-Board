import { Request } from "express";
import { Server } from "socket.io";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      io?: Server;
    }
  }
}

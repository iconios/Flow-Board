// src/socket.ts
import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";

import SocketTokenExtraction from "./middlewares/socket.token.extraction.util.js";
import JoinRoomUtility from "./utils/join.room.util.js";
import LeaveRoomUtility from "./utils/leave.room.util.js";
import ListReorderUtility from "./utils/list.reorder.util.js";
import TaskReorderUtility from "./utils/task.reorder.util.js";
import TaskMoveUtility from "./task.move.utility.js";

export function createSocketServer(server: HttpServer) {
  const io = new Server(server, {
    path: "/socket.io",
    cors: { origin: ["http://localhost:3000"], credentials: true },
  });

  io.use(SocketTokenExtraction);

  io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`);

    socket.on("room:join", (roomId: string) => JoinRoomUtility(socket, roomId));
    socket.on("room:leave", (roomId: string) => LeaveRoomUtility(socket, roomId));
    socket.on("list:reorder", (payload) => ListReorderUtility(socket, payload));
    socket.on("task:reorder", (payload) => TaskReorderUtility(socket, payload));
    socket.on("task:move", (payload) => TaskMoveUtility(socket, payload));

    socket.on("disconnect", () => console.log("User disconnected"));
  });

  io.engine.on("connection_error", (error) => {
    console.error("Engine connection_error:", {
      code: error.code,
      message: error.message,
      context: error.context,
    });
  });

  return io;
}

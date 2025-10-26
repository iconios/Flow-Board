import express, { type Request, type Response } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import * as dotenv from "dotenv";
import dbConnect from "./dbConnection.js";
import UserRouter from "./controllers/user.controller.js";
import AuthRouter from "./controllers/auth.controller.js";
import cors from "cors";
import BoardRouter from "./controllers/board.controller.js";
import helmet from "helmet";
import BoardMemberRouter from "./controllers/member.controller.js";
import ListRouter from "./controllers/list.controller.js";
import TaskRouter from "./controllers/task.controller.js";
import ActivityRouter from "./controllers/activity.controller.js";
import CommentRouter from "./controllers/comment.controller.js";
import SocketTokenExtraction from "./middlewares/socket.token.extraction.util.js";
import JoinRoomUtility from "./utils/join.room.util.js";
import LeaveRoomUtility from "./utils/leave.room.util.js";
import ListReorderUtility from "./utils/list.reorder.util.js";
import TaskReorderUtility from "./utils/task.reorder.util.js";
import TaskMoveUtility from "./task.move.utility.js";
dotenv.config();

// Initialize all variables or constants
const app = express();
const server = createServer(app);
const PORT = process.env.PORT;
const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true,
  },
});

// Enable express middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  }),
);
// (Prod only) HSTS once you have HTTPS everywhere
if (process.env.NODE_ENV === "production") {
  app.use(helmet.hsts({ maxAge: 15552000 }));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize the mongoDB connection
dbConnect().catch(console.dir);

// Routers
app.get("/health", (_req, res) => res.sendStatus(200));
app.use("/user", UserRouter);
app.use("/auth", AuthRouter);
app.use("/board", BoardRouter);
app.use("/member", BoardMemberRouter);
app.use("/list", ListRouter);
app.use("/task", TaskRouter);
app.use("/activity", ActivityRouter);
app.use("/comment", CommentRouter);

// Handle 404 errors
app.all(/(.*)/, (req: Request, res: Response) => {
  return res.status(404).json({ error: "Route not found" });
});

// Initialize the socket.io connections
io.use(SocketTokenExtraction);
io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  // Socket join room
  socket.on("room:join", (roomId: string) => JoinRoomUtility(socket, roomId));

  // Socket leave room
  socket.on("room:leave", (roomId: string) => LeaveRoomUtility(socket, roomId));

  // Socket reorder list
  socket.on("list:reorder", (payload) =>
    ListReorderUtility(socket, payload),
  );

  // Socket reorder task
  socket.on("task:reorder", (payload) => TaskReorderUtility(socket, payload));

  // Socket move task
  socket.on("task:move", (payload) => TaskMoveUtility(socket, payload));

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

io.engine.on("connection_error", (error) => {
  // Fires when the handshake fails before a socket is created
  console.error("Engine connection_error:", {
    code: error.code,
    message: error.message,
    context: error.context,
  });
});

io.engine.on("initial_headers", (headers, req) => {
  console.log("WS/Poll init:", req.urlencoded);
});

// Initialize the http server to start listening for requests
server.listen(PORT, () => {
  console.log("Server running on Port", PORT);
});

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
dotenv.config();

// Initialize all variables or constants
const app = express();
const server = createServer(app);
const PORT = process.env.PORT;
const io = new Server(server);

// Enable express middleware
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://127.0.0.1:3001",
      "https://localhost:3001",
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
  socket.on("room:join", JoinRoomUtility);

  // Socket leave room
  socket.on("room:leave", LeaveRoomUtility);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Initialize the http server to start listening for requests
server.listen(PORT, () => {
  console.log("Server running on Port", PORT);
});

import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import * as dotenv from "dotenv";
import dbConnect from "./dbConnection.js";
import UserRouter from "./controllers/user.controller.js";
import AuthRouter from "./controllers/auth.controller.js";
import cors from "cors";
import BoardRouter from "./controllers/board.controller.js";
import helmet from "helmet";
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

// Initialize the socket.io connections
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Initialize the http server to start listening for requests
server.listen(PORT, () => {
  console.log("Server running on Port", PORT);
});

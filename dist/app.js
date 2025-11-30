// src/app.ts
import express, {} from "express";
import cors from "cors";
import helmet from "helmet";
import * as dotenv from "dotenv";
dotenv.config();
import UserRouter from "./controllers/user.controller.js";
import AuthRouter from "./controllers/auth.controller.js";
import BoardRouter from "./controllers/board.controller.js";
import BoardMemberRouter from "./controllers/member.controller.js";
import ListRouter from "./controllers/list.controller.js";
import TaskRouter from "./controllers/task.controller.js";
import ActivityRouter from "./controllers/activity.controller.js";
import CommentRouter from "./controllers/comment.controller.js";
export function createApp() {
    const app = express();
    app.use(cors({
        origin: [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "https://localhost:3000",
            `${process.env.BASE_URL}`
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    }));
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: "cross-origin" },
        crossOriginEmbedderPolicy: false,
    }));
    if (process.env.NODE_ENV === "production") {
        app.use(helmet.hsts({ maxAge: 15552000 }));
    }
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.get("/health", (_req, res) => res.sendStatus(200));
    app.use("/user", UserRouter);
    app.use("/auth", AuthRouter);
    app.use("/board", BoardRouter);
    app.use("/member", BoardMemberRouter);
    app.use("/list", ListRouter);
    app.use("/task", TaskRouter);
    app.use("/activity", ActivityRouter);
    app.use("/comment", CommentRouter);
    app.all(/(.*)/, (req, res) => {
        return res.status(404).json({ error: "Route not found" });
    });
    return app;
}
export default createApp;
//# sourceMappingURL=app.js.map
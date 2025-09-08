import express, { type Request, type Response } from "express";

const BoardRouter = express.Router();

BoardRouter.get("/", (_req: Request, res: Response) => {
  res.send("Hello Board");
});

import express, { type Request, type Response } from "express";
import TokenExtraction from "../middlewares/token.extraction.util.js";
import ReadMemberService from "../services/member/read.member.service.js";
import CreateMemberService from "../services/member/create.member.service.js";
import DeleteMemberService from "../services/member/delete.member.service.js";
import RateLimiter from "../utils/rateLimit.util.js";

const BoardMemberRouter = express.Router();
BoardMemberRouter.get(
  "/:boardId",
  TokenExtraction,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const boardId = req.params.boardId?.trim();
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "Owner Id required",
        });
      }

      if (!boardId) {
        return res.status(400).json({
          success: false,
          message: "Board Id required",
        });
      }
      const readMemberInput = {
        ownerId: req.userId!,
        boardId: req.params.boardId!,
      };
      const result = await ReadMemberService(readMemberInput);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: result.message,
        members: result.members,
      });
    } catch (error) {
      console.error("Error reading board members", error);

      return res.status(500).json({
        success: false,
        message: "Server Error. Please try again",
      });
    }
  },
);

BoardMemberRouter.post(
  "/",
  RateLimiter,
  TokenExtraction,
  async (req: Request, res: Response) => {
    try {
      const ownerId = req.userId;
      if (!ownerId) {
        return res.status(400).json({
          success: false,
          message: "Owner Id required",
        });
      }

      const createBoardMemberInput = req.body;
      console.log("Boardmember create input", createBoardMemberInput);
      const result = await CreateMemberService(ownerId, createBoardMemberInput);
      if (!result.success) {
        return res.status(401).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: result.message,
        member: result.member,
      });
    } catch (error) {
      console.log("Error creating a board member", error);

      return res.status(500).json({
        success: false,
        message: "Server Error. Please try again",
      });
    }
  },
);

BoardMemberRouter.delete(
  "/:memberId",
  TokenExtraction,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "Owner Id required",
        });
      }

      const memberId = req.params.memberId;
      if (!memberId) {
        return res.status(400).json({
          success: false,
          message: "Board member Id required",
        });
      }

      const result = await DeleteMemberService(userId, memberId);
      if (!result.success) {
        return res.status(401).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error("Error deleting board member", error);

      return res.status(500).json({
        success: false,
        message: "Server Error. Please try again",
      });
    }
  },
);

export default BoardMemberRouter;

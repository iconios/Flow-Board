import express from "express";
import TokenExtraction from "../middlewares/token.extraction.util.js";
import ReadMemberService from "../services/member/read.member.service.js";
import CreateMemberService from "../services/member/create.member.service.js";
import DeleteMemberService from "../services/member/delete.member.service.js";
import RateLimiter from "../utils/rateLimit.util.js";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import VerifyBoardMemberService from "../services/member/verify.member.service.js";
import UpdateMemberRoleService from "../services/member/update.member.service.js";
const BoardMemberRouter = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));
// Board Membership Acceptance API
BoardMemberRouter.get("/accept-invite-email", async (req, res) => {
  // Validate the token exists
  const query = req.query.t;
  const token = Array.isArray(query) ? query[0] : query;
  if (typeof token !== "string" || !token) {
    res.status(400).sendFile(join(__dirname, "expired-token.html"));
    return;
  }
  // Show the user the proper message
  const result = await VerifyBoardMemberService(token);
  if (!result.success) {
    console.log("Expired token handler hit");
    res.status(400).sendFile(join(__dirname, "expired-token.html"));
    return;
  }
  console.log("Successful token verification handler hit");
  res
    .status(200)
    .sendFile(join(__dirname, "successful-membership-acceptance.html"));
});
BoardMemberRouter.get("/:boardId", TokenExtraction, async (req, res) => {
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
      userId: req.userId,
      boardId: req.params.boardId,
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
});
// Create a board member
BoardMemberRouter.post("/", RateLimiter, TokenExtraction, async (req, res) => {
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
});
BoardMemberRouter.delete("/:memberId", TokenExtraction, async (req, res) => {
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
});
// Update controller for board member role
/*
#Plan:
1. Validate all input data (board id, member id, owner id, role)
2. Pass the input to the Update service
3. Send the result to the client
*/
BoardMemberRouter.patch("/:memberId", TokenExtraction, async (req, res) => {
  // 1. Validate all input data (board id, member id, owner id, role)
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
    const { board_id, role } = req.body;
    if (!board_id) {
      return res.status(400).json({
        success: false,
        message: "Board Id required",
      });
    }
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role data required",
      });
    }
    // 2. Pass the input to the Update service
    const result = await UpdateMemberRoleService(userId, {
      memberId,
      board_id,
      role,
    });
    if (!result.success) {
      const statusCode = result.message.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({
        success: false,
        message: result.message,
      });
    }
    // 3. Send the result to the client
    return res.status(200).json({
      success: true,
      message: result.message,
      member: result.member,
    });
  } catch (error) {
    console.error("Error updating board member", error);
    return res.status(500).json({
      success: false,
      message: "Server Error. Please try again",
    });
  }
});
export default BoardMemberRouter;
//# sourceMappingURL=member.controller.js.map

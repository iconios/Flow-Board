import express, { type Request, type Response } from "express";
import CreateBoardService from "../services/board/create.board.service.js";
import UpdateBoardService from "../services/board/update.board.service.js";
import ReadBoardService from "../services/board/read.board.service.js";
import DeleteBoardService from "../services/board/delete.board.service.js";
import TokenExtraction from "../middlewares/token.extraction.util.js";

const BoardRouter = express.Router();

// Create a Board API
BoardRouter.post("/", TokenExtraction, async (req: Request, res: Response) => {
  try {
    const boardInput = {
      user_id: req.userId,
      ...req.body,
    };
    console.log("Received board details", boardInput);
    const result = await CreateBoardService(boardInput);
    if (!result.success) {
      console.log("Board creation failed");
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Unknow error while creating board", error);

    return res.status(500).json({
      success: false,
      message: "Server Error. Please try again",
    });
  }
});

// Update a Board API
BoardRouter.patch(
  "/:boardId",
  TokenExtraction,
  async (req: Request, res: Response) => {
    try {
      // Validate the board Id is received
      const board = req.params.boardId;
      console.log("Board id to update received", board);
      if (typeof board !== "string" || !board) {
        return res.status(400).json({
          success: false,
          message: "Board ID required",
        });
      }

      const boardDetails = {
        user_id: req.userId,
        ...req.body,
      };
      console.log("Board details to update received", boardDetails);
      const result = await UpdateBoardService(board, boardDetails);
      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error updating board", error);

      return res.status(500).json({
        success: false,
        message: "Server Error. Please try again",
      });
    }
  },
);

// Retrieve all user's boards API
BoardRouter.get("/", TokenExtraction, async (req: Request, res: Response) => {
  try {
    // Validate the user Id is received
    const user = req.userId!;

    // Retrieve the user's boards
    const result = await ReadBoardService(user);
    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving board", error);

    return res.status(500).json({
      success: false,
      message: "Server Error. Please try again",
    });
  }
});

// Delete a user's Board API
BoardRouter.delete(
  "/:boardId",
  TokenExtraction,
  async (req: Request, res: Response) => {
    try {
      // Get the parameters
      const user = req.userId!;
      const board = req.params.boardId;
      if (typeof board !== "string" || !board) {
        return res.status(400).json({
          success: false,
          message: "Board ID required",
        });
      }

      const result = await DeleteBoardService(board, user);
      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error retrieving board", error);

      return res.status(500).json({
        success: false,
        message: "Server Error. Please try again",
      });
    }
  },
);

export default BoardRouter;

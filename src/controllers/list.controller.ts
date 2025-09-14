import express, { type Request, type Response } from "express";
import TokenExtraction from "../middlewares/token.extraction.util.js";
import ReadListService from "../services/list/read.list.service.js";
import CreateListService from "../services/list/create.list.service.js";
import UpdateListService from "../services/list/update.list.service.js";
import DeleteListService from "../services/list/delete.list.service.js";

const ListRouter = express.Router();

// Get Lists of a Board API
ListRouter.get(
  "/:boardId",
  TokenExtraction,
  async (req: Request, res: Response) => {
    try {
      const boardId = req.params.boardId?.trim();
      if (!boardId) {
        return res.status(404).json({
          success: false,
          message: "Board ID not found",
        });
      }
      const userId = req.userId!;

      const result = await ReadListService(userId, boardId);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: result.message,
        lists: result.lists,
      });
    } catch (error) {
      console.error("Error reading lists", error);

      return res.status(500).json({
        success: false,
        message: "Server error. Please try again",
      });
    }
  },
);

// Create a List in a Board API
ListRouter.post(
  "/:boardId",
  TokenExtraction,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId!;
      const boardId = req.params.boardId?.trim();
      console.log("Received board id", boardId);
      const inputs = req.body;
      console.log("Received list data", inputs);
      if (Object.keys(inputs).length === 0) {
        return res.status(400).json({
          success: false,
          message: "Malformed request",
        });
      }
      const boardData = {
        boardId,
        ...inputs,
      };

      const result = await CreateListService(userId, boardData);
      if (!result.success) {
        return res.status(400).json({
          success: result.success,
          message: result.message,
        });
      }

      return res.status(201).json({
        success: true,
        message: result.message,
        list: result.list,
      });
    } catch (error) {
      console.error("Error creating list", error);

      return res.status(500).json({
        success: false,
        message: "Server error. Please try again",
      });
    }
  },
);

// Update List in a Board API
ListRouter.patch(
  "/:listId",
  TokenExtraction,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId!;
      const listId = req.params.listId?.trim();
      if (!listId) {
        return res.status(404).json({
          success: false,
          message: "List ID not found",
        });
      }
      const updateData = req.body;
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "Malformed request",
        });
      }

      const result = await UpdateListService(listId, userId, updateData);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: result.message,
        list: result.list,
      });
    } catch (error) {
      console.error("Error updating list", error);

      return res.status(500).json({
        success: false,
        message: "Server error. Please try again",
      });
    }
  },
);

// Delete Lists for a Board API
ListRouter.delete(
  "/:listId",
  TokenExtraction,
  async (req: Request, res: Response) => {
    try {
      const listId = req.params.listId?.trim();
      if (!listId) {
        return res.status(400).json({
          success: false,
          message: "List ID not found",
        });
      }

      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User ID not found",
        });
      }

      const result = await DeleteListService(userId, listId);
      if (!result.success) {
        return res.status(404).json({
          success: result.success,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: result.success,
        message: result.message,
        list: result.list,
      });
    } catch (error) {
      console.error("Error deleting list", error);

      return res.status(500).json({
        success: false,
        message: "Server error. Please try again",
      });
    }
  },
);

export default ListRouter;

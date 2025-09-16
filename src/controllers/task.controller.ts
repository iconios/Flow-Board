import express, { type Request, type Response } from "express";
import TokenExtraction from "../middlewares/token.extraction.util.js";
import CreateTaskService from "../services/task/create.task.service.js";
import ReadTaskService from "../services/task/read.task.service.js";
import UpdateTaskService from "../services/task/update.task.service.js";
import DeleteTaskService from "../services/task/delete.task.service.js";

const TaskRouter = express.Router();

// Create a task for a List API
TaskRouter.post(
  "/:listId",
  TokenExtraction,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID not found",
        });
      }

      const listId = req.params.listId;
      if (!listId) {
        return res.status(400).json({
          success: false,
          message: "List ID not found",
        });
      }

      const taskData = {
        ...req.body,
        listId,
      };

      const result = await CreateTaskService(userId, taskData);
      if (!result.success) {
        return res.status(400).json({
          success: result.success,
          message: result.message,
        });
      }

      return res.status(201).json({
        success: result.success,
        message: result.message,
        task: result.task,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error. Please try again",
        error: error,
      });
    }
  },
);

// Get all the Tasks associated with a List API
TaskRouter.get(
  "/:listId",
  TokenExtraction,
  async (req: Request, res: Response) => {
    try {
      const listId = req.params.listId?.trim();
      if (!listId) {
        return res.status(400).json({
          success: false,
          message: "List ID required",
        });
      }

      const userId = req.userId;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID required",
        });
      }

      const result = await ReadTaskService(userId, listId);
      if (!result.success) {
        return res.status(400).json({
          success: result.success,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: result.success,
        message: result.message,
        tasks: result.tasks,
      });
    } catch (error) {
      console.log("Error in read service for task", error);

      return res.status(500).json({
        success: false,
        message: "Server error. Please try again",
      });
    }
  },
);

// Update a Task API
TaskRouter.patch(
  "/:taskId",
  TokenExtraction,
  async (req: Request, res: Response) => {
    try {
      const taskId = req.params.taskId?.trim();
      const userId = req.userId;
      const updateData = req.body;
      if (!taskId || !userId || !updateData) {
        return res.status(400).json({
          success: false,
          message: "Missing required parameters",
        });
      }

      const result = await UpdateTaskService(userId, taskId, updateData);
      if (!result.success) {
        return res.status(400).json({
          success: result.success,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: result.success,
        message: result.message,
        task: result.task,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error. Please try again",
        error: error,
      });
    }
  },
);

// Delete a Task API
TaskRouter.delete(
  "/:taskId",
  TokenExtraction,
  async (req: Request, res: Response) => {
    try {
      const taskId = req.params.taskId;
      if (!taskId) {
        return res.status(422).json({
          success: false,
          message: "Task ID not found",
        });
      }

      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User ID not found",
        });
      }

      const result = await DeleteTaskService(userId, taskId);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: result.success,
        message: result.message,
        task: result.task,
      });
    } catch (error) {
      console.error("Server error", error);
      return res.status(500).json({
        success: false,
        message: "Server error. Please try again",
      });
    }
  },
);

export default TaskRouter;

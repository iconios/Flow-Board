import express from "express";
import TokenExtraction from "../middlewares/token.extraction.util.js";
import CreateTaskService from "../services/task/create.task.service.js";
import ReadTaskService from "../services/task/read.task.service.js";
import UpdateTaskService from "../services/task/update.task.service.js";
import DeleteTaskService from "../services/task/delete.task.service.js";
const TaskRouter = express.Router();
// Create a task for a List API
/*
#Plan: -------------------------------------------------------------------
1. Get and validate the user id, list id and task data
2. Pass the data to the CreateTaskService
3. Emit and send the new task details to the board members and board owner
*/
TaskRouter.post("/:listId", TokenExtraction, async (req, res) => {
  try {
    // 1. Get and validate the user id, list id and task data
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
    // 2. Pass the data to the CreateTaskService
    const result = await CreateTaskService(userId, taskData);
    if (!result.success) {
      return res.status(400).json({
        success: result.success,
        message: result.message,
      });
    }
    // 3. Emit and send the new task details to the board members and board owner
    const io = req.io;
    if (io && result.task) {
      const room = `listId-${listId}`;
      const sockets = await io.in(room).fetchSockets();
      if (sockets.length > 0) {
        io.in(room).emit("task:created", {
          message: result.message,
          task: result.task,
        });
      }
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
});
// Get all the Tasks associated with a List API
TaskRouter.get("/:listId", TokenExtraction, async (req, res) => {
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
});
// Update a Task API
/*
#Plan: -------------------------------------------------------------------
1. Get and validate the user id, task id and task data
2. Pass the data to the UpdateTaskService
3. Emit and send the updated task details to the board members and board owner
*/
TaskRouter.patch("/:taskId", TokenExtraction, async (req, res) => {
  try {
    // 1. Get and validate the user id, task id and task data
    const taskId = req.params.taskId?.trim();
    const userId = req.userId;
    const updateData = req.body;
    if (!taskId || !userId || !updateData) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
      });
    }
    // 2. Pass the data to the UpdateTaskService
    const result = await UpdateTaskService(userId, taskId, updateData);
    if (!result.success) {
      return res.status(400).json({
        success: result.success,
        message: result.message,
      });
    }
    // 3. Emit and send the updated task details to the board members and board owner
    const io = req.io;
    if (io && result.task) {
      const room = `taskId-${taskId}`;
      const sockets = await io.in(room).fetchSockets();
      if (sockets.length > 0) {
        io.in(room).emit("task:updated", {
          message: result.message,
          task: result.task,
        });
      }
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
});
// Delete a Task API
/*
#Plan: -------------------------------------------------------------------
1. Get and validate the user id, task id
2. Pass the data to the DeleteTaskService
3. Emit and send the deleted task details to the board members and board owner
*/
TaskRouter.delete("/:taskId", TokenExtraction, async (req, res) => {
  try {
    // 1. Get and validate the user id, task id
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
    // 2. Pass the data to the DeleteTaskService
    const result = await DeleteTaskService(userId, taskId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
    // 3. Emit and send the deleted task details to the board members and board owner
    const io = req.io;
    if (io && result.task) {
      const room = `taskId-${taskId}`;
      const sockets = await io.in(room).fetchSockets();
      if (sockets.length > 0) {
        io.in(room).emit("task:deleted", {
          message: result.message,
          task: result.task,
        });
      }
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
});
export default TaskRouter;
//# sourceMappingURL=task.controller.js.map

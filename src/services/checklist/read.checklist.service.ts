// Get checklist service
/*
#Plan:
1. Get and validate the taskId and userId
2. Check that the userId is associated with the checklist's task as a boardowner or board member 
3. Check that there are checklists associated with the taskId
4. Return the result to the caller
*/

import { MongooseError, Types } from "mongoose";
import Checklist from "../../models/checklist.model.js";
import Task from "../../models/task.model.js";
import List from "../../models/list.model.js";
import Board from "../../models/board.model.js";
import BoardMember from "../../models/boardMember.model.js";
import type { ReadChecklistResponseType } from "../../types/checklist.type.js";

const ReadChecklistService = async (
  taskId: string,
  userId: string,
): Promise<ReadChecklistResponseType> => {
  try {
    // 1. Get and validate the taskId and userId
    if (!taskId?.trim() || !userId?.trim()) {
      return {
        success: false,
        message: "Parameters required",
        data: [],
        error: {
          code: "MISSING_PARAMETER(S)",
          details: "Task ID and/or user ID is missing",
        },
        metadata: {
          timestamp: new Date(Date.now()).toISOString(),
          taskId: taskId || "undefined",
          userId: userId || "undefined",
        },
      };
    }

    if (!Types.ObjectId.isValid(taskId)) {
      return {
        success: false,
        message: "Invalid task ID format",
        data: [],
        error: {
          code: "INVALID_DATA",
          details: `"${taskId}" is not a valid objectId`,
        },
        metadata: {
          timestamp: new Date(Date.now()).toISOString(),
          taskId,
          userId,
        },
      };
    }

    if (!Types.ObjectId.isValid(userId)) {
      return {
        success: false,
        message: "Invalid user ID format",
        data: [],
        error: {
          code: "INVALID_DATA",
          details: `"${userId}" is not a valid objectId`,
        },
        metadata: {
          timestamp: new Date(Date.now()).toISOString(),
          taskId,
          userId,
        },
      };
    }

    // 2. Check that the userId is associated with the checklist's task as a boardowner or board member
    const taskListId = await Task.findById(taskId)
      .select("listId")
      .lean()
      .exec();
    if (!taskListId) {
      return {
        success: false,
        message: "Task not found",
        data: [],
        error: {
          code: "NOT_FOUND",
          details: `Task not found`,
        },
        metadata: {
          timestamp: new Date(Date.now()).toISOString(),
          taskId,
          userId,
        },
      };
    }
    if (!taskListId?.listId) {
      return {
        success: false,
        message: "Task's associated list not found",
        data: [],
        error: {
          code: "NOT_FOUND",
          details: "Task's associated list not found",
        },
        metadata: {
          timestamp: new Date(Date.now()).toISOString(),
          taskId,
          userId,
        },
      };
    }
    const listBoardId = await List.findById(taskListId.listId)
      .select("boardId")
      .lean()
      .exec();
    if (!listBoardId?.boardId) {
      return {
        success: false,
        message: "Task's associated board not found",
        data: [],
        error: {
          code: "NOT_FOUND",
          details: "Task's associated board not found",
        },
        metadata: {
          timestamp: new Date(Date.now()).toISOString(),
          taskId,
          userId,
        },
      };
    }

    const boardId = listBoardId.boardId;

    const [boardowner, boardMember] = await Promise.all([
      Board.findOne({ _id: boardId, user_id: userId })
        .select("_id")
        .lean()
        .exec(),
      BoardMember.findOne({ board_id: boardId, user_id: userId })
        .select("_id")
        .lean()
        .exec(),
    ]);

    if (!boardowner && !boardMember) {
      const boardExists = await Board.findById(boardId)
        .select("_id")
        .lean()
        .exec();
      if (!boardExists) {
        return {
          success: false,
          message: "Board not found",
          data: [],
          error: {
            code: "NOT_FOUND",
            details: "Board not found",
          },
          metadata: {
            timestamp: new Date(Date.now()).toISOString(),
            taskId,
            userId,
          },
        };
      }
      return {
        success: false,
        message: "Access denied",
        data: [],
        error: {
          code: "ACCESS_DENIED",
          details: "User not authorized",
        },
        metadata: {
          timestamp: new Date(Date.now()).toISOString(),
          taskId,
          userId,
        },
      };
    }

    // 3. Check that there are checklists associated with the taskId
    const checklists = await Checklist.find({ taskId })
      .populate<{
        userId: {
          email: string;
          firstname: string;
          lastname: string;
          _id: Types.ObjectId;
        };
      }>("userId", "email firstname lastname")
      .sort({ createdAt: -1 })
      .exec();

    const checklistReturned = checklists.map((item) => ({
      id: item._id.toString(),
      taskId: item.taskId.toString(),
      content: item.content,
      boardId: item.boardId.toString(),
      checked: item.checked,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      user: {
        email: item.userId.email,
        firstname: item.userId.firstname,
        lastname: item.userId.lastname,
        id: item.userId._id.toString(),
      },
    }));

    // 4. Return the result to the caller
    return {
      success: true,
      message:
        checklists.length === 0
          ? "No checklists found"
          : "Checklists retrieved successfully",
      data: checklistReturned,
      error: null,
      metadata: {
        timestamp: new Date(Date.now()).toISOString(),
        taskId,
        userId,
        count: checklists.length,
      },
    };
  } catch (error) {
    console.error(`Error reading checklists for task ${taskId}`, error);

    // Handle specific Mongoose errors
    if (error instanceof MongooseError) {
      if (error.name === "CastError") {
        return {
          success: false,
          message: "Invalid ID format",
          data: [],
          error: {
            code: "CAST_ERROR",
            details: "The provided ID format is invalid",
          },
          metadata: {
            timestamp: new Date(Date.now()).toISOString(),
            taskId,
            userId,
          },
        };
      }

      if (error.name === "ValidationError") {
        return {
          success: false,
          message: "Validation error",
          data: [],
          error: {
            code: "VALIDATION_ERROR",
            details: "Error validating query parameters",
          },
          metadata: {
            timestamp: new Date(Date.now()).toISOString(),
            taskId,
            userId,
          },
        };
      }

      // General Mongoose error
      return {
        success: false,
        message: "Database error occurred",
        data: [],
        error: {
          code: "DATABASE_ERROR",
          details:
            process.env.NODE_ENV === "development"
              ? error.message
              : "Error fetching data from database",
        },
        metadata: {
          timestamp: new Date(Date.now()).toISOString(),
          taskId,
          userId,
        },
      };
    }

    // Handle all other errors
    return {
      success: false,
      message: "Internal server error",
      data: [],
      error: {
        code: "INTERNAL_ERROR",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : "An unexpected error occurred",
      },
      metadata: {
        timestamp: new Date(Date.now()).toISOString(),
        taskId,
        userId,
      },
    };
  }
};

export default ReadChecklistService;

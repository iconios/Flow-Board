// Get checklist service
/*
#Plan:
1. Get and validate the taskId
2. Check that there are checklists associated with the taskId
3. Return the result to the caller
*/

import { MongooseError, Types } from "mongoose";
import Checklist from "../../models/checklist.model.js";

const ReadChecklistService = async (taskId: string) => {
  try {
    // 1. Get and validate the taskId
    if (!taskId?.trim()) {
      return {
        success: false,
        message: "Task ID is required",
        data: [],
        error: {
          code: "MISSING_PARAMETER",
          details: "Task ID is missing",
        },
        metadata: {
          timestamp: Date.now(),
          taskId: taskId || "undefined",
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
          timestamp: Date.now(),
          taskId,
        },
      };
    }

    // 2. Check that there are checklists associated with the taskId
    const checklists = await Checklist.find({ taskId })
      .populate<{userId: { email: string; firstname: string; lastname: string; }}>("userId", "email firstname lastname")
      .sort({ createdAt: -1 })
      .exec();


    // 3. Return the result to the caller
    return {
      success: true,
      message:
        checklists.length === 0
          ? "No checklists found"
          : "Checklists retrieved successfully",
      data: checklists,
      error: null,
      metadata: {
        timestamp: Date.now(),
        taskId,
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
            timestamp: Date.now(),
            taskId,
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
            timestamp: Date.now(),
            taskId,
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
          timestamp: Date.now(),
          taskId,
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
        timestamp: Date.now(),
        taskId,
      },
    };
  }
};

export default ReadChecklistService;

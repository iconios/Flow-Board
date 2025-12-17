// Create a checklist service
/*
#Plan:
1. Get and validate the checklist content, task id, board id, and user id
2. Confirm that the user is the owner or member of the board associated with the task id
3. Create the checklist and return the result to the client
*/

import { MongooseError, Types } from "mongoose";
import {
  CreateChecklistInputSchema,
  type CreateChecklistInputType,
  type CreateChecklistResponseType,
} from "../../types/checklist.type.js";
import Board from "../../models/board.model.js";
import BoardMember from "../../models/boardMember.model.js";
import Task from "../../models/task.model.js";
import Checklist from "../../models/checklist.model.js";
import { produceActivity } from "../../redis/activity.producer.js";

const CreateChecklistService = async (
  createChecklistInput: CreateChecklistInputType,
): Promise<CreateChecklistResponseType> => {
  try {
    // 1. Get and validate the checklist content, task id, board id, and user id
    const { content, taskId, boardId, userId } =
      CreateChecklistInputSchema.parse(createChecklistInput);
    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(taskId) ||
      !Types.ObjectId.isValid(boardId)
    ) {
      return {
        success: false,
        message: "Invalid parameter id format",
        data: {},
        error: {
          code: "INVALID_PARAMETER",
          details: "Invalid parameter id format",
        },
        metadata: {
          timestamp: new Date().toISOString(),
          userId,
          taskId,
          boardId,
        },
      };
    }

    // Verify that the task exists and that the task is associated with the board
    const task = await Task.findById(taskId).select("_id listId").lean().exec();
    if (!task) {
      return {
        success: false,
        message: "Task not found",
        data: {},
        error: {
          code: "NOT_FOUND",
          details: "Task not found",
        },
        metadata: {
          timestamp: new Date().toISOString(),
          userId,
          taskId,
          boardId,
        },
      };
    }

    const taskAssociatedWithBoard = await Board.findOne({
      _id: boardId,
      lists: { $in: task.listId },
    })
      .select("_id")
      .lean()
      .exec();
    if (!taskAssociatedWithBoard) {
      return {
        success: false,
        message: "Task not associated with Board or board not found",
        data: {},
        error: {
          code: "NOT_FOUND",
          details: "Task not associated with Board or board not found",
        },
        metadata: {
          timestamp: new Date().toISOString(),
          userId,
          taskId,
          boardId,
        },
      };
    }

    // 2. Confirm that the user is the owner or member of the board associated with the task id
    const [boardOwner, boardMember] = await Promise.all([
      Board.findOne({ _id: boardId, user_id: userId })
        .select("_id")
        .lean()
        .exec(),
      BoardMember.findOne({ board_id: boardId, user_id: userId })
        .select("_id")
        .lean()
        .exec(),
    ]);
    if (!boardOwner && !boardMember) {
      return {
        success: false,
        message: "Access denied",
        data: {},
        error: {
          code: "ACCESS_DENIED",
          details: "User not authorized",
        },
        metadata: {
          timestamp: new Date().toISOString(),
          taskId,
          userId,
          boardId,
        },
      };
    }

    // 3. Create the checklist and return the result to the client
    const newChecklist = new Checklist({
      content,
      boardId,
      taskId,
      userId,
    });

    const createdChecklist = await newChecklist.save();
    if (!createdChecklist) {
      return {
        success: false,
        message: "Failed to create checklist",
        data: {},
        error: {
          code: "CREATION_FAILED",
          details: "No document was created",
        },
        metadata: {
          timestamp: new Date().toISOString(),
          taskId,
          userId,
          boardId,
        },
      };
    }

    // Create activity log for checklist creation
    await produceActivity({
      activityType: "create",
      object: "Checklist",
      objectId: createdChecklist._id.toString(),
      userId,
    });
    console.log(`Activity log produced for checklist creation: ${createdChecklist._id.toString()}`);

    return {
      success: true,
      message: "Checklist created successfully",
      data: {
        id: createdChecklist._id.toString(),
        taskId: createdChecklist.taskId.toString(),
        userId: createdChecklist.userId.toString(),
        boardId: createdChecklist.boardId.toString(),
        content: createdChecklist.content,
        checked: createdChecklist.checked,
        createdAt: createdChecklist.createdAt.toISOString(),
        updatedAt: createdChecklist.updatedAt.toISOString(),
      },
      error: null,
      metadata: {
        timestamp: new Date().toISOString(),
        taskId,
        userId,
        boardId,
        checklistId: createdChecklist._id.toString(),
      },
    };
  } catch (error) {
    console.error("Error creating checklist", error);

    // Handle specific Mongoose errors
    if (error instanceof MongooseError) {
      if (error.name === "CastError") {
        return {
          success: false,
          message: "Invalid ID format",
          data: {},
          error: {
            code: "CAST_ERROR",
            details: "The provided ID format is invalid",
          },
          metadata: {
            timestamp: new Date().toISOString(),
          },
        };
      }

      if (error.name === "ValidationError") {
        return {
          success: false,
          message: "Validation error",
          data: {},
          error: {
            code: "VALIDATION_ERROR",
            details: "Error validating query parameters",
          },
          metadata: {
            timestamp: new Date().toISOString(),
          },
        };
      }

      // General Mongoose error
      return {
        success: false,
        message: "Database error occurred",
        data: {},
        error: {
          code: "DATABASE_ERROR",
          details:
            process.env.NODE_ENV === "development"
              ? error.message
              : "Error fetching data from database",
        },
        metadata: {
          timestamp: new Date().toISOString(),
        },
      };
    }

    // Handle all other errors
    return {
      success: false,
      message: "Internal server error",
      data: {},
      error: {
        code: "INTERNAL_ERROR",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : "An unexpected error occurred",
      },
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }
};

export default CreateChecklistService;

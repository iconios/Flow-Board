// Delete Checklist Service
/*
#Plan:
1. Get and validate the userId and checklist ID
2. Confirm that the checklist exists
3. Confirm that user is either the board owner or board member
4. Delete the checklist and return result to client
*/

import { MongooseError, Types } from "mongoose";
import {
  DeleteChecklistInputSchema,
  type DeleteChecklistInputType,
  type DeleteChecklistResponseType,
} from "../../types/checklist.type.js";
import Checklist from "../../models/checklist.model.js";
import Board from "../../models/board.model.js";
import BoardMember from "../../models/boardMember.model.js";
import { produceActivity } from "../../redis/activity.producer.js";
import { de } from "zod/locales";

const DeleteChecklistService = async (
  deleteChecklistInput: DeleteChecklistInputType,
): Promise<DeleteChecklistResponseType> => {
  try {
    const { userId, checklistId } =
      DeleteChecklistInputSchema.parse(deleteChecklistInput);

    if (!Types.ObjectId.isValid(userId)) {
      return {
        success: false,
        message: "Invalid user id format",
        data: {},
        error: {
          code: "INVALID_PARAMETER",
          details: "Invalid user id format",
        },
        metadata: {
          timestamp: new Date().toISOString(),
          userId,
          checklistId,
        },
      };
    }

    if (!Types.ObjectId.isValid(checklistId)) {
      return {
        success: false,
        message: "Invalid checklist id format",
        data: {},
        error: {
          code: "INVALID_PARAMETER",
          details: "Invalid checklist id format",
        },
        metadata: {
          timestamp: new Date().toISOString(),
          userId,
          checklistId,
        },
      };
    }

    // 2. Confirm that the checklist exists
    const checklist = await Checklist.findById(checklistId)
      .select("_id boardId")
      .lean()
      .exec();
    if (!checklist) {
      return {
        success: false,
        message: "Checklist not found",
        data: {},
        error: {
          code: "NOT_FOUND",
          details: "Checklist not found",
        },
        metadata: {
          timestamp: new Date().toISOString(),
          userId,
          checklistId,
        },
      };
    }

    // 3. Confirm that user is either the board owner or board member
    const boardId = checklist.boardId;
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
          checklistId,
          userId,
          boardId: boardId.toString(),
        },
      };
    }

    // 4. Delete the checklist and return result to client
    const deletedChecklist = await Checklist.deleteOne({ _id: checklistId })
      .lean()
      .exec();
    const isDeleted = deletedChecklist.deletedCount > 0;

    // Create activity log for checklist deletion
    if (isDeleted) {
      void produceActivity({
        userId,
        activityType: "delete",
        object: "Checklist",
        objectId: checklistId,
      }).catch((err) =>
        console.error(
          `Activity log failed for checklist deletion: ${checklistId}`,
          err,
        ),
      );
    }

    return {
      success: isDeleted,
      message: isDeleted
        ? "Checklist deleted successfully"
        : "Checklist could not be deleted or was already removed",
      data: {},
      error: isDeleted
        ? null
        : {
            code: "DELETE_FAILED",
            details: "No document was deleted",
          },
      metadata: {
        timestamp: new Date().toISOString(),
        deletedCount: deletedChecklist.deletedCount,
        checklistId,
        userId,
        boardId: boardId.toString(),
      },
    };
  } catch (error) {
    console.error("Error deleting checklist", error);

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

export default DeleteChecklistService;

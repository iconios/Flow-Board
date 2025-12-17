// Edit Checklist Service
/*
#Plan:
1. Get and validate the checklist ID, board-owner ID, and board-member ID
2. Confirm that the checklist ID exists and that the caller is the board owner or a board member
3. Update the checklist and return the updated checklist to the caller
*/

import { MongooseError, Types } from "mongoose";
import type { EditChecklistInputType } from "../../types/checklist.type.js";
import Checklist from "../../models/checklist.model.js";
import Board from "../../models/board.model.js";
import BoardMember from "../../models/boardMember.model.js";
import { produceActivity } from "../../redis/activity.producer.js";

const EditChecklistService = async ({
  checklistId,
  userId,
  content,
}: EditChecklistInputType) => {
  try {
    // 1. Get and validate the checklist ID, board-owner ID, and board-member ID
    if (!checklistId?.trim() || !userId?.trim() || !content?.trim()) {
      return {
        success: false,
        message: "Missing parameters",
        data: [],
        error: {
          code: "MISSING_PARAMETER(S)",
          details: "Parameters missing",
        },
        metadata: {
          timestamp: Date.now(),
          checklistId,
          userId,
        },
      };
    }

    if (!Types.ObjectId.isValid(checklistId)) {
      return {
        success: false,
        message: "Invalid checklist ID format",
        data: [],
        error: {
          code: "INVALID_PARAMETER",
          details: "Invalid checklist ID parameter",
        },
        metadata: {
          timestamp: Date.now(),
          checklistId,
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
          code: "INVALID_PARAMETER",
          details: "Invalid user ID parameter",
        },
        metadata: {
          timestamp: Date.now(),
          checklistId,
          userId,
        },
      };
    }

    // 2. Confirm that the checklist ID exists and that the caller is the board owner or a board member
    const checklistExists = await Checklist.findById(checklistId)
      .select("_id boardId")
      .lean()
      .exec();
    if (!checklistExists) {
      return {
        success: false,
        message: "Checklist not found",
        data: [],
        error: {
          code: "NOT_FOUND",
          details: "Checklist not found",
        },
        metadata: {
          timestamp: Date.now(),
          checklistId,
          userId,
        },
      };
    }

    const [boardOwner, boardMember] = await Promise.all([
      Board.findOne({ _id: checklistExists.boardId, user_id: userId })
        .select("_id")
        .lean()
        .exec(),
      BoardMember.findOne({
        board_id: checklistExists.boardId,
        user_id: userId,
      })
        .select("_id")
        .lean()
        .exec(),
    ]);
    if (!boardOwner && !boardMember) {
      return {
        success: false,
        message: "Unauthorized access",
        data: [],
        error: {
          code: "UNAUTHORIZED",
          details: "Access denied",
        },
        metadata: {
          timestamp: Date.now(),
          checklistId,
          userId,
        },
      };
    }

    // 3. Update the checklist and return the updated checklist to the caller
    const updatedChecklist = await Checklist.findByIdAndUpdate(
      checklistId,
      {
        content,
      },
      { new: true, runValidators: true },
    ).exec();

    // Produce activity log for editing checklist
    await produceActivity({
      userId,
      activityType: "edit",
      object: "Checklist",
      objectId: checklistId,
    });
    console.log(`Activity log produced for checklist editing: ${checklistId}`);

    return {
      success: true,
      message: "Checklist updated successfully",
      data: updatedChecklist,
      error: null,
      metadata: {
        timestamp: Date.now(),
        checklistId,
        userId,
      },
    };
  } catch (error) {
    console.error(
      `Error updating checklist ${checklistId} for ${userId}`,
      error,
    );

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
            checklistId,
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
            timestamp: Date.now(),
            checklistId,
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
          timestamp: Date.now(),
          checklistId,
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
        timestamp: Date.now(),
        checklistId,
        userId,
      },
    };
  }
};

export default EditChecklistService;

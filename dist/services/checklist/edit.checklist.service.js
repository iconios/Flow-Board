// Edit Checklist Service
/*
#Plan:
1. Get and validate the checklist ID, board-owner ID, and board-member ID
2. Confirm that the checklist ID exists and that the caller is the board owner or a board member
3. Update the checklist and return the updated checklist to the caller
*/
import { MongooseError, Types } from "mongoose";
import { EditChecklistInputSchema, } from "../../types/checklist.type.js";
import Checklist from "../../models/checklist.model.js";
import Board from "../../models/board.model.js";
import BoardMember from "../../models/boardMember.model.js";
import { produceActivity } from "../../redis/activity.producer.js";
import { ZodError } from "zod";
const EditChecklistService = async (userId, editChecklistInput) => {
    try {
        // 1. Get and validate the checklist ID, board-owner ID, and board-member ID
        if (!userId?.trim()) {
            return {
                success: false,
                message: "Missing parameter",
                data: {},
                error: {
                    code: "MISSING_PARAMETER",
                    details: "Parameter missing",
                },
                metadata: {
                    timestamp: new Date().toISOString(),
                    userId,
                },
            };
        }
        if (!Types.ObjectId.isValid(userId)) {
            return {
                success: false,
                message: "Invalid user ID format",
                data: {},
                error: {
                    code: "INVALID_PARAMETER",
                    details: "Invalid user ID parameter",
                },
                metadata: {
                    timestamp: new Date().toISOString(),
                    userId,
                },
            };
        }
        const { checklistId, ...updateContent } = EditChecklistInputSchema.parse(editChecklistInput);
        if (!Types.ObjectId.isValid(checklistId)) {
            return {
                success: false,
                message: "Invalid checklist ID format",
                data: {},
                error: {
                    code: "INVALID_PARAMETER",
                    details: "Invalid checklist ID parameter",
                },
                metadata: {
                    timestamp: new Date().toISOString(),
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
                data: {},
                error: {
                    code: "NOT_FOUND",
                    details: "Checklist not found",
                },
                metadata: {
                    timestamp: new Date().toISOString(),
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
                data: {},
                error: {
                    code: "UNAUTHORIZED",
                    details: "Access denied",
                },
                metadata: {
                    timestamp: new Date().toISOString(),
                    checklistId,
                    userId,
                },
            };
        }
        // 3. Update the checklist and return the updated checklist to the caller
        const updatedChecklist = await Checklist.findByIdAndUpdate(checklistId, {
            ...updateContent,
        }, { new: true, runValidators: true }).exec();
        if (!updatedChecklist) {
            return {
                success: false,
                message: "Checklist not found during update",
                data: {},
                error: {
                    code: "NOT_FOUND",
                    details: "Checklist not found during update",
                },
                metadata: {
                    timestamp: new Date().toISOString(),
                    checklistId,
                    userId,
                },
            };
        }
        // Produce activity log for editing checklist
        void produceActivity({
            userId,
            activityType: "edit",
            object: "Checklist",
            objectId: checklistId,
        }).catch((err) => console.error(`Activity log failed for checklist editing: ${checklistId}`, err));
        return {
            success: true,
            message: "Checklist updated successfully",
            data: {
                id: updatedChecklist._id.toString(),
                taskId: updatedChecklist.taskId.toString(),
                userId: updatedChecklist.userId.toString(),
                boardId: updatedChecklist.boardId.toString(),
                content: updatedChecklist.content,
                checked: updatedChecklist.checked,
                createdAt: updatedChecklist.createdAt.toISOString(),
                updatedAt: updatedChecklist.updatedAt.toISOString(),
            },
            error: null,
            metadata: {
                timestamp: new Date().toISOString(),
                checklistId,
                userId,
            },
        };
    }
    catch (error) {
        console.error(`Error updating checklist for ${userId}`, error);
        if (error instanceof ZodError) {
            return {
                success: false,
                message: "Invalid input data",
                data: {},
                error: {
                    code: "INVALID_INPUT",
                    details: "Error validating input data",
                },
                metadata: {
                    timestamp: new Date().toISOString(),
                    userId,
                },
            };
        }
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
                        userId,
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
                        userId,
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
                    details: process.env.NODE_ENV === "development"
                        ? error.message
                        : "Error fetching data from database",
                },
                metadata: {
                    timestamp: new Date().toISOString(),
                    userId,
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
                details: process.env.NODE_ENV === "development"
                    ? error.message
                    : "An unexpected error occurred",
            },
            metadata: {
                timestamp: new Date().toISOString(),
                userId,
            },
        };
    }
};
export default EditChecklistService;
//# sourceMappingURL=edit.checklist.service.js.map
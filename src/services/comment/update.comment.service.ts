/*
#Plan:
1. Get and validate the comment ID and updateData
2. Verify that the user owns the comment
3. Update the comment
3. Send the updated comment for the task to the user
*/

import { MongooseError, Types } from "mongoose";
import {
  UpdateCommentInputSchema,
  type UpdateCommentInputType,
  type UpdateCommentOutputType,
} from "../../types/comment.type.js";
import Comment from "../../models/comment.model.js";
import { ZodError } from "zod";

const UpdateCommentService = async (
  userId: string,
  commentId: string,
  updateData: UpdateCommentInputType,
): Promise<UpdateCommentOutputType> => {
  try {
    // 1. Get and validate the comment ID
    const comment = commentId.trim();
    if (!Types.ObjectId.isValid(comment)) {
      return {
        success: false,
        message: "Invalid comment ID format",
      };
    }

    const validatedInput = UpdateCommentInputSchema.parse(updateData);

    // 2. Verify that the user owns the comment
    // 3. Update the comment
    const userOwnsCommentAndUpdated = await Comment.findOneAndUpdate(
      {
        _id: comment,
        userId,
      },
      { $set: validatedInput, $currentDate: { updatedAt: true }
      },
      {
        new: true, runValidators: true
      },
    ).exec();
    if (!userOwnsCommentAndUpdated) {
      return {
        success: false,
        message: "No comments updated",
      };
    }

    return {
      success: true,
      message: "Comment updated successfully",
      comment: {
        id: userOwnsCommentAndUpdated._id.toString(),
        content: userOwnsCommentAndUpdated.content,
        userId: userOwnsCommentAndUpdated.userId.toString(),
        taskId: userOwnsCommentAndUpdated.taskId.toString(),
        createdAt: userOwnsCommentAndUpdated.createdAt.toISOString(),
        updatedAt: userOwnsCommentAndUpdated.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Error updating comment", error);

    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Error validating comment data",
      };
    }

    if (error instanceof MongooseError) {
      return {
        success: false,
        message: "Database error while updating comment",
      };
    }

    return {
      success: false,
      message: "Unknown error. Please try again",
    };
  }
};

export default UpdateCommentService;

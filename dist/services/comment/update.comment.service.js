/*
#Plan:
1. Get and validate the comment ID and updateData
2. Verify that the user owns the comment
3. Update the comment
3. Send the updated comment for the task to the user
*/
import { MongooseError, Types } from "mongoose";
import { UpdateCommentInputSchema } from "../../types/comment.type.js";
import Comment from "../../models/comment.model.js";
import { ZodError } from "zod";
const UpdateCommentService = async (userId, commentId, updateData) => {
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
    const commentToUpdate = await Comment.findById(comment)
      .select("userId")
      .lean()
      .exec();
    if (!commentToUpdate) {
      return {
        success: false,
        message: "Comment not found",
      };
    }
    if (commentToUpdate.userId.toString() !== userId) {
      return {
        success: false,
        message: "Only comment creator can update comment",
      };
    }
    // 3. Update the comment
    const userOwnsCommentAndUpdated = await Comment.findOneAndUpdate(
      {
        _id: comment,
        userId,
      },
      { $set: validatedInput, $currentDate: { updatedAt: true } },
      {
        new: true,
        runValidators: true,
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
//# sourceMappingURL=update.comment.service.js.map

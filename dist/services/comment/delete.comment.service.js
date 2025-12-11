/*
#Plan:
1. Get and validate the comment ID
2. Verify the user owns the comment and delete the comment
3. Send the status of the deleted comment to user
*/
import { MongooseError, Types } from "mongoose";
import Comment from "../../models/comment.model.js";
const DeleteCommentService = async (userId, commentId) => {
  try {
    // 1. Get and validate the comment ID
    const trimmedCommentId = commentId.trim();
    if (!Types.ObjectId.isValid(trimmedCommentId)) {
      return {
        success: false,
        message: "Invalid comment ID format",
      };
    }
    // 2. Verify the user owns the comment and delete the comment
    const deletedComment = await Comment.findOneAndDelete({
      _id: trimmedCommentId,
      userId,
    }).exec();
    if (!deletedComment) {
      return {
        success: false,
        message: "Comment not found",
      };
    }
    // 3. Send the status of the deleted comment to user
    return {
      success: true,
      message: "Comment deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting comment", error);
    if (error instanceof MongooseError) {
      return {
        success: false,
        message: "Error while deleting comment",
      };
    }
    return {
      success: false,
      message: "Unknown error. Please try again",
    };
  }
};
export default DeleteCommentService;
//# sourceMappingURL=delete.comment.service.js.map

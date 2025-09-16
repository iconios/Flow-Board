/*
#Plan:
1. Get and validate the task ID
2. Verify that the user owns the task
3. Send the comments for the task to the user
*/

import { MongooseError, Types } from "mongoose";
import List from "../../models/list.model.js";
import Comment from "../../models/comment.model.js";
import type { ReadCommentOutputType } from "../../types/comment.type.js";

const ReadCommentService = async (
  userId: string,
  taskId: string,
): Promise<ReadCommentOutputType> => {
  try {
    // 1. Get and validate the task ID
    const task = taskId.trim();
    if (!Types.ObjectId.isValid(task)) {
      return {
        success: false,
        message: "Invalid task ID format",
      };
    }

    // 2. Verify that the user owns the task
    const userOwnsTask = await List.findOne({
      tasks: task,
      userId,
    }).exec();
    if (!userOwnsTask) {
      return {
        success: false,
        message: "Task not found",
      };
    }

    // 3. Send the comments for the task to the user
    const userComments = await Comment.find({
      taskId,
      userId,
    })
      .sort({ updatedAt: -1 })
      .exec();
    const commentsToReturn = userComments.map((comment) => ({
      id: comment._id.toString(),
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    }));

    return {
      success: true,
      message:
        commentsToReturn.length > 0 ? "Comments found" : "No comments found",
      comments: commentsToReturn,
      count: commentsToReturn.length,
    };
  } catch (error) {
    console.error("Error while fetching the comments", error);

    if (error instanceof MongooseError) {
      return {
        success: false,
        message: "Database error while fetching the comments",
      };
    }

    return {
      success: false,
      message: "Unknown error. Please try again",
    };
  }
};

export default ReadCommentService;

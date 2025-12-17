/*
#Plan:
1. Get and validate the comment data
2. Verify the user owns the task or is a board member
3. Create the comment
4. Send the details of the created comment to user
*/

import { MongooseError, Types } from "mongoose";
import {
  CreateCommentInputSchema,
  type CreateCommentInputType,
  type CreateCommentOutputType,
} from "../../types/comment.type.js";
import List from "../../models/list.model.js";
import Comment from "../../models/comment.model.js";
import { ZodError } from "zod";
import BoardMember from "../../models/boardMember.model.js";
import { produceActivity } from "../../redis/activity.producer.js";

const CreateCommentService = async (
  userId: string,
  taskId: string,
  commentData: CreateCommentInputType,
): Promise<CreateCommentOutputType> => {
  try {
    // 1. Get and validate the comment data
    const validatedInput = CreateCommentInputSchema.parse(commentData);
    const content = validatedInput.content;

    // 2. Verify the user owns the task or is a board member
    const task = taskId.trim();
    if (!Types.ObjectId.isValid(task)) {
      return {
        success: false,
        message: "Invalid task ID format",
      };
    }

    const [userOwnsList, userIsBoardMember] = await Promise.all([
      List.findOne({
        tasks: task,
        userId,
      })
        .lean()
        .exec(),
      BoardMember.findOne({ user_id: userId }).lean().exec(),
    ]);
    if (!userOwnsList && !userIsBoardMember) {
      return {
        success: false,
        message: "Task not found",
      };
    }

    // 3. Create the comment
    const newComment = new Comment({
      content,
      userId,
      taskId,
    });

    const commentCreated = await newComment.save();

    // Produce activity log for creating comment
    await produceActivity({
      userId,
      activityType: "create",
      object: "Comment",
      objectId: commentCreated._id.toString(),
    });
    console.log(`Activity log produced for comment creation: ${commentCreated._id.toString()}`);

    // 4. Send the details of the created comment to user
    return {
      success: true,
      message: "Comment created successfully",
      comment: {
        id: commentCreated._id.toString(),
        content: commentCreated.content,
        userId: commentCreated.userId.toString(),
        taskId: commentCreated.taskId.toString(),
        createdAt: commentCreated.createdAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Error creating comment", error);

    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Error validating comment data",
      };
    }

    if (error instanceof MongooseError) {
      return {
        success: false,
        message: "Database error while creating comment",
      };
    }

    return {
      success: false,
      message: "Unknown error. Please try again",
    };
  }
};

export default CreateCommentService;

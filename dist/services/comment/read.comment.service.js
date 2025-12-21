/*
#Plan:
1. Get and validate the task ID
2. Verify that the user owns the task or is a board member
3. Send the comments for the task to the user
*/
import { MongooseError, Types } from "mongoose";
import List from "../../models/list.model.js";
import Comment from "../../models/comment.model.js";
import BoardMember from "../../models/boardMember.model.js";
import GetBoardId from "../../utils/get.boardId.util.js";
const ReadCommentService = async (userId, taskId) => {
    try {
        // 1. Get and validate the task ID
        const task = taskId.trim();
        if (!Types.ObjectId.isValid(task)) {
            return {
                success: false,
                message: "Invalid task ID format",
            };
        }
        // 2. Verify that the user owns the task or is a board member
        const boardId = (await GetBoardId({ taskId: task })).board?.id;
        if (!boardId) {
            return {
                success: false,
                message: "No board found for task",
            };
        }
        const userOwnsTask = await List.findOne({
            tasks: task,
            userId,
        })
            .select("_id")
            .lean()
            .exec();
        const userIsBoardMember = await BoardMember.findOne({
            user_id: userId,
            board_id: boardId,
        })
            .select("_id")
            .lean()
            .exec();
        if (!userOwnsTask && !userIsBoardMember) {
            return {
                success: false,
                message: "Access denied",
            };
        }
        // 3. Send the comments for the task to the requesting-user
        const userComments = await Comment.find({
            taskId,
        })
            .sort({ updatedAt: -1 })
            .exec();
        const commentsToReturn = userComments.map((comment) => ({
            id: comment._id.toString(),
            content: comment.content,
            createdAt: comment.createdAt.toISOString(),
            updatedAt: comment.updatedAt.toISOString(),
            taskId: comment.taskId.toString(),
            userId: comment.userId.toString(),
        }));
        return {
            success: true,
            message: commentsToReturn.length > 0 ? "Comments found" : "No comments found",
            comments: commentsToReturn,
            count: commentsToReturn.length,
        };
    }
    catch (error) {
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
//# sourceMappingURL=read.comment.service.js.map
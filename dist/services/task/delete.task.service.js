/*
#Plan:
1. Accept and validate the task and board member
2. Verify that the user owns the task's list or is a board member
3. Remove the task id from its associated list
4. Delete the task
5. Delete the comments for the task
6. Send the deleted task data to user
*/
import mongoose, { MongooseError, Types } from "mongoose";
import List from "../../models/list.model.js";
import Task from "../../models/task.model.js";
import BoardMember from "../../models/boardMember.model.js";
import GetBoardId from "../../utils/get.boardId.util.js";
import Comment from "../../models/comment.model.js";
const DeleteTaskService = async (userId, taskId) => {
  // 1. Accept and validate the task and board member
  const task = taskId.trim();
  if (!task) {
    return {
      success: false,
      message: "Task ID not found",
    };
  }
  if (!Types.ObjectId.isValid(task)) {
    return {
      success: false,
      message: "Invalid task ID format",
    };
  }
  const board = await GetBoardId({ taskId: task });
  const boardId = board.board?.id;
  if (!boardId) {
    return {
      success: false,
      message: board.message ?? "Board ID not found",
    };
  }
  const session = await mongoose.startSession();
  let result = null;
  try {
    await session.withTransaction(async () => {
      // 2. Verify that the user owns the task's list or is a board member
      const userOwnsTask = await List.findOne({ tasks: task, userId })
        .select("_id")
        .lean()
        .session(session);
      const userIsBoardMember = await BoardMember.findOne({
        user_id: userId,
        board_id: boardId,
      })
        .select("_id")
        .lean()
        .session(session);
      if (!userOwnsTask && !userIsBoardMember) {
        throw new Error("Task not found or access denied");
      }
      // 3. Remove the task id from its associated list
      const taskRemovedFromList = await List.findOneAndUpdate(
        { tasks: task },
        { $pull: { tasks: task } },
      )
        .select("_id")
        .lean()
        .session(session);
      if (!taskRemovedFromList) {
        throw new Error("List not found for Task");
      }
      // 4. Delete the task
      const taskDeleted = await Task.findByIdAndDelete(task).session(session);
      if (!taskDeleted) {
        throw new Error("Task not deleted");
      }
      // 5. Delete the comments for the task
      await Comment.deleteMany({ taskId: task }).session(session);
      // 6. Send the deleted task data to user
      result = {
        success: true,
        message: "Task deleted successfully",
        task: {
          id: taskDeleted._id.toString(),
          title: taskDeleted.title,
          description: taskDeleted.description ?? "",
          dueDate: taskDeleted.dueDate?.toISOString() ?? "",
          priority: taskDeleted.priority,
          position: taskDeleted.position ?? 0,
          listId: taskDeleted.listId?.toString() ?? "",
        },
      };
    });
    if (!result) {
      throw new Error("Task deletion completed but returned nothing");
    }
    return result;
  } catch (error) {
    console.error("Error deleting the task", error);
    if (error instanceof MongooseError) {
      return {
        success: false,
        message: "Database error while deleting task",
      };
    }
    if (error instanceof Error) {
      if (error.message === "Task not found or access denied") {
        return {
          success: false,
          message: "Task not found or access denied",
        };
      }
      if (error.message === "List not found for Task") {
        return {
          success: false,
          message: "List not found for Task",
        };
      }
      if (error.message === "Task not deleted") {
        return {
          success: false,
          message: "Task not deleted",
        };
      }
      if (error.message === "Task deletion completed but returned nothing") {
        return {
          success: false,
          message: "Task deletion completed but returned nothing",
        };
      }
    }
    return {
      success: false,
      message: "Unknown error. Please try again",
    };
  } finally {
    await session.endSession();
  }
};
export default DeleteTaskService;
//# sourceMappingURL=delete.task.service.js.map

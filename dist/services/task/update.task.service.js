/*
#Plan:
1. Get and validate the task, update data, board Id and user Id
2. Verify that the user owns the task's list or is a board member
3. If list Id is available:
  3a. Validate the list Id
  3b. Verify that the update list Id is different from DB list Id
  3c. Remove the task Id from its current list
  3d. Add the task Id to the new list
4. Update the task
5. Send the updated task to the user
*/
import { MongooseError, startSession, Types } from "mongoose";
import { UpdateTaskInputSchema } from "../../types/task.type.js";
import List from "../../models/list.model.js";
import Task from "../../models/task.model.js";
import { ZodError } from "zod";
import GetBoardId from "../../utils/get.boardId.util.js";
import BoardMember from "../../models/boardMember.model.js";
const UpdateTaskService = async (userId, taskId, updateData) => {
  try {
    // 1. Get and validate the task, update data, board Id and user Id
    const validatedInput = UpdateTaskInputSchema.parse(updateData);
    const task = taskId.trim();
    if (!Types.ObjectId.isValid(task)) {
      return {
        success: false,
        message: "Invalid Task ID format",
      };
    }
    const board = await GetBoardId({ taskId: task });
    const boardId = board.board?.id;
    if (!boardId) {
      return {
        success: false,
        message: board.message ?? "Board for task not found",
      };
    }
    // 2. Verify that the user owns the task's list or is a board member
    const listWithUser = await List.findOne({
      tasks: task,
      userId,
    })
      .lean()
      .exec();
    const userIsBoardMember = await BoardMember.findOne({
      user_id: userId,
      board_id: boardId,
    })
      .lean()
      .exec();
    if (!listWithUser && !userIsBoardMember) {
      return {
        success: false,
        message: "Task not found or access denied",
      };
    }
    // 3. If list Id is available:
    // 3a. Validate the list Id
    const listId = validatedInput.listId;
    if (listId && !Types.ObjectId.isValid(listId)) {
      return {
        success: false,
        message: "Invalid list ID format",
      };
    }
    // 3b. Verify that the update list Id is different from DB list Id
    const listForTask = await Task.findById(task)
      .select("listId")
      .lean()
      .exec();
    if (!listForTask || !listForTask.listId) {
      return {
        success: false,
        message: "Task has no current list",
      };
    }
    if (listId && listForTask.listId?.toString() !== listId) {
      const session = await startSession();
      let result = null;
      try {
        await session.withTransaction(async () => {
          // 3c. Remove the task from its current list
          const removeTaskList = await List.updateOne(
            {
              _id: listForTask.listId,
            },
            {
              $pull: { tasks: task },
            },
          )
            .session(session)
            .exec();
          if (!removeTaskList || removeTaskList.modifiedCount === 0) {
            throw new Error("Task update failed");
          }
          // 3d. Add the task Id to the new list
          const addTaskList = await List.updateOne(
            {
              _id: listId,
            },
            {
              $addToSet: { tasks: task },
            },
          )
            .session(session)
            .exec();
          if (!addTaskList || addTaskList.modifiedCount === 0) {
            throw new Error("Task update failed");
          }
          // Update the task
          const { listId: _omit, ...rest } = validatedInput;
          const newUpdateData = {
            ...rest,
            listId,
          };
          const updatedTask = await Task.findByIdAndUpdate(
            task,
            newUpdateData,
            { new: true, runValidators: true },
          )
            .session(session)
            .exec();
          if (!updatedTask) {
            throw new Error("Error while updating task");
          }
          // 4. Send the updated task to the user
          result = {
            success: true,
            message: "Task updated successfully",
            task: {
              id: updatedTask._id.toString(),
              title: updatedTask.title,
              description: updatedTask.description ?? "",
              dueDate: updatedTask.dueDate?.toISOString() ?? "",
              priority: updatedTask.priority,
              position: updatedTask.position ?? 0,
              listId: updatedTask.listId?.toString() ?? "",
            },
          };
        });
        if (!result) {
          throw new Error("Transaction completed but no result was returned");
        }
        return result;
      } catch (error) {
        console.error("Error while updating task in transaction", error);
        if (error instanceof MongooseError) {
          return {
            success: false,
            message: "Database error while updating task",
          };
        }
        if (error instanceof Error) {
          if (
            error.message === "Transaction completed but no result was returned"
          ) {
            return {
              success: false,
              message: "Transaction completed but no result was returned",
            };
          }
          if (error.message === "Task update failed") {
            return {
              success: false,
              message: "Task update failed",
            };
          }
          if (error.message === "Error while updating task") {
            return {
              success: false,
              message: "Error while updating task",
            };
          }
        }
      } finally {
        await session.endSession();
      }
    }
    // Update the task
    const { listId: _ignore, ...restNoMove } = validatedInput;
    const updatedTask = await Task.findByIdAndUpdate(task, restNoMove, {
      new: true,
      runValidators: true,
    }).exec();
    if (!updatedTask) {
      return {
        success: false,
        message: "Error while updating task",
      };
    }
    // 4. Send the updated task to the user
    return {
      success: true,
      message: "Task updated successfully",
      task: {
        id: updatedTask._id.toString(),
        title: updatedTask.title,
        description: updatedTask.description ?? "",
        dueDate: updatedTask.dueDate?.toISOString() ?? "",
        priority: updatedTask.priority,
        position: updatedTask.position ?? 0,
        listId: updatedTask.listId?.toString() ?? "",
      },
    };
  } catch (error) {
    console.error("Error while updating task", error);
    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Error while validating task data",
      };
    }
    if (error instanceof MongooseError) {
      return {
        success: false,
        message: "Error while updating task",
      };
    }
    return {
      success: false,
      message: "Unknown error. Please try again",
    };
  }
};
export default UpdateTaskService;
//# sourceMappingURL=update.task.service.js.map

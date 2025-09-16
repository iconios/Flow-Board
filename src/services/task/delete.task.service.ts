/*
#Plan:
1. Accept and validate the task's list
2. Verify that the user owns the task's list
3. Remove the task id from its associated list
4. Delete the task
5. Send the deleted task data to user
*/

import mongoose, { MongooseError, Types } from "mongoose";
import List from "../../models/list.model.js";
import Task from "../../models/task.model.js";
import type { DeleteTaskOutputType } from "../../types/task.type.js";

const DeleteTaskService = async (
  userId: string,
  taskId: string,
): Promise<DeleteTaskOutputType> => {
  // 1. Accept and validate the task's list
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

  const session = await mongoose.startSession();
  let result: DeleteTaskOutputType | null = null;

  try {
    await session.withTransaction(async () => {
      // 2. Verify that the user owns the task's list
      const taskObjectId = new Types.ObjectId(task);

      // 3. Verify that the user owns the task's list and Remove the task id from its associated list
      const taskRemovedFromList = await List.findOneAndUpdate(
        { tasks: taskObjectId, userId },
        { $pull: { tasks: taskObjectId } },
        { new: true },
      )
        .session(session)
        .exec();
      if (!taskRemovedFromList) {
        throw new Error("Task not found");
      }

      // 4. Delete the task
      const taskDeleted = await Task.findByIdAndDelete(taskObjectId)
        .session(session)
        .exec();
      if (!taskDeleted) {
        throw new Error("Task not deleted");
      }

      // 5. Send the deleted task data to user
      result = {
        success: true,
        message: "Task deleted successfully",
        task: {
          id: taskObjectId.toString(),
          title: taskDeleted.title,
          description: taskDeleted.description ?? "",
          dueDate: taskDeleted.dueDate?.toISOString() ?? "",
          priority: taskDeleted.priority,
          position: taskDeleted.position ?? 0,
          listId: taskRemovedFromList._id.toString(),
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
      if (error.message === "Task not found") {
        return {
          success: false,
          message: "Task not found",
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

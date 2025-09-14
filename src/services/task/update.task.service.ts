/*
#Plan:
1. Get and validate the task Id, task update data and user Id
2. Verify that the task's list with the user exists and update the task
3. Send the updated task to the user
*/

import { MongooseError, Types } from "mongoose";
import {
  UpdateTaskInputSchema,
  type UpdateTaskInputType,
} from "../../types/task.type.js";
import List from "../../models/list.model.js";
import Task from "../../models/task.model.js";
import { ZodError } from "zod";

const UpdateTaskService = async (
  userId: string,
  taskId: string,
  updateData: UpdateTaskInputType,
) => {
  try {
    // 1. Get and validate the task Id, task update data and user Id
    const validatedInput = UpdateTaskInputSchema.parse(updateData);
    if (!validatedInput) {
      return {
        success: false,
        message: "Empty update data",
      };
    }

    const task = taskId.trim();
    if (!Types.ObjectId.isValid(task)) {
      return {
        success: false,
        message: "Invalid Task ID format",
      };
    }

    const taskObjectId = new Types.ObjectId(task);

    // 2. Verify that the task's list with the user exists and update the task
    const listWithUser = await List.exists({
      tasks: taskObjectId,
      userId,
    });
    if (!listWithUser) {
      return {
        success: false,
        message: "Task cannot be updated",
      };
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskObjectId,
      validatedInput,
      { new: true },
    );
    if (!updatedTask) {
      return {
        success: false,
        message: "Error while updating task",
      };
    }

    // 3. Send the updated task to the user
    return {
      success: true,
      message: "Task updated successfully",
      task: {
        id: updatedTask._id.toString(),
        title: updatedTask.title,
        description: updatedTask.description,
        dueDate: updatedTask.dueDate?.toISOString(),
        priority: updatedTask.priority,
        position: updatedTask.position,
        listId: updatedTask.listId,
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

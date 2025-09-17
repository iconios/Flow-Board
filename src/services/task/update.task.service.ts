/*
#Plan:
1. Get and validate the task task update data and user Id
2. Verify that the task's list with the user exists and update the task
3. If list Id is available:
  3a. Validate the list Id
  3b. Verify that the list Id is different from previous
  3c. Remove the task Id from its current list
  3d. Add the task Id to the new list
4. Send the updated task to the user
*/

import { MongooseError, startSession, Types } from "mongoose";
import {
  UpdateTaskInputSchema,
  type UpdateTaskInputType,
  type UpdateTaskOutputType,
} from "../../types/task.type.js";
import List from "../../models/list.model.js";
import Task from "../../models/task.model.js";
import { ZodError } from "zod";

const UpdateTaskService = async (
  userId: string,
  taskId: string,
  updateData: UpdateTaskInputType,
): Promise<UpdateTaskOutputType> => {
  try {
    // 1. Get and validate the taskId, task update data and user Id
    const validatedInput = UpdateTaskInputSchema.parse(updateData);

    const task = taskId.trim();
    if (!Types.ObjectId.isValid(task)) {
      return {
        success: false,
        message: "Invalid Task ID format",
      };
    }

    const taskObjectId = new Types.ObjectId(task);

    // 2. Verify that the task's list with the user exists and update the task
    const listWithUser = await List.findOne({
      tasks: taskObjectId,
      userId,
    }).exec();
    if (!listWithUser) {
      return {
        success: false,
        message: "Task cannot be updated",
      };
    }

    // 3. If list Id is available:
    // 3a. Validate the list Id
    const listId = validatedInput.listId;
    if (listId && !Types.ObjectId.isValid(listId)) {
      return {
        success: false,
        message: "Invalid list ID format"
      }
    }

    // 3b. Verify that the list Id is different from previous
    if (listId && !listWithUser._id.equals(listId)) {
      const session = await startSession();
      let result: UpdateTaskOutputType | null = null;

      try {
        await session.withTransaction(async () => {

          // Verify that the target list is owned by user
          const targetListOwnedByUser = await List.findOne({
            _id: listId,
            userId
          }).lean().session(session);
          if (!targetListOwnedByUser) {
            throw new Error("Target list not found")
          }

          // 3c. Remove the task from its current list
          const removeTaskList = await List.updateOne(
            {
              _id: listWithUser._id,
              userId
            },
            {
              $pull: { tasks: taskObjectId }
            }
          ).session(session).exec();
          if (removeTaskList.modifiedCount === 0) {
            throw new Error("Task update failed");
          }

          // 3d. Add the task Id to the new list
          const addTaskList = await List.updateOne(
            {
              _id: listId,
              userId
            },
            {
              $addToSet: { tasks: taskObjectId }
            }
          ).session(session).exec();
          if (addTaskList.modifiedCount === 0) {
            throw new Error("Task update failed");
          }

          // Update the task
          const { listId: _omit, ...rest } = validatedInput;
          const newUpdateData = {
            ...rest,
            listId: listId
          }
          const updatedTask = await Task.findByIdAndUpdate(
            taskObjectId,
            newUpdateData,
            { new: true, runValidators: true },
          ).session(session);
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
              listId: listId,
            },
          };          
        })
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
          if (error.message === "Transaction completed but no result was returned") {
            return {
              success: false,
              message: "Transaction completed but no result was returned"
            }
          }

          if (error.message === "Target list not found") {
            return {
              success: false,
              message: "Target list not found"
            }
          }

          if (error.message === "Task update failed") {
            return {
              success: false,
              message: "Task update failed"
            }
          }

          if (error.message === "Error while updating task") {
            return {
              success: false,
              message: "Error while updating task"
            }
          }
          
        }
      } finally {
        await session.endSession();
      }
    }

    // Update the task
    const { listId: _ignore, ...restNoMove} = validatedInput;
    const updatedTask = await Task.findByIdAndUpdate(
      taskObjectId,
      restNoMove,
      { new: true, runValidators: true },
    );
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
        listId: listWithUser._id.toString(),
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

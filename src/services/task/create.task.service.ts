/*
#Plan:
1. Get and validate the task data, board ID and user ID
2. Verify that the user owns the list or is a board member
3. Create the task and add the task id to the list's tasks array
4. Send the details of the new task to the client
*/

import mongoose, { MongooseError, Types } from "mongoose";
import {
  CreateTaskInputSchema,
  type CreateTaskInputType,
  type CreateTaskOutputType,
} from "../../types/task.type.js";
import { ZodError } from "zod";
import Task from "../../models/task.model.js";
import List from "../../models/list.model.js";
import GetBoardId from "../../utils/get.boardId.util.js";
import BoardMember from "../../models/boardMember.model.js";

const CreateTaskService = async (
  userId: string,
  createTaskData: CreateTaskInputType,
): Promise<CreateTaskOutputType> => {
  // 1. Get and validate the task data, board ID and user ID
  let listId;
  let validatedInput: CreateTaskInputType;
  try {
    validatedInput = CreateTaskInputSchema.parse(createTaskData);
    listId = validatedInput.listId.trim();
    if (!Types.ObjectId.isValid(listId)) {
      return {
        success: false,
        message: "Invalid list ID format",
      };
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Error validating task data",
      };
    }

    return {
      success: false,
      message: "Error",
    };
  }

  const listObjectId = new Types.ObjectId(listId);
  const boardId = (await GetBoardId({ listId })).board?.id;
  if (!boardId) {
    return {
      success: false,
      message: "No board found for list",
    };
  }

  const session = await mongoose.startSession();
  let result: CreateTaskOutputType | null = null;

  try {
    await session.withTransaction(async () => {
      // 2. Verify that the user owns the list or is a board member
      const userOwnsList = await List.findOne({
        _id: listObjectId,
        userId,
      })
        .select("_id")
        .lean()
        .session(session)
        .exec();

      const userIsBoardMember = await BoardMember.findOne({
        user_id: userId,
        board_id: boardId,
      })
        .select("_id")
        .session(session)
        .lean()
        .exec();

      if (!userOwnsList && !userIsBoardMember) {
        throw new Error("Task not found or access denied");
      }

      // 3. Create the task and add the task id to the list's tasks array
      const newTaskData = new Task(validatedInput);
      const taskCreated = await newTaskData.save({ session });
      if (!taskCreated) {
        throw new Error("No task created");
      }

      const taskAddedToList = await List.findByIdAndUpdate(listObjectId, {
        $addToSet: { tasks: taskCreated._id },
      })
        .session(session)
        .exec();
      if (!taskAddedToList) {
        throw new Error("Error while creating task");
      }

      // 4. Send the details of the new task to the client
      result = {
        success: true,
        message: "Task created successfully",
        task: {
          id: taskCreated._id.toString(),
          title: taskCreated.title,
          listId: listObjectId.toString(),
          priority: taskCreated.priority,
          description: taskCreated.description ?? "",
          dueDate: taskCreated.dueDate?.toISOString() ?? "",
          position: taskCreated.position ?? 0,
        },
      };
    });

    if (!result) {
      throw new Error("Task created successfully but returned nothing");
    }

    return result;
  } catch (error) {
    console.error("Error while creating task", error);

    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Error while validating task data",
      };
    }

    if (error instanceof MongooseError) {
      return {
        success: false,
        message: "Error while creating new task",
      };
    }

    if (error instanceof Error) {
      if (error.message === "Task not found or access denied") {
        return {
          success: false,
          message: "Task not found or access denied",
        };
      }

      if (error.message === "No task created") {
        return {
          success: false,
          message: "No task created",
        };
      }

      if (error.message === "Error while creating task") {
        return {
          success: false,
          message: "Error while creating task",
        };
      }

      if (error.message === "Task created successfully but returned nothing") {
        return {
          success: false,
          message: "Task created successfully but returned nothing",
        };
      }

      return {
        success: false,
        message: "Error creating task",
      };
    }

    return {
      success: false,
      message: "Unknown error. Please try again",
    };
  } finally {
    await session.endSession();
  }
};

export default CreateTaskService;

/*
#Plan:
1. Get and validate the list ID
2. Get the tasks associated with the list
3. Send the tasks to the user
*/

import mongoose, { MongooseError, Types } from "mongoose";
import List from "../../models/list.model.js";

const ReadTaskService = async (user: string, list: string) => {
  try {
    // 1. Get and validate the list ID
    const listId = list.trim();
    if (!listId) {
      return {
        success: false,
        message: "List ID required",
      };
    }

    if (!Types.ObjectId.isValid(listId)) {
      return {
        success: false,
        message: "Invalid list ID format",
      };
    }

    const userId = user.trim();
    const listObjectId = new mongoose.Types.ObjectId(listId);

    // 2. Get the tasks associated with the list
    const userOwnsList = await List.findOne({
      _id: listObjectId,
      userId,
    })
      .populate("tasks")
      .exec();
    if (!userOwnsList) {
      return {
        success: false,
        message: "List associated with the tasks not found",
      };
    }
    const tasks = userOwnsList.tasks;
    if (!tasks || tasks.length === 0) {
      return {
        success: true,
        message: "No task(s) not found",
      };
    }

    // 3. Send the tasks to the user
    return {
      success: true,
      message: `${tasks?.length} task(s) found`,
      tasks: tasks,
    };
  } catch (error) {
    console.error("Error fetching tasks", error);

    if (error instanceof MongooseError) {
      return {
        success: false,
        message: "Error while fetching task data",
      };
    }

    return {
      success: false,
      message: "Unknown error. Please try again",
    };
  }
};

export default ReadTaskService;

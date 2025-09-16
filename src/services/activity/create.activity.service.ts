/*
#Plan:
1. Get and validate the user id and other activity data
2. Verify that the activity's object exists
3. Create the activity log
*/

import { ZodError } from "zod";
import Activity from "../../models/activity.model.js";
import {
  CreateActivityInputSchema,
  type CreateActivityInputType,
  type CreateActivityOutputType,
} from "../../types/activity.type.js";
import { MongooseError, Types } from "mongoose";
import Board from "../../models/board.model.js";
import Task from "../../models/task.model.js";

const CreateActivityService = async (
  userId: string,
  activityData: CreateActivityInputType,
): Promise<CreateActivityOutputType> => {
  try {
    // 1. Get and validate the user id and other activity data
    const validatedInput = CreateActivityInputSchema.parse(activityData);
    const objectId = validatedInput.objectId;
    if (!Types.ObjectId.isValid(objectId)) {
      return {
        success: false,
        message: "Invalid object ID format",
      };
    }

    // 2. Verify that the activity's object exists
    const object = validatedInput.object;
    if (object === "Board") {
      const boardObjectExists = await Board.exists({
        _id: objectId,
        user_id: userId,
      }).exec();
      if (!boardObjectExists) {
        return {
          success: false,
          message: "Board not found",
        };
      }
    }

    if (object === "Task") {
      const taskObjectExists = await Task.exists({
        _id: objectId,
        user_id: userId,
      }).exec();
      if (!taskObjectExists) {
        return {
          success: false,
          message: "Task not found",
        };
      }
    }

    // 3. Create the activity log
    const newActivity = new Activity({
      userId,
      ...validatedInput,
    });

    const savedActivity = await newActivity.save();

    console.log(
      `Success: Activity log type - ${savedActivity.activityType} for user - ${userId} on object - ${savedActivity.object} created`,
    );
    return {
      success: true,
      message: `Success: Activity log type - ${savedActivity.activityType} for user - ${userId} on object - ${savedActivity.object} created`,
    };
  } catch (error) {
    console.error("Error creating activity", error);

    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Error validating activity data",
      };
    }

    if (error instanceof MongooseError) {
      return {
        success: false,
        message: "Database error while creating activity log",
      };
    }

    return {
      success: false,
      message: "Unknown error. Please try again",
    };
  }
};

export default CreateActivityService;

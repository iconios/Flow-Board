/*
#Plan:
1. Get, verify and validate the user id
2. Get and validate the object and the objectId
2. Send the activity logs to the user
*/

import Activity from "../../models/activity.model.js";
import User from "../../models/user.model.js";
import { MongooseError, Types } from "mongoose";
import {
  ReadActivityInputSchema,
  type ReadActivityInputType,
  type ReadActivityOutputType,
} from "../../types/activity.type.js";
import Board from "../../models/board.model.js";
import List from "../../models/list.model.js";

const ReadActivityService = async (
  userId: string,
  activityData: ReadActivityInputType,
): Promise<ReadActivityOutputType> => {
  try {
    // 1. Get, verify and validate the user id
    const userExists = await User.exists({ _id: userId }).exec();
    if (!userExists) {
      return {
        success: false,
        message: "User does not exist",
      };
    }

    // 2. Get and validate the object and the objectId
    const validatedInput = ReadActivityInputSchema.parse(activityData);
    const object = validatedInput.object;
    const objectId = validatedInput.objectId;

    if (!Types.ObjectId.isValid(objectId)) {
      return {
        success: false,
        message: "Invalid Object ID format",
      };
    }

    if (object === "Board") {
      const boardExists = await Board.findOne({
        _id: objectId,
        user_id: userId,
      });
      if (!boardExists) {
        return {
          success: false,
          message: "Board does not exist",
        };
      }
    }

    if (object === "Task") {
      const taskList = await List.findOne({ tasks: objectId, userId })
        .select("_id")
        .exec();
      if (!taskList) {
        return {
          success: false,
          message: "Task does not exist",
        };
      }
    }

    // 3. Send the activity logs to the user
    const userActivity = await Activity.find({
      userId,
      object,
      objectId,
    }).exec();
    const userActivityToReturn = userActivity.map((activity) => ({
      activityType: activity.activityType,
      object: activity.object,
      objectId: activity.objectId.toString(),
      createdAt: activity.createdAt.toISOString(),
    }));

    return {
      success: true,
      message:
        userActivityToReturn.length === 0
          ? "No activity logs found"
          : "Activity logs found",
      activities: userActivityToReturn,
    };
  } catch (error) {
    console.error("Error reading activity log", error);

    if (error instanceof MongooseError) {
      return {
        success: false,
        message: "Error while fetching activity logs ",
      };
    }

    return {
      success: false,
      message: "Unknown error. Please try again",
    };
  }
};

export default ReadActivityService;

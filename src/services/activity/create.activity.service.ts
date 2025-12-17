/*
#Plan:
1. Get and validate the user id and other activity data
2. Create the activity log
*/

import { ZodError } from "zod";
import Activity from "../../models/activity.model.js";
import {
  CreateActivityInputSchema,
  type CreateActivityInputType,
  type CreateActivityOutputType,
} from "../../types/activity.type.js";
import { MongooseError, Types } from "mongoose";

const CreateActivityService = async (
  userId: string,
  activityData: CreateActivityInputType,
): Promise<CreateActivityOutputType> => {
  try {
    // 1. Get and validate the user id and other activity data
    if (!Types.ObjectId.isValid(userId)) {
      return {
        success: false,
        message: "Invalid user ID format",
      };
    }
    const validatedInput = CreateActivityInputSchema.parse(activityData);

    if (!Types.ObjectId.isValid(validatedInput.objectId)) {
      return {
        success: false,
        message: "Invalid object ID format",
      };
    }

    // 2. Create the activity log
    const newActivity = new Activity({
      userId,
      ...validatedInput,
    });
    const savedActivity = await newActivity.save();

    console.log({
      event: "Activity Created",
      userId,
      activityType: savedActivity.activityType,
      object: savedActivity.object,
      objectId: savedActivity.objectId,
      activityId: savedActivity._id,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      message: `Success: Activity log type - ${savedActivity.activityType} for user - ${userId} on object - ${savedActivity.object} created`,
    };
  } catch (error) {
    console.error("Error creating activity:", {
      userId,
      activityData,
      error,
      timestamp: new Date().toISOString(),
    });

    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Error validating activity data",
      };
    }

    if (error instanceof MongooseError) {
      if (error.name === "CastError") {
        return {
          success: false,
          message: "Invalid ID format",
        };
      }

      if (error.name === "ValidationError") {
        return {
          success: false,
          message: "Validation error",
        };
      }

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

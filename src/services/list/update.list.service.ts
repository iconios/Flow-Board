/*
#Plan:
1. Receive and validate list ID and the update details
2. Verify that the list is owned by the user (owner)
3. Update the list accordingly
4. Send the op update to client
*/

import List from "../../models/list.model.js";
import {
  UpdateListInputSchema,
  type UpdateListInputType,
} from "../../types/list.type.js";
import { MongooseError, Types } from "mongoose";
import { ZodError } from "zod";

const UpdateListService = async (
  list: string,
  user: string,
  updateListInput: UpdateListInputType,
) => {
  try {
    // 1. Receive and validate list ID and the update details
    const listId = list.trim();
    if (!Types.ObjectId.isValid(listId)) {
      return {
        success: false,
        message: "Invalid list ID format",
      };
    }
    const userId = user;
    const validatedInput = UpdateListInputSchema.parse(updateListInput);
    if (Object.keys(validatedInput).length === 0) {
      return {
        success: false,
        message: "Update data empty",
      };
    }

    // 2. Verify that the list is owned by the user (owner)
    // 3. Update the list accordingly
    const updatedList = await List.findOneAndUpdate(
      {
        _id: listId,
        userId,
      },
      validatedInput,
      { new: true },
    ).exec();
    if (!updatedList) {
      return {
        success: false,
        message: "Failed to update list",
      };
    }

    // 4. Send the op update to client
    return {
      success: true,
      message: "List updated successfully",
      list: {
        title: updatedList.title,
        position: updatedList.position,
        status: updatedList.status,
      },
    };
  } catch (error) {
    console.log(`Error updating list ${list}`, error);

    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Error validating update data",
      };
    }

    if (error instanceof MongooseError) {
      return {
        success: false,
        message: "Error while updating data",
      };
    }

    return {
      success: false,
      message: "Unknown error. Please try again",
    };
  }
};

export default UpdateListService;

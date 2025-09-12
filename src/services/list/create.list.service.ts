/*
#Plan: Create a list for a user
1. Get the list details and validate them
2. Verify that the board exists and the user has access to it
3. Verify that the same list title doesn't exist for the same board
4. Creeate the list
*/

import { ZodError } from "zod";
import List from "../../models/list.model.js";
import {
  CreateListInputSchema,
  type CreateListInputType,
  type CreateListOutputType,
} from "../../types/list.type.js";
import { MongooseError } from "mongoose";
import Board from "../../models/board.model.js";

const CreateListService = async (
  userId: string,
  createListInput: CreateListInputType,
): Promise<CreateListOutputType> => {
  try {
    // 1. Get the list details and validate them
    const validatedInput = CreateListInputSchema.parse(createListInput);
    const { title, boardId, status, position } = validatedInput;

    // 2. Verify that the board exists and the user has access to it
    const board = await Board.findOne({ _id: boardId, user_id: userId }).exec();
    if (!board) {
      return {
        success: false,
        message: "Board not found or you don't have access to it",
      };
    }

    // 3. Verify that the same list title (case-insensitive) doesn't exist for the same board
    const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const lists = await List.find({
      title: {
        $regex: new RegExp(`^${escapedTitle}$`, "i"),
      },
      userId,
      boardId,
    }).exec();
    if (lists.length > 0) {
      return {
        success: false,
        message: "Same title not allowed for two lists within the same board",
      };
    }

    // 4. Creeate the list
    const newList = new List({
      title,
      boardId,
      userId,
      status,
      position,
    });

    const createdList = await newList.save();

    return {
      success: true,
      message: "List successfully created",
      list: {
        id: createdList._id.toString(),
        title: createdList.title,
        position: createdList.position,
        status: createdList.status,
        boardId: createdList.boardId.toString(),
      },
    };
  } catch (error) {
    console.error("Error creating the list", error);

    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Error validating list details",
      };
    }

    if (error instanceof MongooseError) {
      if (error.name === "ValidationError") {
        return {
          success: false,
          message: "Validation error occured while creating the list",
        };
      }

      return {
        success: false,
        message: "Database error while fetching data",
      };
    }

    return {
      success: false,
      message: "Unknown error. Please try again",
    };
  }
};

export default CreateListService;

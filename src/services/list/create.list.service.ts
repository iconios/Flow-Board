/*
#Plan: Create a list for a user
1. Get the list details and validate them
2. Verify that the board exists and the user has access to it
3. Verify that the same list title doesn't exist for the same board
4. Create the list
5. Add the list to the board
6. Send op status to client
*/

import { ZodError } from "zod";
import List from "../../models/list.model.js";
import {
  CreateListInputSchema,
  type CreateListInputType,
  type CreateListOutputType,
} from "../../types/list.type.js";
import mongoose, { MongooseError } from "mongoose";
import Board from "../../models/board.model.js";

const CreateListService = async (
  userId: string,
  createListInput: CreateListInputType,
): Promise<CreateListOutputType> => {
  const session = await mongoose.startSession();
  let result: CreateListOutputType | null = null;

  try {
    await session.withTransaction(async () => {
      // 1. Get the list details and validate them
      const validatedInput = CreateListInputSchema.parse(createListInput);
      const { title, boardId, status, position } = validatedInput;

      // 2. Verify that the board exists and the user has access to it
      const hasBoard = await Board.exists({
        _id: boardId,
        user_id: userId,
      }).session(session);
      if (!hasBoard) {
        throw new Error("Board not found");
      }

      // 3. Verify that the same list title (case-insensitive) doesn't exist for the same board
      const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const duplicate = await List.exists({
        title: {
          $regex: new RegExp(`^${escapedTitle}$`, "i"),
        },
        userId,
        boardId,
      }).session(session);

      if (duplicate) {
        throw new Error(
          "Same title not allowed for two lists within the same board",
        );
      }

      // 4. Create the list using transaction
      const newList = new List({
        title,
        boardId,
        userId,
        status,
        position,
      });

      const createdList = await newList.save({ session });

      // 5. Add the list to the board
      await Board.findOneAndUpdate(
        { _id: boardId, user_id: userId },
        { $addToSet: { lists: createdList._id } },
        { session },
      );

      // 6. Send op status to client
      result = {
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
    });

    // Return the result from the transaction
    if (result) {
      return result;
    } else {
      throw new Error("Transaction completed but no result was set");
    }
  } catch (error) {
    console.error("Error creating the list", error);

    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Error validating list details",
      };
    }

    if (error instanceof MongooseError) {
      return {
        success: false,
        message: "Database error while creating list",
      };
    }

    // Handle transaction errors
    if (error instanceof Error) {
      if (error.message === "Board not found") {
        return {
          success: false,
          message: "Board not found",
        };
      }

      if (
        error.message ===
        "Same title not allowed for two lists within the same board"
      ) {
        return {
          success: false,
          message: "Same title not allowed for two lists within the same board",
        };
      }

      if (error.message === "Transaction completed but no result was set") {
        return {
          success: false,
          message: "Transaction completed but no result was set",
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

export default CreateListService;

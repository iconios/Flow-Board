/*
#Plan: Create a list for a user
1. Get the list details and validate them
2. Verify that the board exists with the user as owner or is a board member
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
import BoardMember from "../../models/boardMember.model.js";
import { produceActivity } from "../../redis/activity.producer.js";

const CreateListService = async (
  userId: string,
  createListInput: CreateListInputType,
): Promise<CreateListOutputType> => {
  const session = await mongoose.startSession();
  let result: CreateListOutputType | null = null;

  try {
    // 1. Get the list details and validate them
    const validatedInput = CreateListInputSchema.parse(createListInput);
    const { title, boardId, status, position } = validatedInput;

    let listId = new mongoose.Types.ObjectId();
    await session.withTransaction(async () => {
      // 2. Verify that the board exists with the user as owner or is a board member
      const userOwnsBoard = await Board.findOne({
        _id: boardId,
        user_id: userId,
      })
        .lean()
        .session(session)
        .exec();

      const userIsBoardMember = await BoardMember.findOne({
        user_id: userId,
        board_id: boardId,
      })
        .lean()
        .session(session)
        .exec();

      if (!userOwnsBoard && !userIsBoardMember) {
        throw new Error("Board not found or access denied");
      }

      // 3. Verify that the same list title (case-insensitive) doesn't exist for the same board
      const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const duplicate = await List.findOne({
        title: {
          $regex: new RegExp(`^${escapedTitle}$`, "i"),
        },
        boardId,
      })
        .lean()
        .session(session)
        .exec();

      if (duplicate) {
        throw new Error(
          "Same title not allowed for two lists within the same board",
        );
      }

      // 4. Create the list using transaction
      const getUserFromBoard = await Board.findById(boardId)
        .select("user_id")
        .lean()
        .session(session)
        .exec();
      if (!getUserFromBoard) {
        throw new Error("User ID of the board not found");
      }

      const newList = new List({
        title,
        boardId,
        userId: getUserFromBoard.user_id,
        status,
        position,
      });

      const createdList = await newList.save({ session });
      listId = createdList._id;

      // 5. Add the list to the board
      await Board.updateOne(
        { _id: boardId },
        { $addToSet: { lists: createdList?._id } },
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
      // Produce activity log for creating list
      void produceActivity({
        userId,
        activityType: "create",
        object: "List",
        objectId: listId.toString(),
      }).catch((err) =>
        console.error(
          `Activity log failed for list creation: ${listId.toString()}`,
          err,
        ),
      );
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
      if (error.message === "User ID of the board not found") {
        return {
          success: false,
          message: "User ID of the board not found",
        };
      }

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

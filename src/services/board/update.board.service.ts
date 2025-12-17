/*
#Plan:
1. Receive and validate the user id
2. Receive and validate the board id
3. Search for the board of the user
4. Update the board details on the DB
5. Send the status to the client
*/

import { MongooseError, Types } from "mongoose";
import Board from "../../models/board.model.js";
import {
  UpdateBoardInputSchema,
  type BoardDetailsType,
  type BoardUpdateOutputType,
  type UpdateBoardInputType,
} from "../../types/board.type.js";
import { ZodError } from "zod";
import { produceActivity } from "../../redis/activity.producer.js";

const UpdateBoardService = async (
  board_id: string,
  boardDetailsInput: UpdateBoardInputType,
): Promise<BoardUpdateOutputType> => {
  try {
    // 1. Receive and validate the user id
    const validatedInput = UpdateBoardInputSchema.parse(boardDetailsInput);

    const userId = validatedInput.user_id;
    if (!Types.ObjectId.isValid(userId)) {
      return {
        success: false,
        message: "Invalid user ID format",
      };
    }

    // 2. Receive and validate the board id
    const boardId = board_id.trim();
    if (!Types.ObjectId.isValid(boardId)) {
      return {
        success: false,
        message: "Invalid board ID format",
      };
    }

    // 3. Search for the board of the user
    const board = await Board.findById<BoardDetailsType>(boardId)
      .populate<{
        user_id: { _id: string; firstname: string; email: string };
      }>("user_id")
      .exec();
    if (!board) {
      return {
        success: false,
        message: "Board does not exist",
      };
    }
    if (board.user_id._id.toString() !== userId) {
      return {
        success: false,
        message: "Unauthorized user",
      };
    }

    // 4. Update the board details on the DB
    const updatedBoard = await Board.findByIdAndUpdate(
      boardId,
      validatedInput,
      {
        new: true,
        runValidators: true,
      },
    ).exec();

    if (!updatedBoard) {
      return {
        success: false,
        message: "Failed to update board",
      };
    }

    // Create activity log for board update
    await produceActivity({
      userId,
      activityType: "edit",
      object: "Board",
      objectId: boardId,
    });
    console.log(`Activity log produced for task creation: ${boardId}`);
    

    // 5. Send the status to the client
    return {
      success: true,
      message: "Board updated successfully",
      board: {
        id: updatedBoard._id.toString(),
        title: updatedBoard.title,
        bg_color: updatedBoard.bg_color,
      },
    };
  } catch (error) {
    console.error("Error updating the board", error);

    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Invalid input data. Please check your values.",
      };
    }

    if (error instanceof MongooseError) {
      return {
        success: false,
        message: "Failed to save changes. Please try again.",
      };
    }

    return {
      success: false,
      message: "Unknown error. Please try again",
    };
  }
};

export default UpdateBoardService;

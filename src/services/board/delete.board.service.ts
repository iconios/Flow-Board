/*
#Plan:
1. Receive and validate the board ID
2. Confirm that the authorized user requests for the deletion
3. Delete the board
4. Send op status to client
*/

import { MongooseError, Types } from "mongoose";
import Board from "../../models/board.model.js";
import type { BoardDeleteOutputType } from "../../types/board.type.js";

const DeleteBoardService = async (
  boardId: string,
  userId: string,
): Promise<BoardDeleteOutputType> => {
  try {
    // 1. Receive and validate the board ID
    const trimmedBoardId = boardId.trim();
    if (!trimmedBoardId || !Types.ObjectId.isValid(trimmedBoardId)) {
      return {
        success: false,
        message: "Invalid or missing board ID",
      };
    }

    // 2. Confirm that the authorized user requests for the deletion
    const trimmedUserId = userId.trim();
    if (!trimmedUserId || !Types.ObjectId.isValid(trimmedUserId)) {
      return {
        success: false,
        message: "Invalid or missing user ID",
      };
    }

    // 3. Delete the board
    const board = await Board.findOneAndDelete({
      _id: trimmedBoardId,
      user_id: trimmedUserId,
    }).exec();
    if (!board) {
      return {
        success: true,
        message: "Board was already deleted or does not exist",
      };
    }

    // 4. Send op status to client
    return {
      success: true,
      message: "Board successfully deleted",
    };
  } catch (error) {
    console.error(`Error deleting board ${boardId} for user ${userId}:`, error);

    if (error instanceof MongooseError) {
      return {
        success: false,
        message: "Database error while deleting board",
      };
    }

    return {
      success: false,
      message: "Unexpected error while deleting board",
    };
  }
};

export default DeleteBoardService;

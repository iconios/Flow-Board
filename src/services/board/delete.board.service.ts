/*
#Plan:
1. Receive and validate the board ID
2. Confirm that the authorized user requests for the deletion
3. Start transaction session for cascade deletion
4. Find the board in the session
5. Find all the lists IDs associated with the board
6. Find and Delete all the tasks associated with each list
7. Delete all the identified lists associated with the board
8. Delete the board
9. Send op status to the client
*/

import { MongooseError, Types } from "mongoose";
import Board from "../../models/board.model.js";
import type { BoardDeleteOutputType } from "../../types/board.type.js";
import List from "../../models/list.model.js";
import Task from "../../models/task.model.js";

const DeleteBoardService = async (
  boardId: string,
  userId: string,
): Promise<BoardDeleteOutputType> => {
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

  const boardObjId = new Types.ObjectId(trimmedBoardId);
  const userObjId = new Types.ObjectId(trimmedUserId);

  // 3. Start transaction session for cascade deletion
  const session = await Board.startSession();
  let boardDeleted: boolean = false;

  try {
    await session.withTransaction(async () => {
      // 4. Find the board in the session
      const board = await Board.findOne({
        _id: boardObjId,
        user_id: userObjId,
      }).session(session);

      if (!board) {
        return;
      }

      // 5. Find all the lists IDs associated with the board
      const lists = await List.find({ board_id: boardObjId })
        .select("_id")
        .session(session);
      if (lists.length > 0) {
        const listIds = lists.map((list) => list._id);

        // 6. Find and Delete all the tasks associated with each list
        await Task.deleteMany({ list_id: { $in: listIds } }).session(session);

        // 7. Delete all the identified lists associated with the board
        await List.deleteMany({ board_id: boardObjId }).session(session);
      }

      // 8. Delete the board
      const { deletedCount } = await Board.deleteOne({
        _id: boardObjId,
        user_id: userObjId,
      }).session(session);

      boardDeleted = deletedCount > 0;
    });

    // 9. Send op status to client
    if (!boardDeleted) {
      return {
        success: true,
        message: "Board already deleted or not found",
      };
    }

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
  } finally {
    // End the session
    await session.endSession();
  }
};

export default DeleteBoardService;

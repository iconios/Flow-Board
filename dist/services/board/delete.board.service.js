/*
#Plan:
1. Receive and validate the board ID
2. Confirm that the authorized user requests for the deletion
3. Start transaction session for cascade deletion
4. Find the board in the session
5. Find all the lists IDs associated with the board
6. Find all the tasks associated with each list in the board
7. Find and Delete all the comments associated with each task in each list
8. Delete all the tasks associated with each list
9. Delete all the identified lists associated with the board
10. Delete all the board members
11. Delete the board
12. Send op status to the client
*/
import { MongooseError, Types } from "mongoose";
import Board from "../../models/board.model.js";
import List from "../../models/list.model.js";
import Task from "../../models/task.model.js";
import Comment from "../../models/comment.model.js";
import BoardMember from "../../models/boardMember.model.js";
const DeleteBoardService = async (boardId, userId, clientSession) => {
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
  const shouldEndSession = !clientSession;
  const session = clientSession || (await Board.startSession());
  let boardDeleted = false;
  const run = async () => {
    // 4. Find the board in the session
    const board = await Board.findOne({
      _id: boardObjId,
      user_id: userObjId,
    }).session(session);
    if (!board) {
      return;
    }
    // 5. Find all the lists IDs associated with the board
    const lists = await List.find({ boardId: boardObjId })
      .select("_id")
      .session(session);
    if (lists.length > 0) {
      const listIds = lists.map((list) => list._id);
      // 6. Find all the tasks associated with each list in the board
      const allTasks = await Task.find({ listId: { $in: listIds } }).session(
        session,
      );
      if (allTasks.length > 0) {
        const taskIds = allTasks.map((task) => task._id);
        // 7. Find and Delete all the comments associated with each task in each list
        await Comment.deleteMany({
          taskId: { $in: taskIds },
        }).session(session);
        // 8. Delete all the tasks associated with each list
        await Task.deleteMany({
          listId: { $in: listIds },
        }).session(session);
      }
      // 9. Delete all the identified lists associated with the board
      await List.deleteMany({
        boardId: boardObjId,
      }).session(session);
    }
    // 10. Delete all the board members
    await BoardMember.deleteMany({
      board_id: boardObjId,
    }).session(session);
    // 11. Delete the board
    const { deletedCount } = await Board.deleteOne({
      _id: boardObjId,
      user_id: userObjId,
    }).session(session);
    boardDeleted = deletedCount > 0;
  };
  try {
    if (shouldEndSession) {
      await session.withTransaction(run);
    } else {
      await run();
    }
    // 12. Send op status to client
    if (!boardDeleted) {
      return {
        success: false,
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
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Unexpected error while deleting board",
    };
  } finally {
    // Only end the session created in this service
    if (shouldEndSession) {
      await session.endSession();
    }
  }
};
export default DeleteBoardService;
//# sourceMappingURL=delete.board.service.js.map

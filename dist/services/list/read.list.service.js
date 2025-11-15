/*
#Plan:
1. Get and validate the user and the board
2. Verify that the user owns the board or is a board member
3. Send the board's lists to the user
*/
import { MongooseError, Types } from "mongoose";
import Board from "../../models/board.model.js";
import List from "../../models/list.model.js";
import BoardMember from "../../models/boardMember.model.js";
const ReadListService = async (userId, board) => {
  try {
    // 1. Get and validate the user and the board
    const boardId = board.trim();
    if (!Types.ObjectId.isValid(boardId)) {
      return {
        success: false,
        message: "Invalid board ID",
      };
    }
    // 2. Verify that the user owns the board or is a board member
    const userOwnsBoard = await Board.findOne({
      _id: boardId,
      user_id: userId,
    })
      .lean()
      .exec();
    const userIsBoardMember = await BoardMember.findOne({
      user_id: userId,
      board_id: boardId,
    })
      .lean()
      .exec();
    if (!userOwnsBoard && !userIsBoardMember) {
      return {
        success: false,
        message: "Board not found or access denied",
      };
    }
    // 3. Send the board's lists to the user
    const boardLists = await List.find({ boardId })
      .sort({ position: 1, _id: 1 })
      .select("-userId")
      .populate({
        path: "tasks",
        select: "_id title description dueDate priority position listId",
        options: { lean: true },
      })
      .lean()
      .exec();
    if (boardLists.length === 0) {
      return {
        success: true,
        message: "No lists found for the board",
        lists: [],
      };
    }
    const transformedLists = boardLists.map((list) => ({
      id: list._id.toString(),
      title: list.title,
      position: list.position,
      status: list.status,
      boardId: list.boardId.toString(),
      tasks: list.tasks.map((task) => ({
        _id: task._id.toString(),
        description: task.description ?? "",
        title: task.title,
        dueDate: task.dueDate ?? "",
        priority: task.priority,
        position: task.position ?? 0,
        listId: task.listId?.toString() ?? "",
      })),
    }));
    return {
      success: true,
      message: `${transformedLists.length} List(s) found`,
      lists: transformedLists,
    };
  } catch (error) {
    console.error("Error fetching the lists", error);
    if (error instanceof MongooseError) {
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
export default ReadListService;
//# sourceMappingURL=read.list.service.js.map

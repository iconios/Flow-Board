/*
#Plan:
1. Get and validate the owner and the board
2. Verify that the board has the owner as the user
3. Send the board's lists to the user
*/

import { MongooseError, Types } from "mongoose";
import Board from "../../models/board.model.js";
import List from "../../models/list.model.js";
import type { ReadListOutputType } from "../../types/list.type.js";

const ReadListService = async (
  userId: string,
  board: string,
): Promise<ReadListOutputType> => {
  try {
    // 1. Get and validate the owner and the board
    const boardId = board.trim();
    if (!Types.ObjectId.isValid(boardId)) {
      return {
        success: false,
        message: "Invalid board ID",
      };
    }

    // 2. Verify that the board has the owner as the user
    const boardFound = await Board.findOne({
      _id: boardId,
      user_id: userId,
    }).exec();
    if (!boardFound) {
      return {
        success: false,
        message: "Board not found",
      };
    }

    // 3. Send the board's lists to the user
    const boardLists = await List.find({ boardId })
      .sort({ position: 1 })
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
      userId: list.userId.toString(),
    }));

    return {
      success: true,
      message: "List(s) found",
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

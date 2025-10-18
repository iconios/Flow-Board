/*
#Plan:
1. Get and validate the user id
2. 2. Get the boards of the user, all the IDs and the boards the user is a member of
3. Send all the boards data to the user
*/

import { MongooseError, Types } from "mongoose";
import Board from "../../models/board.model.js";
import type {
  BoardDetailsType,
  BoardReadOutputType,
} from "../../types/board.type.js";
import BoardMember from "../../models/boardMember.model.js";

const ReadBoardService = async (
  user_id: string,
): Promise<BoardReadOutputType> => {
  try {
    // 1. Get and validate the user id
    const id = user_id.trim();
    if (!Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid user ID",
      };
    }

    // 2. Get the boards of the user, all the IDs and the boards the user is a member of
    const boardIDsUserIsMember = await BoardMember.find({ user_id })
      .select("board_id")
      .exec();
    const boardIds = boardIDsUserIsMember.map((board) => board.board_id);

    const userBoardOrIsMember = await Board.find<BoardDetailsType>({
      $or: [{ _id: { $in: boardIds } }, { user_id: id }],
    })
      .populate("user_id")
      .exec();

    // 3. Send all the boards data to the user
    return {
      success: true,
      message: "Boards retrieved",
      boards: userBoardOrIsMember,
    };
  } catch (error) {
    console.error(`Error retrieving boards for ${user_id}`, error);

    if (error instanceof MongooseError) {
      return {
        success: false,
        message: "Error retrieving boards",
      };
    }

    return {
      success: false,
      message: "Unknown error. Please try again",
    };
  }
};

export default ReadBoardService;

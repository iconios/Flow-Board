/*
#Plan:
1. Get and validate the user id
2. Get the boards of the user from the DB
3. Send the data to the client
*/

import { MongooseError, Types } from "mongoose";
import Board from "../../models/board.model.js";
import type {
  BoardDetailsType,
  BoardReadOutputType,
} from "../../types/board.type.js";

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

    // 2. Get the boards of the user from the DB
    const boards = await Board.find<BoardDetailsType>({ user_id: id }).exec();

    // 3. Send the data to the client
    return {
      success: true,
      message: "Boards retrieved",
      boards,
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

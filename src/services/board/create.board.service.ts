/*
Plan: 
1. Accept the board details
2. Validate the details
3. Get the User id that created the board
4. Save the board details while associating with the user id
5. Return the status message to the caller
*/

import { ZodError } from "zod";
import {
  BoardDetailsInputSchema,
  type BoardDetailsInputType,
} from "../../types/board.type.js";
import User from "../../models/user.model.js";
import Board from "../../models/board.model.js";
import { MongooseError, Types } from "mongoose";

const CreateBoardService = async (
  // 1. Accept the board details
  boardDetailsInput: BoardDetailsInputType,
) => {
  try {
    // 2. Validate the details
    const validatedInput = BoardDetailsInputSchema.parse(boardDetailsInput);

    // 3. Get the User id that created the board
    const id = validatedInput.user_id;
    if (!Types.ObjectId.isValid(id!)) {
      return {
        success: false,
        message: "Invalid user ID",
      };
    }
    const user = await User.findById(id).exec();
    if (!user) {
      return {
        success: false,
        message: "Invalid User",
      };
    }
    const user_id = user._id.toString();

    // 4. Save the board details while associating with the user id
    const title = validatedInput.title?.trim();
    const bg_color = validatedInput.bg_color?.trim();

    const newBoard = new Board({
      title,
      user_id,
      bg_color,
    });

    const board = await newBoard.save();

    // 5. Return the status message to the caller
    return {
      success: true,
      message: "Board saved",
      board: {
        boardId: board._id.toString(),
      },
    };
  } catch (error) {
    console.log("Error creating board", error);
    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Error validating board creation details",
      };
    }

    if (error instanceof MongooseError) {
      if (error.name === "ValidationError") {
        return {
          success: false,
          message: "Invalid board data",
        };
      }

      return {
        success: false,
        message: "Error saving board data",
      };
    }

    return {
      success: false,
      message: "Unknown error. Please try again",
    };
  }
};

export default CreateBoardService;

/*
#Plan: Get All the Members of a owner's Board
1. Receive and validate the owner, user or board
2. Retrieve the Members associated with a Board 
3. Send the details to the client
*/

import { Types } from "mongoose";
import BoardMember from "../../models/boardMember.model.js";
import {
  ReadMemberInputSchema,
  type MemberReadOutputType,
  type MemberType,
  type ReadMemberInputType,
} from "../../types/member.type.js";
import Board from "../../models/board.model.js";

const ReadMemberService = async (
  readMemberInput: ReadMemberInputType,
): Promise<MemberReadOutputType> => {
  try {
    // 1. Receive and validate the owner, user or board
    const validatedInput = ReadMemberInputSchema.parse(readMemberInput);
    const boardId = validatedInput.boardId;
    const ownerId = validatedInput.ownerId;

    if (!Types.ObjectId.isValid(boardId)) {
      return {
        success: false,
        message: "Invalid board ID",
      };
    }

    // 2. Retrieve the Members associated with a Board
    const board = await Board.findById(boardId).exec();
    if (!board) {
      return {
        success: false,
        message: "Board not found",
      };
    }

    if (board.user_id.toString() !== ownerId) {
      return {
        success: false,
        message: "Unauthorized access",
      };
    }

    const members = await BoardMember.find<MemberType>({
      board_id: boardId,
    }).exec();

    // 3. Send the details to the client
    return {
      success: true,
      message:
        members.length > 0
          ? "Board members retrieved successfully"
          : "No members found",
      members,
    };
  } catch (error) {
    console.error("Error retrieving the board members", error);

    return {
      success: false,
      message: "Error retrieving the board members",
    };
  }
};

export default ReadMemberService;

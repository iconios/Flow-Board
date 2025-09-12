/*
#Plan:
1. Get the owner id and validate the boardId
2. Verify that the owner owns the board
3. Delete the member
4. Send op status to client
*/

import Board from "../../models/board.model.js";
import BoardMember from "../../models/boardMember.model.js";
import { MongooseError, Types } from "mongoose";

const DeleteMemberService = async (ownerId: string, memberId: string) => {
  try {
    // 1. Get the owner id and validate the boardId
    if (!Types.ObjectId.isValid(memberId.trim())) {
      return {
        success: false,
        message: "Invalid board member",
      };
    }

    // 2. Verify that the owner owns the board
    const member = await BoardMember.findById(memberId).exec();
    if (!member) {
      return {
        success: false,
        message: "Board member not found",
      };
    }
    console.log("Member details", member);
    const board = await Board.findById(member.board_id).exec();
    if (!board) {
      return {
        success: false,
        message: "Associated board not found",
      };
    }

    if (board.user_id.toString() !== ownerId) {
      return {
        success: false,
        message: "Unauthorized: Only board owners can remove members",
      };
    }

    // 3. Delete the member
    const deletedMember = await BoardMember.deleteOne({ _id: memberId }).exec();
    if (deletedMember.deletedCount === 0) {
      return {
        success: false,
        message: "Failed to delete board member",
      };
    }

    // 4. Send op status to client
    return {
      success: true,
      message: "Board member successfully deleted",
    };
  } catch (error) {
    console.error(`Error deleting board member ${memberId}`, error);

    if (error instanceof MongooseError) {
      return {
        success: false,
        message: "Database error while deleting board member",
      };
    }

    return {
      success: false,
      message: "Unknown error. Please try again",
    };
  }
};

export default DeleteMemberService;

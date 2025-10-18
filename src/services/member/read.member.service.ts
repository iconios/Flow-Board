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
  type BoardMemberReadOutputType,
  type MemberReadOutputType,
  type ReadMemberInputType,
} from "../../types/member.type.js";
import Board from "../../models/board.model.js";

const ReadMemberService = async (
  readMemberInput: ReadMemberInputType,
): Promise<MemberReadOutputType> => {
  try {
    // 1. Receive and validate the owner, user or board
    const { boardId, ownerId } = ReadMemberInputSchema.parse(readMemberInput);

    if (!Types.ObjectId.isValid(boardId)) {
      return {
        success: false,
        message: "Invalid board ID",
        members: [],
      };
    }

    if (!Types.ObjectId.isValid(ownerId)) {
      return {
        success: false,
        message: "Invalid board owner ID",
        members: [],
      };
    }

    // 2. Retrieve the Members associated with a Board
    const board = await Board.findById(boardId).exec();
    if (!board) {
      return {
        success: false,
        message: "Board not found",
        members: [],
      };
    }

    // Ensure the owner owns the board indeed
    if (board.user_id.toString() !== ownerId) {
      return {
        success: false,
        message: "Unauthorized access",
        members: [],
      };
    }

    // Fetch the verified members associated with a board
    const membersFound = (await BoardMember.find({
      board_id: boardId,
      isVerified: true,
    })
      .populate("user_id")
      .lean()
      .exec()) as unknown as BoardMemberReadOutputType[];

    if (membersFound.length === 0) {
      return {
        success: true,
        message: "No members found for the board",
        members: [],
      };
    }

    // 3. Send the details to the client
    const membersToReturn = membersFound.map((member) => ({
      memberId: member._id.toString(),
      boardId: member.board_id.toString(),
      user: {
        userId: member.user_id._id.toString(),
        firstname: member.user_id.firstname,
        email: member.user_id.email,
      },
      role: member.role,
    }));

    return {
      success: true,
      message:
        membersToReturn.length > 0
          ? "Board members retrieved successfully"
          : "No members found",
      members: membersToReturn ?? [],
    };
  } catch (error) {
    console.error("Error retrieving the board members", error);

    return {
      success: false,
      message: "Error retrieving the board members",
      members: [],
    };
  }
};

export default ReadMemberService;

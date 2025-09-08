/*
#Plan:
1. Receive and validate the userId or boardId
2. Retrieve the member details from the DB
3. Send the details to the client
*/

import { Types } from "mongoose";
import BoardMember from "../../models/boardMember.model.js";
import type {
  MemberReadOutputType,
  MemberType,
} from "../../types/member.type.js";

const ReadMemberService = async (
  boardId?: string,
  userId?: string,
): Promise<MemberReadOutputType> => {
  try {
    // 1. Receive and validate the userId or boardId
    const board = boardId?.trim();
    const user = userId?.trim();
    if (!board && !user) {
      return {
        success: false,
        message: "Missing board ID or user ID",
      };
    }

    if (board && !Types.ObjectId.isValid(board)) {
      return {
        success: false,
        message: "Invalid board ID",
      };
    } else if (user && !Types.ObjectId.isValid(user)) {
      return {
        success: false,
        message: "Invalid user ID",
      };
    }

    // 2. Retrieve the member details from the DB
    const query = board ? { board_id: board } : { user_id: user };
    const members = await BoardMember.find<MemberType>(query).exec();
    if (members.length === 0) {
      return {
        success: false,
        message: "No members found",
      };
    }

    // 3. Send the details to the client
    return {
      success: true,
      message: "Board members retrieved successfully",
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

// Update Board Member Service
/*
#Plan:
1. Get the owner id and member id and validate them
2. Verify that the owner owns the board
3. Verify that the board id exist for the member and Update the member role
4. Send op status to client
*/

import { MongooseError, Types } from "mongoose";
import {
  UpdateMemberRoleSchema,
  type PopulatedMemberUserIdType,
  type UpdateMemberRoleType,
} from "../../types/member.type.js";
import { ZodError } from "zod";
import Board from "../../models/board.model.js";
import BoardMember from "../../models/boardMember.model.js";

const UpdateMemberRoleService = async (
  ownerId: string,
  memberData: UpdateMemberRoleType,
) => {
  try {
    // 1. Get the owner id, board id, member id and validate them
    const { memberId, board_id, role } =
      UpdateMemberRoleSchema.parse(memberData);
    if (!Types.ObjectId.isValid(board_id)) {
      return {
        success: false,
        message: "Invalid board id",
      };
    }
    if (!Types.ObjectId.isValid(memberId)) {
      return {
        success: false,
        message: "Invalid member id",
      };
    }
    if (!Types.ObjectId.isValid(ownerId)) {
      return {
        success: false,
        message: "Invalid owner id",
      };
    }

    // 2. Verify that the owner owns the board
    const [ownerOwnsBoard, existingMember] = await Promise.all([
      Board.findOne({
        _id: board_id,
        user_id: ownerId,
      })
        .lean()
        .exec(),
      BoardMember.findOne({
        _id: memberId,
        board_id,
      })
        .lean()
        .exec(),
    ]);
    if (!ownerOwnsBoard) {
      return {
        success: false,
        message: "Unauthorized or board not found",
      };
    }

    if (!existingMember) {
      return {
        success: false,
        message: "Member not found in this board",
      };
    }

    // 3. Verify that the board id exist for the member and Update the member role
    const updatedMember = await BoardMember.findOneAndUpdate(
      {
        _id: memberId,
        board_id,
      },
      {
        role,
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate<{ user_id: PopulatedMemberUserIdType }>("user_id")
      .lean()
      .exec();
    if (!updatedMember) {
      return {
        success: false,
        message: "User not board member or board not found",
      };
    }

    // 4. Send op status to client
    return {
      success: true,
      message: "Update successful",
      member: {
        memberId: updatedMember._id.toString(),
        boardId: updatedMember.board_id.toString(),
        role: updatedMember.role,
        user: {
          userId: updatedMember.user_id._id.toString(),
          firstname: updatedMember.user_id.firstname,
          email: updatedMember.user_id.email,
        },
        boardOwnerUserId: ownerOwnsBoard.user_id.toString(),
      },
    };
  } catch (error) {
    console.error("Error updating board member role", error);

    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Error validating board member data",
      };
    }

    if (error instanceof MongooseError) {
      return {
        success: false,
        message: "Database error while updating board member role",
      };
    }

    return {
      success: false,
      message: "Error updating board member role",
    };
  }
};

export default UpdateMemberRoleService;

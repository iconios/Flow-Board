/*
Plan: 
1. Accept and validate owner id, board id, user id, and user role (if available)
2. Verify that the board exists with the owner as the userid field value
3. Verify that the user (board member) exists
4. Verify that the owner is not the same as user
5. Verify that the board member doesn't already exist for the board
6. Create the member
7. Send op status to the client
*/

import { ZodError } from "zod";
import {
  CreateMemberInputSchema,
  type MemberCreateInputType,
  type MemberCreateOutputType,
  type MemberType,
} from "../../types/member.type.js";
import BoardMember from "../../models/boardMember.model.js";
import { MongooseError, Types } from "mongoose";
import Board from "../../models/board.model.js";
import User from "../../models/user.model.js";

const CreateMemberService = async (
  boardOwner: string,
  createMemberInput: MemberCreateInputType,
): Promise<MemberCreateOutputType> => {
  try {
    // 1. Accept and validate owner id, board id, user id, and user role (if available)
    const validatedInput = CreateMemberInputSchema.parse(createMemberInput);
    const boardId = validatedInput.board_id;
    if (!Types.ObjectId.isValid(boardId)) {
      return {
        success: false,
        message: "Invalid board id",
      };
    }

    const userId = validatedInput.user_id;
    if (!Types.ObjectId.isValid(userId)) {
      return {
        success: false,
        message: "Invalid user id",
      };
    }

    const ownerId = boardOwner.trim();
    if (!Types.ObjectId.isValid(ownerId)) {
      return {
        success: false,
        message: "Invalid owner id",
      };
    }

    const role = validatedInput.role ?? "member";

    const [boardWithOwnerExists, boardMemberExists, memberExists] =
      await Promise.all([
        Board.findOne({ _id: boardId, user_id: ownerId }).exec(),
        User.findById(userId).exec(),
        BoardMember.findOne<MemberType>({
          board_id: boardId,
          user_id: userId,
        }).exec(),
      ]);

    // 2. Verify that the board exists with the owner as the userid field value
    if (!boardWithOwnerExists) {
      return {
        success: false,
        message: "Board not found or you don't have permission to add members",
      };
    }

    // 3. Verify that the user (board member) exists
    if (!boardMemberExists) {
      return {
        success: false,
        message: "User does not exist",
      };
    }

    // 4. Verify that the member doesn't already exist for the board
    if (memberExists) {
      return {
        success: true,
        message: "Member already exists for this board",
        member: {
          memberId: memberExists._id.toString(),
          boardId: memberExists.board_id.toString(),
          role: memberExists.role,
        },
      };
    }

    // 5. Create the member
    const member = new BoardMember({
      board_id: boardId,
      user_id: userId,
      role,
    });
    const createdMember = await member.save();
    if (!createdMember) {
      return {
        success: false,
        message: "Error creating member",
      };
    }

    // 5. Send op status to the client
    return {
      success: true,
      message: "Member successfully created",
      member: {
        memberId: createdMember._id.toString(),
        boardId: createdMember.board_id.toString(),
        role: createdMember.role,
      },
    };
  } catch (error) {
    console.error(
      `Error creating ${createMemberInput.user_id} as a member for ${createMemberInput.board_id}`,
      error,
    );

    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Error validating member",
      };
    }

    if (error instanceof MongooseError) {
      return {
        success: false,
        message: "Error creating member",
      };
    }

    return {
      success: false,
      message: "Unknown error. Please try again",
    };
  }
};

export default CreateMemberService;

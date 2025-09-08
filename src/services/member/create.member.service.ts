/*
Plan: 
1. Accept and validate board id, user id, and user role (if available)
2. Verify that the member doesn't already exist for the board
3. Create the member
4. Send op status to the client
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

const CreateMemberService = async (
  createMemberInput: MemberCreateInputType,
): Promise<MemberCreateOutputType> => {
  try {
    // 1. Accept and validate board id, user id, and user role (if available)
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

    const role = validatedInput.role ?? "member";

    // 2. Verify that the member doesn't already exist for the board
    const memberExists = await BoardMember.findOne<MemberType>({
      board_id: boardId,
      user_id: userId,
    }).exec();
    if (memberExists) {
      return {
        success: false,
        message: "Member already exists for this board",
        member: {
          memberId: memberExists._id.toString(),
          boardId: memberExists.board_id.toString(),
          role: memberExists.role,
        },
      };
    }

    // 3. Create the member
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

    // 4. Send op status to the client
    return {
      success: true,
      message: "Member successfully created",
      member: {
        memberId: createdMember._id.toString(),
        boardId: createdMember.board_id!.toString(),
        role: createdMember.role,
      },
    };
  } catch (error) {
    console.error("Error creating a board member", error);

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

/*
Plan: 
1. Accept and validate owner id, board id, user email, and user role (if available)
2. Verify that the board exists with the owner as the userid field value
3. Verify that the user (board member) exists
4. Verify that the owner is not the same as user
5. Verify that the board member doesn't already exist for the board
6. Get the details of the board owner
7. Create the member
8. Send board invite to the user
9. Send op status to the client
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
import { sendMemberInvite } from "../../utils/mailer.util.js";

const CreateMemberService = async (
  boardOwner: string,
  createMemberInput: MemberCreateInputType,
): Promise<MemberCreateOutputType> => {
  try {
    // 1. Accept and validate owner id, board id, user email, and user role (if available)
    const validatedInput = CreateMemberInputSchema.parse(createMemberInput);
    const boardId = validatedInput.board_id;
    if (!Types.ObjectId.isValid(boardId)) {
      return {
        success: false,
        message: "Invalid board id",
      };
    }

    const userEmail = validatedInput.userEmail;
    const userFound = await User.findOne({ email: userEmail }).lean().exec();
    if (!userFound) {
      return {
        success: true,
        message:
          "Inform the user to check his/her email to accept the board member invite",
      };
    }
    const userId = userFound._id.toString();
    const ownerId = boardOwner.trim();
    if (!Types.ObjectId.isValid(ownerId)) {
      return {
        success: false,
        message: "Invalid owner id",
      };
    }

    const role = validatedInput.role ?? "member";

    const [
      boardWithOwnerExists,
      boardMemberExists,
      memberExists,
      boardOwnerDetails,
    ] = await Promise.all([
      Board.findOne({ _id: boardId, user_id: ownerId }).lean().exec(),
      User.findById(userId).lean().exec(),
      BoardMember.findOne<MemberType>({
        board_id: boardId,
        user_id: userId,
      })
        .lean()
        .exec(),
      User.findById({ _id: ownerId }).select("firstname").lean().exec(),
    ]);

    // 2. Verify that the board exists with the owner as the userid field value
    if (!boardWithOwnerExists) {
      return {
        success: false,
        message: "Board not found or access denied",
      };
    }

    // 3. Verify that the user (board member) exists
    if (!boardMemberExists) {
      return {
        success: false,
        message: "User does not exist",
      };
    }

    // 4. Verify that the owner is not the same as user
    if (ownerId === userId) {
      return {
        success: false,
        message: "Owner cannot be the same as board member",
      };
    }

    // 5. Verify that the member doesn't already exist for the board
    if (memberExists && memberExists.isVerified) {
      return {
        success: true,
        message: "Member already exists for this board",
        member: {
          memberId: memberExists._id.toString(),
          boardId: memberExists.board_id.toString(),
          userId: memberExists.user_id.toString(),
          role: memberExists.role,
        },
      };
    }

    // 6. Get the details of the board owner
    if (!boardOwnerDetails) {
      return {
        success: false,
        message: "Board owner doesn't exist",
      };
    }

    // Delete unverified member
    if (memberExists && !memberExists.isVerified) {
      await BoardMember.findByIdAndDelete(memberExists._id).exec();
    }

    // 7. Create the member
    const member = new BoardMember({
      board_id: boardId,
      user_id: userId,
      role,
    });
    await member.generateVerificationToken();

    const createdMember = await member.save();
    if (!createdMember) {
      return {
        success: false,
        message: "Error creating member",
      };
    }

    // 8. Send board invite to the user
    sendMemberInvite(
      userEmail,
      userFound.firstname,
      createdMember.verificationToken,
      boardOwnerDetails.firstname,
    );

    // 9. Send op status to the client
    return {
      success: true,
      message:
        "Inform the user to check his/her email to accept the board member invite",
    };
  } catch (error) {
    console.error(
      `Error creating ${createMemberInput.userEmail} as a member for ${createMemberInput.board_id}`,
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

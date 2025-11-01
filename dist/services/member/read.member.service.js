/*
#Plan: Get All the Members of a Board
1. Receive and validate the user and the board
2. Ensure the user owns the board or is a board member
3. Retrieve the Members associated with the Board
4. Send the details to the client
*/
import { Types } from "mongoose";
import BoardMember from "../../models/boardMember.model.js";
import { ReadMemberInputSchema, } from "../../types/member.type.js";
import Board from "../../models/board.model.js";
const ReadMemberService = async (readMemberInput) => {
    try {
        // 1. Receive and validate the user and the board
        const { boardId, userId } = ReadMemberInputSchema.parse(readMemberInput);
        if (!Types.ObjectId.isValid(boardId)) {
            return {
                success: false,
                message: "Invalid board ID",
                members: [],
            };
        }
        if (!Types.ObjectId.isValid(userId)) {
            return {
                success: false,
                message: "Invalid board owner ID",
                members: [],
            };
        }
        // 2. Ensure the user owns the board or is a board member
        const [board, member] = await Promise.all([
            Board.findById(boardId).select("user_id").lean().exec(),
            BoardMember.findOne({ user_id: userId, board_id: boardId }).lean().exec(),
        ]);
        if (!board) {
            return {
                success: false,
                message: "Board not found",
                members: [],
            };
        }
        if (board.user_id.toString() !== userId && !member) {
            return {
                success: false,
                message: "Unauthorized access",
                members: [],
            };
        }
        // 3. Retrieve the Members associated with the Board
        const membersFound = await BoardMember.find({
            board_id: boardId,
            isVerified: true,
        })
            .populate("user_id")
            .lean()
            .exec();
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
            boardOwnerUserId: board.user_id.toString(),
        }));
        return {
            success: true,
            message: membersToReturn.length > 0
                ? "Board members retrieved successfully"
                : "No members found",
            members: membersToReturn ?? [],
        };
    }
    catch (error) {
        console.error("Error retrieving the board members", error);
        return {
            success: false,
            message: "Error retrieving the board members",
            members: [],
        };
    }
};
export default ReadMemberService;
//# sourceMappingURL=read.member.service.js.map
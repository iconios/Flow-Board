/*
#Plan:
1. Get the owner id and member id and validate them
2. Verify that the owner owns the board
3. Get the board title, board owner name, member name, member email
4. Remove the member from the board
5. Send a membership revocation email to member
6. Send op status to client
*/
import Board from "../../models/board.model.js";
import BoardMember from "../../models/boardMember.model.js";
import { MongooseError, Types } from "mongoose";
import { sendMembershipRemovalEmail } from "../../utils/mailer.util.js";
const DeleteMemberService = async (ownerId, memberId) => {
    try {
        // 1. Get the owner id and validate the boardId
        if (!Types.ObjectId.isValid(memberId.trim()) ||
            !Types.ObjectId.isValid(ownerId.trim())) {
            return {
                success: false,
                message: "Invalid board member or owner ID",
            };
        }
        // 2. Verify that the owner owns the board
        const member = await BoardMember.findById(memberId)
            .populate("user_id")
            .lean()
            .exec();
        if (!member) {
            return {
                success: false,
                message: "Board member not found",
            };
        }
        console.log("Member details", member);
        const board = await Board.findById(member.board_id)
            .populate("user_id")
            .lean()
            .exec();
        if (!board) {
            return {
                success: false,
                message: "Associated board not found",
            };
        }
        if (board.user_id._id.toString() !== ownerId) {
            return {
                success: false,
                message: "Unauthorized: Only board owners can remove members",
            };
        }
        // 3. Get the board title, board owner name, member name, member email
        const boardTitle = board.title;
        const ownerName = board.user_id.firstname;
        const memberName = member.user_id.firstname;
        const memberEmail = member.user_id.email;
        // 4. Remove the member from the board
        const deletedMember = await BoardMember.deleteOne({ _id: memberId }).exec();
        if (deletedMember.deletedCount === 0) {
            return {
                success: false,
                message: "Failed to delete board member",
            };
        }
        // 5. Send a membership revocation email to member
        sendMembershipRemovalEmail(memberEmail, ownerName, memberName, boardTitle);
        console.log("Member removed from board", {
            boardTitle,
            ownerName,
            memberName,
            memberEmail,
        });
        // 6. Send op status to client
        return {
            success: true,
            message: "Board member successfully deleted",
        };
    }
    catch (error) {
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
//# sourceMappingURL=delete.member.service.js.map
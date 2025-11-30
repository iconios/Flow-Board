/*
#Plan:
1. Get and validate the user id
2. Get the boards of the user, all the IDs and the boards the user is a member of
3. Send all the boards data to the user
*/
import { MongooseError, Types } from "mongoose";
import Board from "../../models/board.model.js";
import BoardMember from "../../models/boardMember.model.js";
const ReadBoardService = async (user_id) => {
    try {
        // 1. Get and validate the user id
        const id = user_id.trim();
        if (!Types.ObjectId.isValid(id)) {
            return {
                success: false,
                message: "Invalid user ID",
            };
        }
        // 2. Get the boards of the user, all the IDs and the boards the user is a member of
        const boardIDsUserIsMember = await BoardMember.find({ user_id })
            .select("board_id")
            .lean()
            .exec();
        const boardIds = boardIDsUserIsMember.map((board) => board.board_id);
        const userBoardOrIsMember = await Board.find({
            $or: [{ _id: { $in: boardIds } }, { user_id: id }],
        })
            .populate("user_id")
            .exec();
        const boardsToReturn = userBoardOrIsMember.map((board) => ({
            _id: board._id.toString(),
            title: board.title,
            bg_color: board.bg_color,
            user: {
                _id: board.user_id._id.toString(),
                email: board.user_id.email,
                firstname: board.user_id.firstname,
            },
            created_at: board.created_at.toString(),
            updated_at: board.updated_at.toString(),
        }));
        // 3. Send all the boards data to the user
        console.log("Response to client", boardsToReturn);
        return {
            success: true,
            message: "Boards retrieved",
            boards: boardsToReturn,
        };
    }
    catch (error) {
        console.error(`Error retrieving boards for ${user_id}`, error);
        if (error instanceof MongooseError) {
            return {
                success: false,
                message: "Error retrieving boards",
            };
        }
        return {
            success: false,
            message: "Unknown error. Please try again",
        };
    }
};
export default ReadBoardService;
//# sourceMappingURL=read.board.service.js.map
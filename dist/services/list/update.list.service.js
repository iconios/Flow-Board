/*
#Plan:
1. Receive and validate list ID, board ID and the update details
2. Verify that the list is owned by the user or the user is a board member
3. Update the list accordingly
4. Send the op update to client
*/
import List from "../../models/list.model.js";
import { UpdateListInputSchema, } from "../../types/list.type.js";
import { MongooseError, Types } from "mongoose";
import { ZodError } from "zod";
import GetBoardId from "../../utils/get.boardId.util.js";
import BoardMember from "../../models/boardMember.model.js";
const UpdateListService = async (list, user, updateListInput) => {
    try {
        // 1. Receive and validate list ID, board ID and the update details
        const listId = list.trim();
        if (!Types.ObjectId.isValid(listId)) {
            return {
                success: false,
                message: "Invalid list ID format",
            };
        }
        const userId = user;
        const validatedInput = UpdateListInputSchema.parse(updateListInput);
        if (Object.keys(validatedInput).length === 0) {
            return {
                success: false,
                message: "Update data empty",
            };
        }
        const board = await GetBoardId({ listId });
        const boardId = board.board?.id;
        if (!boardId) {
            return {
                success: false,
                message: board.message ?? "Board ID for list not found",
            };
        }
        // 2. Verify that the list is owned by the user or the user is a board member
        const userOwnsList = await List.findOne({
            userId,
            _id: listId,
        })
            .lean()
            .exec();
        const userIsBoardMember = await BoardMember.findOne({
            user_id: userId,
            board_id: boardId,
        })
            .lean()
            .exec();
        if (!userOwnsList && !userIsBoardMember) {
            return {
                success: false,
                message: "List not found or access denied",
            };
        }
        // 3. Update the list accordingly
        const updatedList = await List.findOneAndUpdate({
            _id: listId,
        }, validatedInput, { new: true }).exec();
        if (!updatedList) {
            return {
                success: false,
                message: "Failed to update list",
            };
        }
        // 4. Send the op update to client
        const tasks = updatedList.tasks?.map((task) => task._id.toString());
        return {
            success: true,
            message: "List updated successfully",
            list: {
                id: updatedList._id.toString(),
                title: updatedList.title,
                position: updatedList.position,
                status: updatedList.status,
                userId: updatedList.userId.toString(),
                boardId: updatedList.boardId.toString(),
                tasks: tasks,
            },
        };
    }
    catch (error) {
        console.log(`Error updating list ${list}`, error);
        if (error instanceof ZodError) {
            return {
                success: false,
                message: "Error validating update data",
            };
        }
        if (error instanceof MongooseError) {
            return {
                success: false,
                message: "Error while updating data",
            };
        }
        return {
            success: false,
            message: "Unknown error. Please try again",
        };
    }
};
export default UpdateListService;
//# sourceMappingURL=update.list.service.js.map
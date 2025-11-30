/*
#Plan:
1. Get and validate the list ID and board ID
2. Verify the user owns the task's list or is a board member
3. Get the tasks associated with the list
4. Send the tasks to the user
*/
import { MongooseError, Types } from "mongoose";
import List from "../../models/list.model.js";
import BoardMember from "../../models/boardMember.model.js";
import GetBoardId from "../../utils/get.boardId.util.js";
import Task from "../../models/task.model.js";
const ReadTaskService = async (user, list) => {
    try {
        // 1. Get and validate the list ID and board ID
        const listId = list.trim();
        if (!listId) {
            return {
                success: false,
                message: "List ID required",
            };
        }
        if (!Types.ObjectId.isValid(listId)) {
            return {
                success: false,
                message: "Invalid list ID format",
            };
        }
        const userId = user.trim();
        const board = await GetBoardId({ listId });
        const boardId = board.board?.id;
        if (!boardId) {
            return {
                success: false,
                message: board.message ?? "Board not found for task's list",
            };
        }
        // 2. Verify the user owns the task's list or is a board member
        const userOwnsList = await List.findOne({
            _id: listId,
            userId,
        })
            .select("_id")
            .lean()
            .exec();
        const userIsBoardMember = await BoardMember.findOne({
            user_id: userId,
            board_id: boardId,
        })
            .select("_id")
            .lean()
            .exec();
        if (!userOwnsList && !userIsBoardMember) {
            return {
                success: false,
                message: "Access denied to Tasks",
            };
        }
        // 3. Get the tasks associated with the list
        const tasksFetched = await Task.find({ listId }).lean().exec();
        const tasksToReturn = tasksFetched.map((task) => ({
            id: task._id.toString(),
            title: task.title,
            description: task.description ?? "",
            priority: task.priority,
            position: task.position ?? 0,
            dueDate: task.dueDate ?? "",
            listId: task.listId,
        }));
        // 4. Send the tasks to the user
        return {
            success: true,
            message: `${tasksToReturn.length} task(s) found`,
            tasks: tasksToReturn,
        };
    }
    catch (error) {
        console.error("Error fetching tasks", error);
        if (error instanceof MongooseError) {
            return {
                success: false,
                message: "Error while fetching task data",
            };
        }
        return {
            success: false,
            message: "Unknown error. Please try again",
        };
    }
};
export default ReadTaskService;
//# sourceMappingURL=read.task.service.js.map
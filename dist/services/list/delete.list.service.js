/*
#plan:
1. Get and validate the list ID, board ID, and user ID
2. Verify that the user owns the list or is a board member
3. Get the IDs of all the tasks from within the list
4. Delete all the comments of each task from the collection
5. Delete the tasks from the collection
6. Remove the list from the board
7. Delete the list from the collection
8. Send the report to the client
9. Produce activity log
10. Handle errors and end the session
*/
import { startSession, Types } from "mongoose";
import Board from "../../models/board.model.js";
import List from "../../models/list.model.js";
import Task from "../../models/task.model.js";
import GetBoardId from "../../utils/get.boardId.util.js";
import BoardMember from "../../models/boardMember.model.js";
import Comment from "../../models/comment.model.js";
import { produceActivity } from "../../redis/activity.producer.js";
const DeleteListService = async (userId, listId) => {
    // 1. Get and validate the list ID, board ID, and user ID
    if (!Types.ObjectId.isValid(listId.trim())) {
        return {
            success: false,
            message: "Invalid list ID format",
        };
    }
    const board = await GetBoardId({ listId });
    const boardId = board.board?.id;
    if (!boardId) {
        return {
            success: false,
            message: board.message ?? "Board for list does not exist",
        };
    }
    const session = await startSession();
    let result = null;
    try {
        await session.withTransaction(async () => {
            // 2. Verify that the user owns the list or is a board member
            const userOwnsList = await List.findOne({
                _id: listId,
                userId,
            })
                .lean()
                .session(session)
                .exec();
            const userIsBoardMember = await BoardMember.findOne({
                user_id: userId,
                board_id: boardId,
            })
                .lean()
                .session(session)
                .exec();
            if (!userOwnsList && !userIsBoardMember) {
                throw new Error("Board not found or access denied");
            }
            // 3. Get the IDs of all the tasks from within the list
            const listToBeDeleted = await List.findById(listId)
                .session(session)
                .exec();
            if (!listToBeDeleted) {
                throw new Error("List not found");
            }
            const tasksIDs = listToBeDeleted.tasks || [];
            // 4. Delete all the comments of each task from the collection
            await Promise.all(tasksIDs?.map(async (taskID) => {
                await Comment.deleteMany({
                    taskId: taskID,
                })
                    .session(session)
                    .exec();
            }));
            // 5. Delete the tasks from the collection
            if (tasksIDs.length > 0) {
                await Task.deleteMany({
                    _id: { $in: tasksIDs },
                })
                    .session(session)
                    .exec();
            }
            // 6. Remove the list from the board
            await Board.findByIdAndUpdate(boardId, {
                $pull: { lists: listId },
            })
                .session(session)
                .exec();
            // 7. Delete the list from the collection
            const { deletedCount } = await List.deleteOne({ _id: listId })
                .session(session)
                .exec();
            if (!deletedCount) {
                throw new Error("Error while deleting the list");
            }
            // 8. Send the report to the client
            const tasks = tasksIDs.map((task) => task._id.toString());
            result = {
                success: true,
                message: "List successfully deleted",
                list: {
                    id: listToBeDeleted._id.toString(),
                    title: listToBeDeleted.title,
                    position: listToBeDeleted.position,
                    status: listToBeDeleted.status,
                    boardId: listToBeDeleted.boardId.toString(),
                    userId: listToBeDeleted.userId.toString(),
                    tasks: tasks,
                },
            };
        });
        if (result) {
            // 9. Produce activity log
            void produceActivity({
                userId,
                activityType: "delete",
                object: "List",
                objectId: listId,
            }).catch((err) => console.error(`Activity log failed for list deletion: ${listId}`, err));
            return result;
        }
        else {
            throw new Error("List deleted successfully but returned nothing");
        }
    }
    catch (error) {
        console.error("Error while deleting list", error);
        if (error instanceof Error) {
            if (error.message === "Board not found or access denied") {
                return {
                    success: false,
                    message: "Board not found or access denied",
                };
            }
            if (error.message === "List not found") {
                return {
                    success: false,
                    message: "List not found",
                };
            }
            if (error.message === "Error while deleting the list") {
                return {
                    success: false,
                    message: "Error while deleting the list",
                };
            }
            if (error.message === "List deleted successfully but returned nothing") {
                return {
                    success: false,
                    message: "List deleted successfully but returned nothing",
                };
            }
        }
        return {
            success: false,
            message: "Unknown error. Please try again",
        };
    }
    finally {
        await session.endSession();
    }
};
export default DeleteListService;
//# sourceMappingURL=delete.list.service.js.map
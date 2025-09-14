/*
#plan:
1. Get and validate the list ID, and user ID
2. Get the board the list belongs to and verify that the user owns the board
3. Get the IDs of all the tasks from within the list
4. Delete the tasks from the collection
5. Remove the list from the board
6. Delete the list from the collection
7. Send the report to the client
*/

import { startSession, Types } from "mongoose";
import type { DeleteListOutputType } from "../../types/list.type.js";
import Board from "../../models/board.model.js";
import List from "../../models/list.model.js";
import Task from "../../models/task.model.js";

const DeleteListService = async (userId: string, listId: string) => {
  const session = await startSession();
  let result: DeleteListOutputType | null = null;

  // 1. Get and validate the list ID, and user ID
  if (!Types.ObjectId.isValid(listId.trim())) {
    return {
      success: false,
      message: "Invalid list ID format",
    };
  }
  const listObjectId = new Types.ObjectId(listId.trim());

  try {
    await session.withTransaction(async () => {
      // 2. Get the board the list belongs to and verify that the user owns the board
      const board = await Board.findOne({
        lists: listObjectId,
        user_id: userId,
      })
        .session(session)
        .exec();
      if (!board) {
        throw new Error("Board not found");
      }

      // 3. Get the IDs of all the tasks from within the list
      const listToBeDeleted = await List.findById(listId)
        .select("_id title position status tasks")
        .session(session)
        .exec();
      if (!listToBeDeleted) {
        throw new Error("List not found");
      }
      const tasksIDs = listToBeDeleted.tasks || [];

      // 4. Delete the tasks from the collection
      if (tasksIDs.length > 0) {
        await Task.deleteMany({
          _id: { $in: tasksIDs },
        })
          .session(session)
          .exec();
      }

      // 5. Remove the list from the board
      await Board.findByIdAndUpdate(board._id, {
        $pull: { lists: listObjectId },
      })
        .session(session)
        .exec();

      // 6. Delete the list from the collection
      const { deletedCount } = await List.deleteOne({ _id: listId })
        .session(session)
        .exec();
      if (!deletedCount) {
        throw new Error("Error while deleting the list");
      }

      // 7. Send the report to the client
      result = {
        success: true,
        message: "List successfully deleted",
        list: {
          title: listToBeDeleted.title,
          position: listToBeDeleted.position,
          status: listToBeDeleted.status,
        },
      };
    });

    if (result) {
      return result;
    } else {
      throw new Error("List deleted successfully but returned nothing");
    }
  } catch (error) {
    console.error("Error while deleting list", error);

    if (error instanceof Error) {
      if (error.message === "Board not found") {
        return {
          success: false,
          message: "Board not found",
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
  } finally {
    await session.endSession();
  }
};

export default DeleteListService;

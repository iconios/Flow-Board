/*
#Plan: Get the Board ID for any inputs (list ID, task ID)
1. Get and validate the input and ensure only one input is given per time
2. If input is list ID, get the board ID
3. If input is task ID, get the board ID
4. If input is comment ID, get the board ID
5. Return the board ID to the user
*/
import { MongooseError, Types } from "mongoose";
import { GetBoardIdInputSchema } from "../types/board.type.js";
import Board from "../models/board.model.js";
import List from "../models/list.model.js";
import Comment from "../models/comment.model.js";
import { ZodError } from "zod";
const GetBoardId = async (getBoardIdInput) => {
  try {
    // 1. Get and validate the input and ensure only one input is given per time
    const validatedInput = GetBoardIdInputSchema.parse(getBoardIdInput);
    const inputKey = Object.keys(validatedInput);
    if (
      inputKey.length !== 1 ||
      (inputKey[0] !== "listId" &&
        inputKey[0] !== "taskId" &&
        inputKey[0] !== "commentId")
    ) {
      return {
        success: false,
        message: "Required input missing",
      };
    }
    // 2. If input is list ID, get the board ID
    const listId = validatedInput.listId;
    if (listId && Types.ObjectId.isValid(listId)) {
      const boardList = await Board.findOne({
        lists: listId,
      })
        .select("_id")
        .lean()
        .exec();
      if (!boardList) {
        return {
          success: false,
          message: "Board not found for list",
        };
      }
      return {
        success: true,
        message: "Board found for list",
        board: {
          id: boardList._id.toString(),
        },
      };
    }
    // 3. If input is task ID, get the board ID
    const taskId = validatedInput.taskId;
    if (taskId && Types.ObjectId.isValid(taskId)) {
      const listTask = await List.findOne({
        tasks: taskId,
      })
        .select("_id")
        .lean()
        .exec();
      if (!listTask) {
        return {
          success: false,
          message: "List not found for task",
        };
      }
      const boardList = await Board.findOne({
        lists: listTask._id.toString(),
      })
        .select("_id")
        .lean()
        .exec();
      if (!boardList) {
        return {
          success: false,
          message: "Board not found for task",
        };
      }
      return {
        success: true,
        message: "Board found for task",
        board: {
          id: boardList._id.toString(),
        },
      };
    }
    // 4. If input is comment ID, get the board ID
    const commentId = validatedInput.commentId;
    if (commentId && Types.ObjectId.isValid(commentId)) {
      const comment = await Comment.findById(commentId)
        .select("taskId")
        .lean()
        .exec();
      if (!comment) {
        return {
          success: false,
          message: "Comment not found",
        };
      }
      const taskComment = comment.taskId?.toString();
      if (!taskComment) {
        return {
          success: false,
          message: "Comment's task not found",
        };
      }
      const listTask = await List.findOne({
        tasks: taskComment,
      })
        .select("_id")
        .lean()
        .exec();
      if (!listTask) {
        return {
          success: false,
          message: "Task not found for comment",
        };
      }
      const boardList = await Board.findOne({
        lists: listTask._id.toString(),
      })
        .select("_id")
        .lean()
        .exec();
      if (!boardList) {
        return {
          success: false,
          message: "Board not found for list",
        };
      }
      return {
        success: true,
        message: "Board found for comment",
        board: {
          id: boardList._id.toString(),
        },
      };
    }
    return {
      success: false,
      message: "No valid input provided",
    };
  } catch (error) {
    console.error("Error getting board Id", error);
    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Error validating input",
      };
    }
    if (error instanceof MongooseError) {
      return {
        success: false,
        message: "Database error while getting board Id",
      };
    }
    return {
      success: false,
      message: "Error getting board Id",
    };
  }
};
export default GetBoardId;
//# sourceMappingURL=get.boardId.util.js.map

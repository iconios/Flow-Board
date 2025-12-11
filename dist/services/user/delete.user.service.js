// Delete User Service
/*
#Plan:
1. Get the user id
2. Start user transaction session
    2a. Validate the user id
    2b. Get all the IDs of the boards the user owns
    2c. Call the Delete Board Service and pass each board id to it
    2d. Delete the user account
3. Send status to the client
*/
import { MongooseError, Types } from "mongoose";
import Board from "../../models/board.model.js";
import DeleteBoardService from "../board/delete.board.service.js";
import User from "../../models/user.model.js";
const DeleteUserService = async (userId) => {
  // 1. Validate the user id
  if (!Types.ObjectId.isValid(userId)) {
    return {
      success: false,
      message: "Invalid user ID",
    };
  }
  // 2. Start user transaction session
  const session = await User.startSession();
  try {
    await session.withTransaction(async () => {
      // 2a. Validate the user id is available
      const isUserFound = await User.findById(userId)
        .session(session)
        .lean()
        .exec();
      if (!isUserFound) {
        throw new Error("User not found");
      }
      // 2b. Get all the IDs of the boards the user owns
      const boards = await Board.find({ user_id: userId })
        .select("_id")
        .session(session)
        .lean()
        .exec();
      // 2c. Call the Delete Board Service and pass each board id to it
      if (boards.length > 0) {
        for (let board of boards) {
          const boardId = board._id.toString();
          const result = await DeleteBoardService(boardId, userId, session);
          if (!result.success) {
            throw new Error(
              `Failed to delete board ${boardId}: ${result.message}`,
            );
          }
        }
      }
      // 2d. Delete the user account
      const { deletedCount } = await User.deleteOne({ _id: userId })
        .session(session)
        .lean()
        .exec();
      if (deletedCount === 0) {
        throw new Error("User already deleted or not found");
      }
    });
    // 3. Send status to the client
    console.log("User deleted successfully");
    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting user", error);
    if (error instanceof MongooseError) {
      return {
        success: false,
        message: "Database error while deleting user",
      };
    }
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Unexpected error while deleting user",
    };
  } finally {
    // End the session
    await session.endSession();
  }
};
export default DeleteUserService;
//# sourceMappingURL=delete.user.service.js.map

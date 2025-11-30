// Socket join room
/*
  #Plan
  1. Get the room ID
  2. Verify that the user is a board member
  3. Verify that the user is not the board owner
  4. Add the user to the room
  */
import GetBoardId from "./get.boardId.util.js";
import BoardMember from "../models/boardMember.model.js";
import {} from "../types/socket.io.type.js";
import { ZodError } from "zod";
import { MongooseError, Types } from "mongoose";
import Board from "../models/board.model.js";
const JoinRoomUtility = async (socket, roomId) => {
    try {
        //   1. Get the room ID
        if (!roomId) {
            socket.emit("room:join:error", { message: "Room ID missing" });
            return;
        }
        const [entity, entityId] = roomId.split("-");
        if (entity !== "listId" && entity !== "taskId" && entity !== "commentId") {
            socket.emit("room:join:error", { message: "Room entity missing" });
            return;
        }
        if (entityId && !Types.ObjectId.isValid(entityId)) {
            socket.emit("room:join:error", { message: "Invalid entity ID format" });
            return;
        }
        //  2. Verify that the user is a board member
        const userId = socket.data?.userId;
        if (!userId) {
            socket.emit("room:join:error", { message: "User ID not found" });
            return;
        }
        const validatedEntity = entity;
        const board = GetBoardId({ [validatedEntity]: entityId });
        const boardId = (await board).board?.id;
        if (!boardId) {
            socket.emit("room:join:error", { message: "Board not found" });
            return;
        }
        // const userIsBoardMember = await BoardMember.findOne({
        //   user_id: userId,
        //   board_id: boardId,
        // }).exec();
        // if (!userIsBoardMember) {
        //   socket.emit("room:join:error", {
        //     message: "Only board members are allowed",
        //   });
        //   return;
        // }
        // //   3. Verify that the user is not the board owner
        // const userOwnsBoard = await Board.findOne({
        //   _id: boardId,
        //   user_id: userId,
        // })
        //   .lean()
        //   .exec();
        // if (userOwnsBoard) {
        //   socket.emit("room:join:error", { message: "Board owner cannot join" });
        //   return;
        // }
        //  4. Add the user to the room
        socket.join(roomId);
        console.log(`User ${userId} joined the room ${roomId}`);
        socket.emit("room:join:success", {
            message: "Joining room successful",
            roomId,
        });
    }
    catch (error) {
        console.error(`Error joining user to room ${roomId}`, error);
        if (error instanceof ZodError) {
            socket.emit("room:join:error", { message: "Error casting room id" });
            return;
        }
        if (error instanceof MongooseError) {
            socket.emit("room:join:error", {
                message: "Database error while validating user",
            });
            return;
        }
        socket.emit("room:join:error", {
            message: "Unknown error. Please try again",
        });
        return;
    }
};
export default JoinRoomUtility;
//# sourceMappingURL=join.room.util.js.map
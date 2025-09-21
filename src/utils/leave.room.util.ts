/*
#Plan:
1. Get and validate the roomId and userId
2. Just leave 
*/

import type { Socket } from "socket.io";

const LeaveRoomUtility = (socket: Socket, roomId: string): void => {
  //   1. Get and validate the roomId and userId
  if (!roomId) {
    socket.emit("room:leave:error", { message: "Room ID missing" });
    return;
  }

  const userId = socket.data?.userId;
  if (!userId) {
    socket.emit("room:leave:error", { message: "User ID not found" });
    return;
  }

  // 2. Just leave
  socket.leave(roomId);
  socket.emit("room:leave:success", {
    message: "Left the room successfully",
    roomId,
  });
  console.log(`User ${userId} left the room ${roomId}`);
};

export default LeaveRoomUtility;

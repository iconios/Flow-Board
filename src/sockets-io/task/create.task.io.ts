/*
#Plan:
1. Get and validate the user id and the task data from socket
2. Send the task data to all the board members in the same room as the socket
*/

import type { Socket } from "socket.io";
import type { CreateTaskInputType } from "../../types/task.type.js";
import CreateTaskService from "../../services/task/create.task.service.js";

const CreateTaskIO = async (socket: Socket, taskData: CreateTaskInputType) => {
  try {
    // 1. Get and validate the user id from socket
    const userId = socket.data.userId;
    if (!userId) {
      return;
    }

    // 2. Pass the task data to the task create service and the response
    const result = await CreateTaskService(userId, taskData);

    // 3. Send the response to the socket
    if (!result.success) {
      socket.emit("task:update_error", result.message);
    }

    return socket.broadcast.to("/task").emit("task:update", result.task);
  } catch (error) {
    console.error("Error creating task IO", error);

    socket.emit("task:update:error", "Server error. Please try again");
  }
};

export default CreateTaskIO;

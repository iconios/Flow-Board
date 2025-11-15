/*
#Plan: Task Move
1. Get and validate the task move parameters - userId, taskId, listId
2. Call the Update Task Service with the parameters
3. Get the response from the List Update Service
4. Broadcast result to all room members
*/

import type { Socket } from "socket.io";
import {
  TaskMoveInputSchema,
  type TaskMoveInputType,
} from "./types/task.type.js";
import UpdateTaskService from "./services/task/update.task.service.js";
import { ZodError } from "zod";

const TaskMoveUtility = async (socket: Socket, payload: TaskMoveInputType) => {
  // 1. Get and validate the task move parameters - userId, taskId, listId
  const userId = socket.data?.userId;

  try {
    console.log("Task move data received", {
      payload,
    });
    const { data } = TaskMoveInputSchema.parse(payload);
    const { taskId, listId } = data;

    // 2. Call the Update Task Service with the parameters
    const result = await UpdateTaskService(userId, taskId, { listId });

    // 3. Get the response from the List Update Service
    if (!result.success) {
      socket.emit("task:move:error", {
        message: result.message || "Failed to move task",
      });
      return;
    }

    // 4. Broadcast result to all room members
    const roomName = `listId-${listId}`;
    socket.to(roomName).emit("task:move:success", {
      message: `Task ${taskId} moved successfully`,
      data: result.task,
    });
  } catch (error) {
    console.error("Error moving task", error);

    if (error instanceof ZodError) {
      socket.emit("task:move:error", {
        message: "Error validating task move data",
      });
      return;
    }

    const errorMessage =
      error instanceof Error ? `${error.message}` : "Error moving task";
    socket.emit("task:move:error", {
      message: errorMessage,
    });
  }
};

export default TaskMoveUtility;

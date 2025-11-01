/*
#Plan: Task Reorder
1. Get and validate the task reorder parameters - userId, taskId, listId, new Position
2. Call the Update Task Service with the parameters
3. Get the response from the List Update Service
4. Broadcast result to all room members
*/
import { TaskReorderInputSchema } from "../types/task.type.js";
import { ZodError } from "zod";
import UpdateTaskService from "../services/task/update.task.service.js";
const TaskReorderUtility = async (socket, payload) => {
    // 1. Get and validate the task move parameters - userId, taskId, listId, new Position
    const userId = socket.data?.userId;
    try {
        const { data } = TaskReorderInputSchema.parse(payload);
        const { taskId, listId, position } = data;
        console.log(`Task reorder attempt - User: ${userId}, Task: ${taskId}, Target List: ${listId}, Position: ${position}`);
        // 2. Call the Update Task Service with the parameters
        const result = await UpdateTaskService(userId, taskId, { listId });
        // 3. Get the response from the List Update Service
        if (!result.success) {
            socket.emit("task:reorder:error", {
                message: result.message || "Task reorder failed"
            });
            return;
        }
        // 4. Broadcast result to all room members
        const roomName = `listId-${listId}`;
        socket.to(roomName).emit("task:reorder:success", {
            message: `Task ${taskId} reordered successfully`,
            data: result.task
        });
    }
    catch (error) {
        console.error("Error reordering task", error);
        if (error instanceof ZodError) {
            socket.emit("task:reorder:error", {
                message: "Task reorder input validation error"
            });
            return;
        }
        const errorMessage = error instanceof Error ? `${error.message}` : "Error reordering task";
        socket.emit("task:reorder:error", {
            message: errorMessage
        });
    }
};
export default TaskReorderUtility;
//# sourceMappingURL=task.reorder.util.js.map
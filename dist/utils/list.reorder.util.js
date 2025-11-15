/*
#Plan:
1. Accept the List reorder parameters - userId, listId, and list newPosition
2. Call the List Update Service and pass the parameters to it
3. Get the response from the List Update Service
4. Broadcast result to all room members
*/
import UpdateListService from "../services/list/update.list.service.js";
import { ListReorderInputSchema } from "../types/list.type.js";
import { ZodError } from "zod";
const ListReorderUtility = async (socket, payload) => {
  // 1. Accept the List reorder parameters - userId, listId, and list newPosition
  const userId = socket.data?.userId;
  try {
    const { data } = ListReorderInputSchema.parse(payload);
    const { listId, position } = data;
    console.log(
      `List reorder attempt - User: ${userId}, List: ${listId}, New Position: ${position}`,
    );
    // 2. Call the List Update Service and pass the parameters to it
    const result = await UpdateListService(listId, userId, { position });
    // 3. Get the response from the List Update Service
    if (!result.success) {
      socket.emit("list:reorder:error", {
        message: result.message || "Failed to reorder list",
      });
      return;
    }
    // 4. Broadcast result to all room members
    const roomName = `listId-${listId}`;
    socket.to(roomName).emit("list:reorder:success", {
      message: `List ${listId} reordered successfully`,
      data: result.list,
    });
    console.log(`List reorder successful - User: ${userId}, List: ${listId}`);
  } catch (error) {
    console.error("Error reordering list", error);
    if (error instanceof ZodError) {
      socket.emit("list:reorder:error", {
        message: "list reorder input validation error",
      });
      return;
    }
    const errorMessage =
      error instanceof Error ? `${error.message}` : "Error reordering list";
    socket.emit("list:reorder:error", {
      message: errorMessage,
    });
  }
};
export default ListReorderUtility;
//# sourceMappingURL=list.reorder.util.js.map

import { z } from "zod";
export const RoomIdSchema = z
  .object({
    entity: z.enum(["listId", "taskId", "commentId"]),
    entityId: z.string(),
  })
  .strict();
export const RoomIdEntitySchema = z.enum(["listId", "taskId", "commentId"]);
export const RoomIdEntityIdSchema = z.string();
//# sourceMappingURL=socket.io.type.js.map

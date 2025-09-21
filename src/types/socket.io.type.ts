import { z } from "zod";

export const RoomIdSchema = z
  .object({
    entity: z.enum(["listId", "taskId", "commentId"]),
    entityId: z.string(),
  })
  .strict();

export type RoomIdType = z.infer<typeof RoomIdSchema>;

export const RoomIdEntitySchema = z.enum(["listId", "taskId", "commentId"]);
export const RoomIdEntityIdSchema = z.string();

export type RoomIdEntityIdType = z.infer<typeof RoomIdEntityIdSchema>;
export type RoomIdEntityType = z.infer<typeof RoomIdEntitySchema>;

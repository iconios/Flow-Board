import { z } from "zod";
export declare const RoomIdSchema: z.ZodObject<
  {
    entity: z.ZodEnum<{
      listId: "listId";
      taskId: "taskId";
      commentId: "commentId";
    }>;
    entityId: z.ZodString;
  },
  z.core.$strict
>;
export type RoomIdType = z.infer<typeof RoomIdSchema>;
export declare const RoomIdEntitySchema: z.ZodEnum<{
  listId: "listId";
  taskId: "taskId";
  commentId: "commentId";
}>;
export declare const RoomIdEntityIdSchema: z.ZodString;
export type RoomIdEntityIdType = z.infer<typeof RoomIdEntityIdSchema>;
export type RoomIdEntityType = z.infer<typeof RoomIdEntitySchema>;
//# sourceMappingURL=socket.io.type.d.ts.map

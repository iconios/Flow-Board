import { z } from "zod";
import { TaskSchema } from "./task.type.js";
export const CreateListInputSchema = z
  .object({
    title: z
      .string()
      .trim()
      .regex(/[0-9A-Za-z]/),
    position: z.number(),
    boardId: z.string().trim(),
    status: z.enum(["active", "archive"]),
  })
  .strict();
const CreateListOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  list: z
    .object({
      id: z.string(),
      title: z.string(),
      position: z.number(),
      status: z.enum(["active", "archive"]),
      boardId: z.string(),
    })
    .optional(),
});
const ReadListOutputSchema = CreateListOutputSchema.pick({
  success: true,
  message: true,
}).extend({
  lists: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        position: z.number(),
        status: z.enum(["active", "archive"]),
        boardId: z.string(),
        tasks: z.array(TaskSchema),
      }),
    )
    .optional(),
});
const ListOutputSchema = z.object({
  _id: z.string(),
  title: z.string(),
  userId: z.string(),
  position: z.number(),
  status: z.enum(["active", "archive"]),
  boardId: z.string(),
  tasks: z.array(TaskSchema),
});
export const UpdateListInputSchema = z
  .object({
    title: z.string().nonempty().optional(),
    position: z.number().optional(),
    status: z.enum(["active", "archive"]).optional(),
  })
  .strict();
const UpdateListOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  list: z
    .object({
      title: z.string(),
      id: z.string(),
      status: z.enum(["active", "archive"]),
      position: z.number(),
      userId: z.string(),
      boardId: z.string(),
      tasks: z.array(z.string()),
    })
    .optional(),
});
const DeleteListOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  list: z
    .object({
      title: z.string(),
      position: z.number(),
      status: z.enum(["active", "archive"]),
      boardId: z.string(),
      userId: z.string(),
      id: z.string(),
      tasks: z.array(z.string()),
    })
    .optional(),
});
export const ListReorderInputSchema = z
  .object({
    data: z.object({
      listId: z.string(),
      position: z.number(),
    }),
  })
  .strict();
//# sourceMappingURL=list.type.js.map

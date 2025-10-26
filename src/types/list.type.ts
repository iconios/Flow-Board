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

export type CreateListInputType = z.infer<typeof CreateListInputSchema>;

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

export type CreateListOutputType = z.infer<typeof CreateListOutputSchema>;

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

export type ReadListOutputType = z.infer<typeof ReadListOutputSchema>;

const ListOutputSchema = z.object({
  _id: z.string(),
  title: z.string(),
  userId: z.string(),
  position: z.number(),
  status: z.enum(["active", "archive"]),
  boardId: z.string(),
  tasks: z.array(TaskSchema),
});
export type ListsOutputType = z.infer<typeof ListOutputSchema>;

export const UpdateListInputSchema = z
  .object({
    title: z.string().nonempty().optional(),
    position: z.number().optional(),
    status: z.enum(["active", "archive"]).optional(),
  })
  .strict();

export type UpdateListInputType = z.infer<typeof UpdateListInputSchema>;

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

export type UpdateListOutputType = z.infer<typeof UpdateListOutputSchema>;

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

export type DeleteListOutputType = z.infer<typeof DeleteListOutputSchema>;

export const ListReorderInputSchema = z
  .object({
    data: z.object({
      listId: z.string(),
      position: z.number(),
    })
  })
  .strict();

export type ListReorderInputType = z.infer<typeof ListReorderInputSchema>;

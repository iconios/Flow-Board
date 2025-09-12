import { z } from "zod";

export const CreateListInputSchema = z.object({
  title: z
    .string()
    .trim()
    .regex(/[0-9A-Za-z]/),
  position: z.number(),
  boardId: z.string().trim(),
  status: z.enum(["active", "archive"]),
});

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
        userId: z.string(),
      }),
    )
    .optional(),
});

export type ReadListOutputType = z.infer<typeof ReadListOutputSchema>;

import { z } from "zod";

const EditChecklistInputSchema = z
  .object({
    checklistId: z.string(),
    userId: z.string(),
    content: z.string(),
  })
  .strict();

export type EditChecklistInputType = z.infer<typeof EditChecklistInputSchema>;

const ReadChecklistResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(
    z.object({
      id: z.string(),
      taskId: z.string(),
      user: z.object({
        email: z.string(),
        firstname: z.string(),
        lastname: z.string(),
        id: z.string(),
      }),
      content: z.string(),
      boardId: z.string(),
      checked: z.boolean(),
      createdAt: z.iso.datetime(),
      updatedAt: z.iso.datetime(),
    }),
  ),
  error: z
    .object({
      code: z.string(),
      details: z.string(),
    })
    .or(z.null()),
  metadata: z.object({
    timestamp: z.string(),
    taskId: z.string(),
    userId: z.string(),
    count: z.number().optional(),
  }),
});

export type ReadChecklistResponseType = z.infer<
  typeof ReadChecklistResponseSchema
>;

export const DeleteChecklistInputSchema = z
  .object({
    userId: z.string(),
    checklistId: z.string(),
  })
  .strict();

export type DeleteChecklistInputType = z.infer<
  typeof DeleteChecklistInputSchema
>;

export const CreateChecklistInputSchema = z
  .object({
    content: z
      .string()
      .min(1, "Checklist content cannot be empty")
      .max(500, "Checklist content too long"),
    userId: z.string().nonempty(),
    taskId: z.string().nonempty(),
    boardId: z.string().nonempty(),
  })
  .strict();

export type CreateChecklistInputType = z.infer<
  typeof CreateChecklistInputSchema
>;

const CreateChecklistResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      id: z.string(),
      taskId: z.string(),
      userId: z.string(),
      boardId: z.string(),
      content: z.string(),
      checked: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
    .or(z.object({})),
  error: z
    .object({
      code: z.string(),
      details: z.string(),
    })
    .or(z.null()),
  metadata: z.object({
    timestamp: z.string(),
    taskId: z.string().optional(),
    userId: z.string().optional(),
    boardId: z.string().optional(),
    checklistId: z.string().optional(),
  }),
});

export type CreateChecklistResponseType = z.infer<
  typeof CreateChecklistResponseSchema
>;

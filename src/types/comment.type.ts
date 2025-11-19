import { z } from "zod";

export const CreateCommentInputSchema = z
  .object({
    content: z.string().trim(),
  })
  .strict();

export type CreateCommentInputType = z.infer<typeof CreateCommentInputSchema>;

const CreateCommentOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  comment: z
    .object({
      id: z.string(),
      content: z.string(),
      userId: z.string(),
      taskId: z.string(),
      createdAt: z.string(),
    })
    .optional(),
});

export type CreateCommentOutputType = z.infer<typeof CreateCommentOutputSchema>;

export const UpdateCommentInputSchema = z
  .object({
    content: z.string().trim(),
  })
  .strict();

export type UpdateCommentInputType = z.infer<typeof UpdateCommentInputSchema>;

const UpdateCommentOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  comment: z
    .object({
      id: z.string(),
      userId: z.string(),
      taskId: z.string(),
      content: z.string(),
      updatedAt: z.string(),
      createdAt: z.string(),
    })
    .optional(),
});

export type UpdateCommentOutputType = z.infer<typeof UpdateCommentOutputSchema>;

const ReadCommentOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  comments: z
    .array(
      z.object({
        id: z.string(),
        content: z.string(),
        createdAt: z.iso.datetime(),
        updatedAt: z.iso.datetime(),
        userId: z.string(),
        taskId: z.string(),
      }),
    )
    .optional(),
  count: z.number().optional(),
});

export type ReadCommentOutputType = z.infer<typeof ReadCommentOutputSchema>;

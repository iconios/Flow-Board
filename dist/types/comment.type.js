import { z } from "zod";
export const CreateCommentInputSchema = z
  .object({
    content: z.string().trim(),
  })
  .strict();
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
export const UpdateCommentInputSchema = z
  .object({
    content: z.string().trim(),
  })
  .strict();
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
      }),
    )
    .optional(),
  count: z.number().optional(),
});
//# sourceMappingURL=comment.type.js.map

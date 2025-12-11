import { z } from "zod";
export const BoardDetailsInputSchema = z.object({
  title: z.string().trim(),
  bg_color: z.string().trim().optional(),
  user_id: z.string(),
});
export const UpdateBoardInputSchema = z
  .object({
    title: z.string().trim().optional(),
    user_id: z.string(),
    bg_color: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6})$/, "Valid hex color code required")
      .optional(),
  })
  .strict();
const BoardDetailsSchema = z.object({
  _id: z.string(),
  title: z.string(),
  bg_color: z.string(),
  user: z.object({
    _id: z.string(),
    firstname: z.string(),
    email: z.string(),
  }),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});
export const BoardReadOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  boards: z.array(BoardDetailsSchema).optional(),
});
const BoardUpdateOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  board: z
    .object({
      id: z.string(),
      title: z.string(),
      bg_color: z.string(),
    })
    .optional(),
});
export const GetBoardIdInputSchema = z
  .object({
    listId: z.string().trim().nonempty().optional(),
    taskId: z.string().trim().nonempty().optional(),
    commentId: z.string().trim().nonempty().optional(),
  })
  .strict();
const GetBoardIdOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  board: z
    .object({
      id: z.string(),
    })
    .optional(),
});
//# sourceMappingURL=board.type.js.map

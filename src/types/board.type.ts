import { z } from "zod";

export const BoardDetailsInputSchema = z.object({
  title: z.string().trim().optional(),
  bg_color: z.string().trim().optional(),
  user_id: z.string(),
});

export type BoardDetailsInputType = z.infer<typeof BoardDetailsInputSchema>;

const BoardDetailsSchema = z.object({
  _id: z.string().optional(),
  title: z.string(),
  bg_color: z.string(),
  user_id: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  lists: z.array(z.string()),
});

export type BoardDetailsType = z.infer<typeof BoardDetailsSchema>;

export const BoardReadOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  boards: z.array(BoardDetailsSchema).optional(),
});

export type BoardReadOutputType = z.infer<typeof BoardReadOutputSchema>;

export type BoardDeleteOutputType = z.infer<typeof BoardReadOutputSchema>;

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

export type BoardUpdateOutputType = z.infer<typeof BoardUpdateOutputSchema>;

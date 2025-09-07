import { z } from 'zod';

export const BoardDetailsInputSchema = z.object({
      title: z.string().trim(),
      bg_color: z.string(),
      user_id: z.string(),
});

export type BoardDetailsInputType = z.infer<typeof BoardDetailsInputSchema>;

const BoardDetailsSchema = z.object({
    title: z.string(),
    bg_color: z.string(),
    user_id: z.string(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
    lists: z.array(z.string()),
})

export const BoardReadOutputSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    boards: z.array(BoardDetailsSchema).optional(),
})

export type BoardReadOutputType = z.infer<typeof BoardReadOutputSchema>;



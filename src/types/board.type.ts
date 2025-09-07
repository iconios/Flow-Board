import { z } from 'zod';

export const BoardDetailsInputSchema = z.object({
      title: z.string().trim(),
      bg_color: z.string(),
      user_id: z.string(),
});

export type BoardDetailsInputType = z.infer<typeof BoardDetailsInputSchema>;



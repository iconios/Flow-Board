import { z } from "zod";

export const CreateActivityInputSchema = z
  .object({
    activityType: z.enum(["move", "edit", "create", "delete"]),
    object: z.enum(["Board", "Task"]),
    objectId: z.string().trim(),
  })
  .strict();

export type CreateActivityInputType = z.infer<typeof CreateActivityInputSchema>;

const CreateActivityOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type CreateActivityOutputType = z.infer<
  typeof CreateActivityOutputSchema
>;

const ReadActivityOutputSchema = CreateActivityOutputSchema.extend({
  activities: z
    .array(
      z.object({
        activityType: z.string(),
        object: z.string(),
        objectId: z.string(),
        createdAt: z.string(),
      }),
    )
    .optional(),
});

export type ReadActivityOutputType = z.infer<typeof ReadActivityOutputSchema>;

export const ReadActivityInputSchema = z
  .object({
    object: z.enum(["Board", "Task"]),
    objectId: z.string().trim(),
  })
  .strict();

export type ReadActivityInputType = z.infer<typeof ReadActivityInputSchema>;

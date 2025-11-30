import { z } from "zod";
export const CreateActivityInputSchema = z
    .object({
    activityType: z.enum(["move", "edit", "create", "delete"]),
    object: z.enum(["Board", "Task"]),
    objectId: z.string().trim(),
})
    .strict();
const CreateActivityOutputSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});
const ReadActivityOutputSchema = CreateActivityOutputSchema.extend({
    activities: z
        .array(z.object({
        activityType: z.string(),
        object: z.string(),
        objectId: z.string(),
        createdAt: z.string(),
    }))
        .optional(),
});
export const ReadActivityInputSchema = z
    .object({
    object: z.enum(["Board", "Task"]),
    objectId: z.string().trim(),
})
    .strict();
//# sourceMappingURL=activity.type.js.map
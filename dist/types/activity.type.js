import { z } from "zod";
export const CreateActivityInputSchema = z
    .object({
    activityType: z.enum(["move", "edit", "create", "delete"]),
    object: z.enum(["Board", "Task", "Comment", "Checklist", "List", "Member"]),
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
        user: z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
        }),
    }))
        .optional(),
});
export const ReadActivityInputSchema = z
    .object({
    object: z.enum(["Board", "Task", "Comment", "Checklist", "List", "Member"]),
    objectId: z.string().trim(),
})
    .strict();
const PopulatedUserSchema = z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string(),
});
export const ActivityType = z.enum(["move", "edit", "create", "delete"]);
export const ActivityObjectType = z.enum([
    "Board",
    "Task",
    "Comment",
    "Checklist",
    "List",
    "Member",
]);
//# sourceMappingURL=activity.type.js.map
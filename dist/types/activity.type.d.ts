import { z } from "zod";
export declare const CreateActivityInputSchema: z.ZodObject<{
    activityType: z.ZodEnum<{
        delete: "delete";
        move: "move";
        edit: "edit";
        create: "create";
    }>;
    object: z.ZodEnum<{
        Board: "Board";
        Task: "Task";
    }>;
    objectId: z.ZodString;
}, z.core.$strict>;
export type CreateActivityInputType = z.infer<typeof CreateActivityInputSchema>;
declare const CreateActivityOutputSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
}, z.core.$strip>;
export type CreateActivityOutputType = z.infer<typeof CreateActivityOutputSchema>;
declare const ReadActivityOutputSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    activities: z.ZodOptional<z.ZodArray<z.ZodObject<{
        activityType: z.ZodString;
        object: z.ZodString;
        objectId: z.ZodString;
        createdAt: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type ReadActivityOutputType = z.infer<typeof ReadActivityOutputSchema>;
export declare const ReadActivityInputSchema: z.ZodObject<{
    object: z.ZodEnum<{
        Board: "Board";
        Task: "Task";
    }>;
    objectId: z.ZodString;
}, z.core.$strict>;
export type ReadActivityInputType = z.infer<typeof ReadActivityInputSchema>;
export {};
//# sourceMappingURL=activity.type.d.ts.map
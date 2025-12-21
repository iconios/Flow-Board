import { z } from "zod";
export declare const CreateActivityInputSchema: z.ZodObject<{
    activityType: z.ZodEnum<{
        move: "move";
        edit: "edit";
        create: "create";
        delete: "delete";
    }>;
    object: z.ZodEnum<{
        List: "List";
        Board: "Board";
        Task: "Task";
        Comment: "Comment";
        Checklist: "Checklist";
        Member: "Member";
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
        user: z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            email: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type ReadActivityOutputType = z.infer<typeof ReadActivityOutputSchema>;
export declare const ReadActivityInputSchema: z.ZodObject<{
    object: z.ZodEnum<{
        List: "List";
        Board: "Board";
        Task: "Task";
        Comment: "Comment";
        Checklist: "Checklist";
        Member: "Member";
    }>;
    objectId: z.ZodString;
}, z.core.$strict>;
export type ReadActivityInputType = z.infer<typeof ReadActivityInputSchema>;
declare const PopulatedUserSchema: z.ZodObject<{
    _id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
}, z.core.$strip>;
export type PopulatedUserType = z.infer<typeof PopulatedUserSchema>;
export declare const ActivityType: z.ZodEnum<{
    move: "move";
    edit: "edit";
    create: "create";
    delete: "delete";
}>;
export declare const ActivityObjectType: z.ZodEnum<{
    List: "List";
    Board: "Board";
    Task: "Task";
    Comment: "Comment";
    Checklist: "Checklist";
    Member: "Member";
}>;
export {};
//# sourceMappingURL=activity.type.d.ts.map
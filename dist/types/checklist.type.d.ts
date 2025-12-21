import { z } from "zod";
export declare const EditChecklistInputSchema: z.ZodObject<{
    checklistId: z.ZodString;
    content: z.ZodOptional<z.ZodString>;
    checked: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type EditChecklistInputType = z.infer<typeof EditChecklistInputSchema>;
declare const ReadChecklistResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        taskId: z.ZodString;
        user: z.ZodObject<{
            email: z.ZodString;
            firstname: z.ZodString;
            lastname: z.ZodString;
            id: z.ZodString;
        }, z.core.$strip>;
        content: z.ZodString;
        boardId: z.ZodString;
        checked: z.ZodBoolean;
        createdAt: z.ZodISODateTime;
        updatedAt: z.ZodISODateTime;
    }, z.core.$strip>>;
    error: z.ZodUnion<[z.ZodObject<{
        code: z.ZodString;
        details: z.ZodString;
    }, z.core.$strip>, z.ZodNull]>;
    metadata: z.ZodObject<{
        timestamp: z.ZodString;
        taskId: z.ZodString;
        userId: z.ZodString;
        count: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ReadChecklistResponseType = z.infer<typeof ReadChecklistResponseSchema>;
export declare const DeleteChecklistInputSchema: z.ZodObject<{
    userId: z.ZodString;
    checklistId: z.ZodString;
}, z.core.$strict>;
export type DeleteChecklistInputType = z.infer<typeof DeleteChecklistInputSchema>;
export declare const CreateChecklistInputSchema: z.ZodObject<{
    content: z.ZodString;
    userId: z.ZodString;
    taskId: z.ZodString;
    boardId: z.ZodString;
}, z.core.$strict>;
export type CreateChecklistInputType = z.infer<typeof CreateChecklistInputSchema>;
declare const CreateChecklistResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    data: z.ZodUnion<[z.ZodObject<{
        id: z.ZodString;
        taskId: z.ZodString;
        userId: z.ZodString;
        boardId: z.ZodString;
        content: z.ZodString;
        checked: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{}, z.core.$strip>]>;
    error: z.ZodUnion<[z.ZodObject<{
        code: z.ZodString;
        details: z.ZodString;
    }, z.core.$strip>, z.ZodNull]>;
    metadata: z.ZodObject<{
        timestamp: z.ZodString;
        taskId: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
        boardId: z.ZodOptional<z.ZodString>;
        checklistId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateChecklistResponseType = z.infer<typeof CreateChecklistResponseSchema>;
export declare const EditChecklistResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    data: z.ZodUnion<[z.ZodObject<{
        id: z.ZodString;
        taskId: z.ZodString;
        userId: z.ZodString;
        boardId: z.ZodString;
        content: z.ZodString;
        checked: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{}, z.core.$strip>]>;
    error: z.ZodUnion<[z.ZodObject<{
        code: z.ZodString;
        details: z.ZodString;
    }, z.core.$strip>, z.ZodNull]>;
    metadata: z.ZodObject<{
        timestamp: z.ZodString;
        taskId: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
        boardId: z.ZodOptional<z.ZodString>;
        checklistId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type EditChecklistResponseType = z.infer<typeof EditChecklistResponseSchema>;
declare const DeleteChecklistResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    data: z.ZodNullable<z.ZodObject<{}, z.core.$strip>>;
    error: z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        details: z.ZodString;
    }, z.core.$strip>>;
    metadata: z.ZodObject<{
        timestamp: z.ZodString;
        userId: z.ZodOptional<z.ZodString>;
        checklistId: z.ZodOptional<z.ZodString>;
        boardId: z.ZodOptional<z.ZodString>;
        deletedCount: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type DeleteChecklistResponseType = z.infer<typeof DeleteChecklistResponseSchema>;
export {};
//# sourceMappingURL=checklist.type.d.ts.map
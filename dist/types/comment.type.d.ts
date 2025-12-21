import { z } from "zod";
export declare const CreateCommentInputSchema: z.ZodObject<{
    content: z.ZodString;
}, z.core.$strict>;
export type CreateCommentInputType = z.infer<typeof CreateCommentInputSchema>;
declare const CreateCommentOutputSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    comment: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        content: z.ZodString;
        userId: z.ZodString;
        taskId: z.ZodString;
        createdAt: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreateCommentOutputType = z.infer<typeof CreateCommentOutputSchema>;
export declare const UpdateCommentInputSchema: z.ZodObject<{
    content: z.ZodString;
}, z.core.$strict>;
export type UpdateCommentInputType = z.infer<typeof UpdateCommentInputSchema>;
declare const UpdateCommentOutputSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    comment: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        taskId: z.ZodString;
        content: z.ZodString;
        updatedAt: z.ZodString;
        createdAt: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type UpdateCommentOutputType = z.infer<typeof UpdateCommentOutputSchema>;
declare const ReadCommentOutputSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    comments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        content: z.ZodString;
        createdAt: z.ZodISODateTime;
        updatedAt: z.ZodISODateTime;
        userId: z.ZodString;
        taskId: z.ZodString;
    }, z.core.$strip>>>;
    count: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type ReadCommentOutputType = z.infer<typeof ReadCommentOutputSchema>;
export {};
//# sourceMappingURL=comment.type.d.ts.map
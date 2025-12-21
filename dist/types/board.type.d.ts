import { z } from "zod";
export declare const BoardDetailsInputSchema: z.ZodObject<{
    title: z.ZodString;
    bg_color: z.ZodOptional<z.ZodString>;
    user_id: z.ZodString;
}, z.core.$strip>;
export type BoardDetailsInputType = z.infer<typeof BoardDetailsInputSchema>;
export declare const UpdateBoardInputSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    user_id: z.ZodString;
    bg_color: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type UpdateBoardInputType = z.infer<typeof UpdateBoardInputSchema>;
declare const BoardDetailsSchema: z.ZodObject<{
    _id: z.ZodString;
    title: z.ZodString;
    bg_color: z.ZodString;
    user: z.ZodObject<{
        _id: z.ZodString;
        firstname: z.ZodString;
        email: z.ZodString;
    }, z.core.$strip>;
    created_at: z.ZodISODateTime;
    updated_at: z.ZodISODateTime;
}, z.core.$strip>;
export type BoardDetailsType = z.infer<typeof BoardDetailsSchema>;
export declare const BoardReadOutputSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    boards: z.ZodOptional<z.ZodArray<z.ZodObject<{
        _id: z.ZodString;
        title: z.ZodString;
        bg_color: z.ZodString;
        user: z.ZodObject<{
            _id: z.ZodString;
            firstname: z.ZodString;
            email: z.ZodString;
        }, z.core.$strip>;
        created_at: z.ZodISODateTime;
        updated_at: z.ZodISODateTime;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type BoardReadOutputType = z.infer<typeof BoardReadOutputSchema>;
export type BoardDeleteOutputType = z.infer<typeof BoardReadOutputSchema>;
declare const BoardUpdateOutputSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    board: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        bg_color: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type BoardUpdateOutputType = z.infer<typeof BoardUpdateOutputSchema>;
export declare const GetBoardIdInputSchema: z.ZodObject<{
    listId: z.ZodOptional<z.ZodString>;
    taskId: z.ZodOptional<z.ZodString>;
    commentId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type GetBoardIdInputType = z.infer<typeof GetBoardIdInputSchema>;
declare const GetBoardIdOutputSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    board: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type GetBoardIdOutputType = z.infer<typeof GetBoardIdOutputSchema>;
export {};
//# sourceMappingURL=board.type.d.ts.map
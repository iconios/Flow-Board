import { z } from "zod";
declare const MemberSchema: z.ZodObject<{
    _id: z.ZodString;
    board_id: z.ZodString;
    user_id: z.ZodString;
    role: z.ZodEnum<{
        member: "member";
        admin: "admin";
    }>;
}, z.core.$strip>;
export type MemberType = z.infer<typeof MemberSchema>;
export declare const CreateMemberInputSchema: z.ZodObject<{
    board_id: z.ZodString;
    userEmail: z.ZodEmail;
    role: z.ZodOptional<z.ZodEnum<{
        member: "member";
        admin: "admin";
    }>>;
}, z.core.$strip>;
export type MemberCreateInputType = z.infer<typeof CreateMemberInputSchema>;
declare const MemberCreateOutputSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    member: z.ZodOptional<z.ZodObject<{
        memberId: z.ZodString;
        boardId: z.ZodString;
        userId: z.ZodString;
        role: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type MemberCreateOutputType = z.infer<typeof MemberCreateOutputSchema>;
declare const MemberReadOutputSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    members: z.ZodOptional<z.ZodArray<z.ZodObject<{
        memberId: z.ZodString;
        boardId: z.ZodString;
        user: z.ZodObject<{
            userId: z.ZodString;
            firstname: z.ZodString;
            email: z.ZodString;
        }, z.core.$strip>;
        role: z.ZodString;
        boardOwnerUserId: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type MemberReadOutputType = z.infer<typeof MemberReadOutputSchema>;
export declare const ReadMemberInputSchema: z.ZodObject<{
    userId: z.ZodString;
    boardId: z.ZodString;
}, z.core.$strip>;
export type ReadMemberInputType = z.infer<typeof ReadMemberInputSchema>;
export declare const DeleteMemberInputSchema: z.ZodObject<{
    memberId: z.ZodString;
}, z.core.$strip>;
export type DeleteMemberInputType = z.infer<typeof DeleteMemberInputSchema>;
declare const BoardMemberCreateSchema: z.ZodObject<{
    board_id: z.ZodString;
    user_id: z.ZodString;
    role: z.ZodString;
    created_at: z.ZodISODateTime;
    updated_at: z.ZodISODateTime;
    isVerified: z.ZodBoolean;
    verificationToken: z.ZodString;
    verificationTokenExpires: z.ZodISODateTime;
    generateVerificationToken: z.ZodFunction<z.core.$ZodFunctionArgs, z.core.$ZodFunctionOut>;
}, z.core.$strip>;
export type BoardMemberCreateType = z.infer<typeof BoardMemberCreateSchema>;
declare const BoardMemberReadOutputSchema: z.ZodObject<{
    _id: z.ZodString;
    board_id: z.ZodString;
    user_id: z.ZodObject<{
        _id: z.ZodString;
        firstname: z.ZodString;
        email: z.ZodString;
    }, z.core.$strip>;
    role: z.ZodString;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, z.core.$strip>;
export type BoardMemberReadOutputType = z.infer<typeof BoardMemberReadOutputSchema>;
declare const PopulatedMemberUserIdSchema: z.ZodObject<{
    _id: z.ZodString;
    firstname: z.ZodString;
    email: z.ZodString;
}, z.core.$strip>;
export type PopulatedMemberUserIdType = z.infer<typeof PopulatedMemberUserIdSchema>;
declare const PopulatedBoardUserIdSchema: z.ZodObject<{
    _id: z.ZodString;
    firstname: z.ZodString;
}, z.core.$strip>;
export type PopulatedBoardUserIdType = z.infer<typeof PopulatedBoardUserIdSchema>;
export {};
//# sourceMappingURL=member.type.d.ts.map
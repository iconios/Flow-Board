import { z } from "zod";

const MemberSchema = z.object({
  _id: z.string().trim(),
  board_id: z.string().trim(),
  user_id: z.string().trim(),
  role: z.enum(["member", "admin"]),
});

export type MemberType = z.infer<typeof MemberSchema>;

export const CreateMemberInputSchema = z.object({
  board_id: z.string().trim(),
  user_id: z.string().trim(),
  role: z.enum(["member", "admin"]).optional(),
});

export type MemberCreateInputType = z.infer<typeof CreateMemberInputSchema>;

const MemberCreateOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  member: z
    .object({
      memberId: z.string(),
      boardId: z.string(),
      role: z.string(),
    })
    .optional(),
});

export type MemberCreateOutputType = z.infer<typeof MemberCreateOutputSchema>;

const MemberReadOutputSchema = MemberCreateOutputSchema.omit({
  member: true,
}).extend({
  members: z.array(MemberSchema).optional(),
});

export type MemberReadOutputType = z.infer<typeof MemberReadOutputSchema>;

export const ReadMemberInputSchema = z.object({
  ownerId: z.string().trim(),
  boardId: z.string().trim(),
});

export type ReadMemberInputType = z.infer<typeof ReadMemberInputSchema>;

export const DeleteMemberInputSchema = z.object({
  memberId: z.string().trim(),
});

export type DeleteMemberInputType = z.infer<typeof DeleteMemberInputSchema>;

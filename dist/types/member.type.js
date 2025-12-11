import { z } from "zod";
const MemberSchema = z.object({
  _id: z.string().trim(),
  board_id: z.string().trim(),
  user_id: z.string().trim(),
  role: z.enum(["member", "admin"]),
});
export const CreateMemberInputSchema = z.object({
  board_id: z.string().trim(),
  userEmail: z.email(),
  role: z.enum(["member", "admin"]).optional(),
});
const MemberCreateOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  member: z
    .object({
      memberId: z.string(),
      boardId: z.string(),
      userId: z.string(),
      role: z.string(),
    })
    .optional(),
});
const MemberReadOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  members: z
    .array(
      z.object({
        memberId: z.string(),
        boardId: z.string(),
        user: z.object({
          userId: z.string(),
          firstname: z.string(),
          email: z.string(),
        }),
        role: z.string(),
        boardOwnerUserId: z.string(),
      }),
    )
    .optional(),
});
export const ReadMemberInputSchema = z.object({
  userId: z.string().trim(),
  boardId: z.string().trim(),
});
export const DeleteMemberInputSchema = z.object({
  memberId: z.string().trim(),
});
const BoardMemberCreateSchema = z.object({
  board_id: z.string(),
  user_id: z.string(),
  role: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  isVerified: z.boolean(),
  verificationToken: z.string(),
  verificationTokenExpires: z.iso.datetime(),
  generateVerificationToken: z.function(),
});
const BoardMemberReadOutputSchema = z.object({
  _id: z.string(),
  board_id: z.string(),
  user_id: z.object({
    _id: z.string(),
    firstname: z.string(),
    email: z.string(),
  }),
  role: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});
const PopulatedMemberUserIdSchema = z.object({
  _id: z.string(),
  firstname: z.string(),
  email: z.string(),
});
const PopulatedBoardUserIdSchema = z.object({
  _id: z.string(),
  firstname: z.string(),
});
export const UpdateMemberRoleSchema = z.object({
  memberId: z.string(),
  board_id: z.string(),
  role: z.enum(["admin", "member"]),
});
//# sourceMappingURL=member.type.js.map

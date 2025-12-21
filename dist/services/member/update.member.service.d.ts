import { type UpdateMemberRoleType } from "../../types/member.type.js";
declare const UpdateMemberRoleService: (ownerId: string, memberData: UpdateMemberRoleType) => Promise<{
    success: boolean;
    message: string;
    member?: never;
} | {
    success: boolean;
    message: string;
    member: {
        memberId: string;
        boardId: string;
        role: string;
        user: {
            userId: string;
            firstname: string;
            email: string;
        };
        boardOwnerUserId: string;
    };
}>;
export default UpdateMemberRoleService;
//# sourceMappingURL=update.member.service.d.ts.map
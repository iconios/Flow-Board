/*
#Plan: Member Verification
0. Validate input
1. Check if a member exists with the verification token and update the verification fields
2. Check if a member was updated
3. Send a successful board membership acceptance email to the member
4. Notify the caller
*/
import BoardMember from "../../models/boardMember.model.js";
import User from "../../models/user.model.js";
import { sendSuccessMembershipAcceptanceEmail } from "../../utils/emails/success.member.acceptance.email.js";
const VerifyBoardMemberService = async (verificationToken) => {
  // 1. Check if a member exists with the verification token and update the verification fields
  const updatedMember = await BoardMember.findOneAndUpdate(
    {
      verificationToken,
      verificationTokenExpires: { $gt: new Date(Date.now()) },
      isVerified: false,
    },
    {
      isVerified: true,
      verificationToken: "",
      verificationTokenExpires: null,
      updated_at: new Date(),
    },
    {
      new: true,
      projection: { _id: 1, user_id: 1 },
    },
  )
    .lean()
    .exec();
  // 2. Check if a member was updated
  if (!updatedMember) {
    console.log("Member with verification token does not exist");
    return {
      success: false,
      message:
        "The verification link is invalid or member verification already done",
      error: "INVALID OR EXPIRED LINK",
    };
  }
  console.log(
    `Member ${updatedMember._id.toString()} is verified and records updated`,
  );
  // 3. Send a successful board membership acceptance email to the member
  const memberUser = await User.findById(updatedMember.user_id)
    .select("email firstname")
    .lean()
    .exec();
  if (!memberUser) {
    return {
      success: false,
      message: "Member not found",
      error: "MEMBER_NOT_FOUND",
    };
  }
  sendSuccessMembershipAcceptanceEmail(memberUser.email, memberUser.firstname);
  // 4. Notify the caller
  return {
    success: true,
    message: "Thank you, your board membership acceptance has been verified",
  };
};
export default VerifyBoardMemberService;
//# sourceMappingURL=verify.member.service.js.map

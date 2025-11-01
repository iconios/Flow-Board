declare const sendMembershipRemovalEmail: (boardMemberEmail: string, boardOwnerName: string, boardMemberName: string, boardTitle: string) => void;
declare const sendMemberInvite: (email: string, firstname: string, verificationToken: string, boardOwner: string) => void;
declare const sendSuccessMembershipAcceptanceEmail: (email: string, firstname: string) => void;
declare const sendVerificationEmail: (email: string, firstname: string, verificationToken: string) => void;
declare const sendPasswordResetEmail: (email: string, firstname: string, resetPasswordToken: string) => void;
declare const sendSuccessVerificationEmail: (email: string, firstname: string) => void;
declare const sendPasswordUpdateConfirmationEmail: (email: string, firstname: string) => void;
export { sendVerificationEmail, sendPasswordResetEmail, sendSuccessVerificationEmail, sendPasswordUpdateConfirmationEmail, sendMemberInvite, sendSuccessMembershipAcceptanceEmail, sendMembershipRemovalEmail, };
//# sourceMappingURL=mailer.util.d.ts.map
declare const sendVerificationEmail: (
  email: string,
  firstname: string,
  verificationToken: string,
) => void;
declare const sendPasswordResetEmail: (
  email: string,
  firstname: string,
  resetPasswordToken: string,
) => void;
declare const sendSuccessVerificationEmail: (
  email: string,
  firstname: string,
) => void;
export {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendSuccessVerificationEmail,
};
//# sourceMappingURL=mailer.util.d.ts.map

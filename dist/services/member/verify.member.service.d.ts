declare const VerifyBoardMemberService: (verificationToken: string) => Promise<
  | {
      success: boolean;
      message: string;
      error: string;
    }
  | {
      success: boolean;
      message: string;
      error?: never;
    }
>;
export default VerifyBoardMemberService;
//# sourceMappingURL=verify.member.service.d.ts.map

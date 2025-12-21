import { ServerClient } from "postmark";
declare const transporter: ServerClient;
declare const verifyMailer: () => Promise<boolean | undefined>;
export { transporter, verifyMailer };
//# sourceMappingURL=mailer.util.d.ts.map
import nodemailer from "nodemailer";
declare const transporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo, import("nodemailer/lib/smtp-transport/index.js").Options>;
declare const verifyMailer: () => Promise<void>;
export { transporter, verifyMailer };
//# sourceMappingURL=mailer.util.d.ts.map
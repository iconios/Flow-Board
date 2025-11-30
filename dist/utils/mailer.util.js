import nodemailer from "nodemailer";
import { ServerClient } from "postmark";
import * as dotenv from "dotenv";
dotenv.config();
// Create transporter
const transporter = new ServerClient(process.env.POSTMARK_SERVER_TOKEN);
// const transporter = nodemailer.createTransport({
//   host: process.env.MAIL_HOST,
//   port: Number(process.env.MAIL_PORT),
//   secure: false,
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASSWORD,
//   },
//   connectionTimeout: 10000,
//   greetingTimeout: 10000,
//   socketTimeout: 20000,
//   tls: {
//     servername: process.env.MAIL_HOST,
//     minVersion: "TLSv1.2",
//     rejectUnauthorized: environment === "development",
//   },
// });
// Verify transporter
const verifyMailer = async () => {
    if (process.env.NODE_ENV === "test")
        return;
    try {
        const server = await transporter.getServer();
        console.log("Postmark connection verified. Server name:", server.Name);
        return true;
    }
    catch (error) {
        console.log("Postmark not reachable", error.message);
        return false;
    }
};
export { transporter, verifyMailer };
//# sourceMappingURL=mailer.util.js.map
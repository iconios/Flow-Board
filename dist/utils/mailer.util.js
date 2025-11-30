import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();
const environment = process.env.NODE_ENV;
// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
    //   connectionTimeout: 10000,
    //   greetingTimeout: 10000,
    //   socketTimeout: 20000,
    //   tls: {
    //     servername: process.env.MAIL_HOST,
    //     minVersion: "TLSv1.2",
    //     rejectUnauthorized: environment === "development",
    //   },
});
// Verify transporter
const verifyMailer = async () => {
    if (process.env.NODE_ENV === "test")
        return;
    try {
        await transporter.verify();
        console.log("Server is ready to send emails");
        console.log("📧 Configuration:", {
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            user: process.env.MAIL_USER ? "Set" : "Missing",
            fromEmail: process.env.MAIL_FROM || "Not set"
        });
    }
    catch (error) {
        console.log("Error with email configuration", error);
    }
};
export { transporter, verifyMailer };
//# sourceMappingURL=mailer.util.js.map
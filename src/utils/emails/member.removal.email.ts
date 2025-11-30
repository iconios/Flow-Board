import { transporter } from "../mailer.util.js";

// Send Board Membership Removal Email Function
const sendMembershipRemovalEmail = async (
  boardMemberEmail: string,
  boardOwnerName: string,
  boardMemberName: string,
  boardTitle: string,
) => {
  const fromAddress = `"${process.env.APP_NAME}" <${process.env.MAIL_FROM}>`;
  const mailOptions = {
    From: fromAddress,
    To: boardMemberEmail,
    Subject: "Board Membership Update",
    MessageStream: "outbound",
    HtmlBody: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Board Membership Update</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4;">
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <!-- Email Container -->
                            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="background-color: #2c3e50; padding: 30px 20px; text-align: center; color: white; font-size: 24px;">
                                        Board Membership Update
                                    </td>
                                </tr>

                                <!-- Body Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <p>Hello <strong>${boardMemberName}</strong>,</p>

                                        <p>This email is to formally notify you that your membership on the board "<strong>${boardTitle}</strong>" has been revoked by the board owner, <strong>${boardOwnerName}</strong>.</p>

                                        <p>As a result, your access to the board and all its associated content—including lists, tasks, and any other collaborative materials—has been permanently removed, effective immediately.</p>

                                        <p>If you have any questions regarding this decision, please contact the board owner directly.</p>

                                        <p>We thank you for your contributions during your time on the board.</p>

                                        <p>Best regards,<br>
                                        The Team</p>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #ecf0f1; padding: 20px; text-align: center; font-size: 12px; color: #7f8c8d;">
                                        <p>This is an automated notification. Please do not reply to this email.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>`,
  };

  // Send board membership revocation email
  try {
    await transporter.sendEmail(mailOptions);
    console.log("Board membership revocation email sent to", boardMemberEmail);
  } catch (error) {
    console.log("Error sending board membership invitation email", error);
  }
};

export {
    sendMembershipRemovalEmail
}
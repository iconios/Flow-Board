import { transporter } from "../mailer.util.js";
// Send Member Invite Function
const sendMemberInvite = async (email, firstname, verificationToken, boardOwner) => {
    const verificationUrl = `${process.env.BASE_URL}/member/accept-invite-email?t=${verificationToken}`;
    const fromAddress = `"${process.env.APP_NAME}" <${process.env.MAIL_FROM}>`;
    const mailOptions = {
        From: fromAddress,
        To: email,
        Subject: "Board Membership Invitation Email",
        MessageStream: "outbound",
        HtmlBody: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Board Invitation</title>
          <style>
              /* Reset styles for email clients */
              body, table, td, a {
                  -webkit-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
              }
              table, td {
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
              }
              img {
                  -ms-interpolation-mode: bicubic;
                  border: 0;
                  height: auto;
                  line-height: 100%;
                  outline: none;
                  text-decoration: none;
              }
              
              /* Main styles */
              body {
                  font-family: Arial, Helvetica, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f6f9fc;
              }
              .email-container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              }
              .header {
                  background-color: #2c3e50;
                  color: white;
                  padding: 25px 20px;
                  text-align: center;
              }
              .content {
                  padding: 30px;
                  color: #333333;
                  line-height: 1.6;
              }
              .button {
                  display: inline-block;
                  background-color: #3498db;
                  color: white;
                  text-decoration: none;
                  padding: 12px 30px;
                  border-radius: 4px;
                  font-weight: bold;
                  margin: 20px 0;
              }
              .footer {
                  background-color: #f1f5f9;
                  padding: 20px;
                  text-align: center;
                  font-size: 12px;
                  color: #666666;
              }
              .board-info {
                  background-color: #f8f9fa;
                  border-left: 4px solid #3498db;
                  padding: 15px;
                  margin: 20px 0;
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="header">
                  <h1>Board Membership Invitation</h1>
              </div>
              
              <div class="content">
                  <p>Dear ${firstname},</p>
                  
                  <p>You have been invited by <strong>${boardOwner}</strong> to join a board as a member.</p>
                  
                  <div class="board-info">
                      <p><strong>Board Access:</strong> Manage lists and tasks within the board</p>
                      <p><strong>Invited by:</strong> ${boardOwner}</p>
                  </div>
                  
                  <p>As a board member, you'll be able to create, organize, and track tasks and lists to help the team stay productive and organized.</p>
                  
                  <div style="text-align: center;">
                      <a href=${verificationUrl} class="button">Accept Board Invitation</a>
                  </div>
                  
                  <p>Clicking the button will verify your account and grant you access to the board.</p>
                  
                  <p>Best regards,<br>
                  <strong>The Nerdy Flow Board Team</strong></p>
              </div>
              
              <div class="footer">
                  <p>This invitation was sent to ${email}. If you believe you received this in error, please disregard this message.</p>
                  <p>&copy; ${new Date().getFullYear()} Nerdy Flow Board. All rights reserved.</p>
              </div>
          </div>
      </body>
    </html>`,
    };
    // Send board membership invitation email
    try {
        await transporter.sendEmail(mailOptions);
        console.log("Board membership invitation email sent to", email);
    }
    catch (error) {
        console.log("Error sending board membership invitation email", error);
    }
};
export { sendMemberInvite, };
//# sourceMappingURL=member.invite.email.js.map
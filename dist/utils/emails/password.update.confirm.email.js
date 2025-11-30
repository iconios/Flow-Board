import { transporter } from "../mailer.util.js";
// Successful Password Change Confirmation Email Function
const sendPasswordUpdateConfirmationEmail = async (email, firstname) => {
    const fromAddress = `"${process.env.APP_NAME}" <${process.env.MAIL_FROM}>`;
    const mailOptions = {
        from: fromAddress,
        to: email,
        subject: "Successful Password Change Confirmation",
        html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Updated Successfully</title>
          <style>
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              }
              
              body {
                  background-color: #f7f9fc;
                  color: #333;
                  line-height: 1.6;
                  padding: 20px;
              }
              
              .email-container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: #ffffff;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
              }
              
              .header {
                  background: #4f46e5;
                  padding: 25px 30px;
                  text-align: center;
              }
              
              .header h1 {
                  color: white;
                  font-size: 24px;
                  font-weight: 600;
              }
              
              .content {
                  padding: 35px 40px;
              }
            
              .content a {
                  color: white;
              }
              
              .icon-success {
                  text-align: center;
                  margin-bottom: 25px;
              }
              
              .icon-success span {
                  display: inline-block;
                  width: 70px;
                  height: 70px;
                  line-height: 70px;
                  background: #10b981;
                  color: white;
                  border-radius: 50%;
                  font-size: 32px;
                  font-weight: bold;
              }
              
              h2 {
                  color: #1f2937;
                  margin-bottom: 15px;
                  text-align: center;
                  font-weight: 600;
              }
              
              p {
                  color: #4b5563;
                  margin-bottom: 20px;
                  font-size: 16px;
              }
              
              .info-box {
                  background: #f9fafb;
                  border-left: 4px solid #4f46e5;
                  padding: 16px 20px;
                  margin: 25px 0;
                  border-radius: 0 4px 4px 0;
              }
              
              .footer {
                  background: #f3f4f6;
                  padding: 25px 30px;
                  text-align: center;
                  font-size: 14px;
                  color: #6b7280;
              }
              
              .support-link {
                  color: #4f46e5;
                  text-decoration: none;
                  font-weight: 500;
              }
              
              .button {
                  display: block;
                  width: 100%;
                  text-align: center;
                  background: #4f46e5;
                  color: white;
                  text-decoration: none;
                  padding: 14px 0;
                  border-radius: 6px;
                  font-weight: 500;
                  margin: 30px 0 15px;
              }
              
              .button:hover {
                  background: #4338ca;
              }
              
              .security-note {
                  font-size: 14px;
                  color: #6b7280;
                  text-align: center;
                  margin-top: 25px;
                  padding-top: 20px;
                  border-top: 1px solid #e5e7eb;
              }
              
              @media (max-width: 650px) {
                  .content {
                      padding: 25px 20px;
                  }
                  
                  .header, .footer {
                      padding: 20px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="header">
                  <h1>Account Security Notice</h1>
              </div>
              
              <div class="content">
                  <div class="icon-success">
                      <span>✓</span>
                  </div>
                  
                  <h2>Password Updated Successfully</h2>
                  
                  <p>Hello ${firstname},</p>
                  
                  <p>Your password was successfully changed on ${new Date(Date.now())}. If you made this change, no further action is needed.</p>
                  
                  <div class="info-box">
                      <strong>Security Tip:</strong> Use a unique password for each of your important accounts to maximize your security.
                  </div>
                  
                  <p>If you did not make this change, please secure your account immediately by contacting our support team.</p>
                  
                  <a href="#" class="button">Review Account Activity</a>
                  
                  <div class="security-note">
                      For your security, this email was sent to ${email} regarding your account.
                  </div>
              </div>
              
              <div class="footer">
                  <p>Need help? <a href="#" class="support-link">Contact our support team</a></p>
                  <p>© ${new Date().getFullYear()} Nerdy Web Consults. All rights reserved.</p>
                  <p>1234 Business Ave, Suite 567, San Francisco, CA 94107</p>
              </div>
          </div>
      </body>
      </html>`,
    };
    // Send password update confirmation email
    try {
        await transporter.sendMail(mailOptions);
        console.log("Password update confirmation email sent to", email);
    }
    catch (error) {
        console.log("Error sending password update confirmation email", error);
    }
};
export { sendPasswordUpdateConfirmationEmail, };
//# sourceMappingURL=password.update.confirm.email.js.map
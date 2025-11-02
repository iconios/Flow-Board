import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();
const environment = process.env.NODE_ENV;

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: environment === "development",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
  tls: {
    servername: "smtp.mail.yahoo.com",
    minVersion: "TLSv1.2",
    rejectUnauthorized: environment === "development",
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.log("Error with email configuration", error);
  }
  if (success) {
    console.log("Server is ready to send emails");
  }
});

// Send Board Membership Removal Email Function
const sendMembershipRemovalEmail = (
  boardMemberEmail: string,
  boardOwnerName: string,
  boardMemberName: string,
  boardTitle: string,
) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: boardMemberEmail,
    subject: "Board Membership Update",
    html: `<!DOCTYPE html>
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
    transporter.sendMail(mailOptions);
    console.log("Board membership revocation email sent to", boardMemberEmail);
  } catch (error) {
    console.log("Error sending board membership invitation email", error);
  }
};

// Send Member Invite Function
const sendMemberInvite = (
  email: string,
  firstname: string,
  verificationToken: string,
  boardOwner: string,
) => {
  const verificationUrl = `${process.env.BASE_URL}/member/accept-invite-email?t=${verificationToken}`;
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Board Membership Invitation Email",
    html: `<!DOCTYPE html>
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
    transporter.sendMail(mailOptions);
    console.log("Board membership invitation email sent to", email);
  } catch (error) {
    console.log("Error sending board membership invitation email", error);
  }
};

// Send Successful Board Membership Acceptance Email Function
const sendSuccessMembershipAcceptanceEmail = (
  email: string,
  firstname: string,
) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Successful Board Membership Acceptance",
    html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to the Board</title>
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
                    background: linear-gradient(135deg, #27ae60, #2ecc71);
                    color: white;
                    padding: 30px 20px;
                    text-align: center;
                }
                .content {
                    padding: 30px;
                    color: #333333;
                    line-height: 1.6;
                }
                .button {
                    display: inline-block;
                    background-color: #27ae60;
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
                .welcome-box {
                    background-color: #f8fff9;
                    border: 1px solid #27ae60;
                    border-radius: 6px;
                    padding: 20px;
                    margin: 20px 0;
                }
                .next-steps {
                    background-color: #f8f9fa;
                    border-left: 4px solid #3498db;
                    padding: 15px;
                    margin: 25px 0;
                }
                .celebrate {
                    text-align: center;
                    font-size: 48px;
                    margin: 10px 0;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Welcome to the Board!</h1>
                </div>
                
                <div class="content">
                    <div class="celebrate">🎉</div>
                    
                    <p>Dear <strong>${firstname}</strong>,</p>
                    
                    <div class="welcome-box">
                        <p><strong>Congratulations and welcome to the board!</strong></p>
                        <p>We're thrilled to confirm that you are now an official board member with full access to manage lists and tasks.</p>
                    </div>
                    
                    <p>Your membership has been successfully verified, and you now have complete access to collaborate with other board members.</p>
                    
                    <div class="next-steps">
                        <p><strong>Get Started:</strong></p>
                        <ul>
                            <li>Access your board dashboard</li>
                            <li>Explore existing lists and tasks</li>
                            <li>Create new tasks and organize workflows</li>
                            <li>Collaborate with other board members</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="#" class="button">Access Your Board</a>
                    </div>
                    
                    <p>We're excited to have you on board and look forward to seeing the great work we'll accomplish together.</p>
                    
                    <p>Should you have any questions or need assistance getting started, please don't hesitate to reach out.</p>
                    
                    <p>Welcome aboard!<br>
                    <strong>The Board Team</strong></p>
                </div>
                
                <div class="footer">
                    <p>You're receiving this email because you recently accepted board membership.</p>
                    <p>All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>`,
  };

  // Send successful board membership acceptance email
  try {
    transporter.sendMail(mailOptions);
    console.log("Board membership successful acceptance email sent to", email);
  } catch (error) {
    console.log(
      "Error sending board membership successful acceptance email",
      error,
    );
  }
};

// Verification Email Function
const sendVerificationEmail = (
  email: string,
  firstname: string,
  verificationToken: string,
) => {
  const verificationUrl = `${process.env.BASE_URL}/auth/verify-email?token=${verificationToken}`;
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Verify your Email",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Hello ${firstname},</p>
        <p>Thank you for registering! Please click the button below to verify your email address:</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #007bff; 
                  color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Verify Email
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
      </div>`,
  };

  // Send verification email
  try {
    transporter.sendMail(mailOptions);
    console.log("Verification email sent to", email);
  } catch (error) {
    console.log("Error sending verification email", error);
  }
};

// Password reset Email Function
const sendPasswordResetEmail = (
  email: string,
  firstname: string,
  resetPasswordToken: string,
) => {
  const resetPasswordUrl = `${process.env.BASE_URL}/auth/reset-password?token=${resetPasswordToken}`;
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Please Reset your Password",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset</h2>
        <p>Hello ${firstname},</p>
        <p>You requested to reset your password. Click the button below to proceed:</p>
        <a href="${resetPasswordUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #dc3545; 
                  color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Reset Password
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p>${resetPasswordUrl}</p>
        <p>This link will expire in 30 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>`,
  };

  // Send password reset email
  try {
    transporter.sendMail(mailOptions);
    console.log("Password reset email sent to", email);
  } catch (error) {
    console.log("Error sending password reset email", error);
  }
};

// Account successful verification email function
const sendSuccessVerificationEmail = (email: string, firstname: string) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Successful Account Verification",
    html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Verified Successfully</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    margin: 0;
                    padding: 0;
                    background-color: #f7f7f7;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                }
                .email-header {
                    background-color: #2c3e50;
                    padding: 20px;
                    text-align: center;
                }
                .email-body {
                    padding: 30px;
                }
                .email-footer {
                    background-color: #f2f2f2;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #666666;
                }
                h1 {
                    color: #ffffff;
                    margin: 0;
                    font-size: 24px;
                }
                h2 {
                    color: #2c3e50;
                    margin-top: 0;
                }
                .button {
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #3498db;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 4px;
                    margin: 20px 0;
                }
                .divider {
                    border-top: 1px solid #eeeeee;
                    margin: 25px 0;
                }
                .logo {
                    color: #ffffff;
                    font-size: 24px;
                    font-weight: bold;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <a href="#" class="logo">Nerdy Web Consults</a>
                </div>
                
                <div class="email-body">
                    <h2>Your Account Has Been Verified</h2>
                    <p>Hello ${firstname},</p>
                    <p>We're pleased to inform you that your account has been successfully verified. You now have full access to all features and services.</p>
                    
                    <div class="divider"></div>
                    
                    <p><strong>What's next?</strong></p>
                    <ul>
                        <li>Check out our features</li>
                    </ul>
                    
                    <div style="text-align: center;">
                        <a href="#" class="button">Get Started</a>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                    
                    <p>Welcome aboard!<br>Nerdy Web Consults Team</p>
                </div>
                
                <div class="email-footer">
                    <p>© ${new Date().getFullYear()} Nerdy Web Consults. All rights reserved.</p>
                    <p>123 Lagos, Suite 100, Lagos 12345, Nigeria</p>
                    <p>
                        <a href="#">Privacy Policy</a> | 
                        <a href="#">Terms of Service</a>
                    </p>
                    <p>This is an automated message, please do not reply directly to this email.</p>
                </div>
            </div>
        </body>
        </html>`,
  };

  // Send account successful verification email
  try {
    transporter.sendMail(mailOptions);
    console.log("Account successful verification email sent to", email);
  } catch (error) {
    console.log("Error sending account successful verification email", error);
  }
};

// Successful Password Change Confirmation Email Function
const sendPasswordUpdateConfirmationEmail = (
  email: string,
  firstname: string,
) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
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
    transporter.sendMail(mailOptions);
    console.log("Password update confirmation email sent to", email);
  } catch (error) {
    console.log("Error sending password update confirmation email", error);
  }
};

export {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendSuccessVerificationEmail,
  sendPasswordUpdateConfirmationEmail,
  sendMemberInvite,
  sendSuccessMembershipAcceptanceEmail,
  sendMembershipRemovalEmail,
};

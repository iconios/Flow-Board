import { transporter } from "../mailer.util.js";
// Send Successful Board Membership Acceptance Email Function
const sendSuccessMembershipAcceptanceEmail = async (email, firstname) => {
    const fromAddress = `"${process.env.APP_NAME}" <${process.env.MAIL_FROM}>`;
    const mailOptions = {
        from: fromAddress,
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
        await transporter.sendMail(mailOptions);
        console.log("Board membership successful acceptance email sent to", email);
    }
    catch (error) {
        console.log("Error sending board membership successful acceptance email", error);
    }
};
export { sendSuccessMembershipAcceptanceEmail, };
//# sourceMappingURL=success.member.acceptance.email.js.map
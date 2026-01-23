import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

/**
 * options = {
 *  to,
 *  subject,
 *  html,
 *  attachments: []
 * }
 */
export const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"Kashmiri Gifts" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments || [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("❌ Email error:", err);
    throw err;
  }
};

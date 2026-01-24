import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    if (!to || !subject || !html) {
      throw new Error("Missing email fields");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Kashmiri Gifts" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });

    console.log("📧 Email sent to:", to);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
    throw err;
  }
};

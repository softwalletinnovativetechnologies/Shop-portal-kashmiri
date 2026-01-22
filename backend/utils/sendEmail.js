import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  if (!to) {
    throw new Error("Email recipient missing");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.verify(); // 🔥 VERY IMPORTANT

  const info = await transporter.sendMail({
    from: `"Kashmiri Gifts Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("✅ Email sent:", info.messageId);
};

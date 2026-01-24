import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  if (!to) {
    throw new Error("No recipient email provided");
  }
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials missing");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });

  const mailOptions = {
    from: `"Kashmiri Gifts" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments,
  };
  return transporter.sendMail(mailOptions);
};

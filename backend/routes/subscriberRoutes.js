import express from "express";
import Subscriber from "../models/Subscriber.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

/* ===== SUBSCRIBE ===== */
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const existing = await Subscriber.findOne({ email });

    if (existing) {
      return res.json({ message: "Already subscribed" });
    }

    await Subscriber.create({ email });

    // ✅ Confirmation email
    await sendEmail({
      to: email,
      subject: "Subscribed to Kashmiri Gifts 🎉",
      html: `
        <h2>Thank you for subscribing!</h2>
        <p>You will now receive latest offers & updates from Kashmiri Gifts.</p>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err.message);
    res.status(500).json({ message: "Subscription failed" });
  }
});

export default router;

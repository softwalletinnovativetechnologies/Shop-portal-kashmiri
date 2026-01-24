import express from "express";
import Subscriber from "../models/Subscriber.js";
import { sendEmail } from "../utils/sendEmail.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ================= SEND NEWSLETTER TO ALL SUBSCRIBERS ================= */
router.post("/send", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    console.log("🔥 ADMIN NEWSLETTER ROUTE HIT");
    console.log("📩 BODY:", req.body);

    const { subject, content } = req.body;

    if (!subject || !content || !content.trim()) {
      return res.status(400).json({
        message: "Subject and content are required",
      });
    }

    /* 🔎 FETCH ACTIVE SUBSCRIBERS */
    const subscribers = await Subscriber.find({ status: "ACTIVE" });

    if (!subscribers.length) {
      return res.json({
        success: true,
        message: "No active subscribers found",
      });
    }

    /* 📧 SEND EMAIL ONE BY ONE (SAFE) */
    for (const sub of subscribers) {
      await sendEmail({
        to: sub.email,
        subject,
        html: `
          <div style="
            font-family: Arial, sans-serif;
            line-height: 1.6;
            padding: 20px;
            background: #f9f9f9;
          ">
            <div style="
              max-width: 600px;
              margin: auto;
              background: #ffffff;
              padding: 25px;
              border-radius: 8px;
            ">
              <h2 style="color:#1b5e20;">Kashmiri Gifts Newsletter 🌿</h2>
              <hr />
              <div style="margin-top:15px;">
                ${content}
              </div>
              <hr />
              <p style="font-size:13px;color:#555;">
                You are receiving this email because you subscribed on
                <b>Kashmiri Gifts</b>.
              </p>
            </div>
          </div>
        `,
      });

      console.log("📧 Newsletter sent to:", sub.email);
    }

    res.json({
      success: true,
      message: "Newsletter sent to all subscribers",
    });
  } catch (err) {
    console.error("❌ Newsletter send failed:", err);
    res.status(500).json({
      message: "Failed to send newsletter",
    });
  }
});

export default router;

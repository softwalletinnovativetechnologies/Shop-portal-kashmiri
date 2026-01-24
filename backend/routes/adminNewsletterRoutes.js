import express from "express";
import Newsletter from "../models/Newsletter.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { sendEmail } from "../utils/sendEmail.js";
import Subscriber from "../models/Subscriber.js";
const router = express.Router();

/* ================= GET ALL SUBSCRIBERS ================= */
router.get("/", adminMiddleware, async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });

    res.json(subscribers);
  } catch (err) {
    console.error("Fetch subscribers error:", err);
    res.status(500).json({ message: "Failed to fetch subscribers" });
  }
});

/* ================= DELETE / UNSUBSCRIBE ================= */
router.put("/:id/unsubscribe", adminMiddleware, async (req, res) => {
  try {
    const sub = await Newsletter.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Subscriber not found" });

    sub.status = "UNSUBSCRIBED";
    await sub.save();

    res.json(sub);
  } catch {
    res.status(500).json({ message: "Failed to unsubscribe" });
  }
});

/* ================= SEND NEWSLETTER ================= */
router.post("/send", async (req, res) => {
  try {
    const { subject, html } = req.body;

    const subscribers = await Subscriber.find({ status: "ACTIVE" });
    if (subscribers.length === 0) {
      return res.status(400).json({ message: "No subscribers found" });
    }

    for (const sub of subscribers) {
      await sendEmail({
        to: sub.email,
        subject,
        html: `
          <h2>Kashmiri Gifts Newsletter</h2>
          <p>${content}</p>
          <hr />
          <p style="font-size:12px;color:#777">
            You are receiving this email because you subscribed to Kashmiri Gifts.
          </p>
        `,
      });
    }

    res.json({
      message: "Newsletter sent to all subscribers",
    });
  } catch (err) {
    console.error("Newsletter send failed:", err);
    res.status(500).json({ message: "Newsletter send failed" });
  }
});

/* ================= NEWSLETTER ANALYTICS ================= */
router.get("/stats", adminMiddleware, async (req, res) => {
  try {
    const total = await Newsletter.countDocuments();
    const active = await Newsletter.countDocuments({ status: "ACTIVE" });
    const inactive = await Newsletter.countDocuments({
      status: "UNSUBSCRIBED",
    });

    const last7Days = await Newsletter.countDocuments({
      createdAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      total,
      active,
      inactive,
      last7Days,
    });
  } catch {
    res.status(500).json({ message: "Stats failed" });
  }
});

export default router;

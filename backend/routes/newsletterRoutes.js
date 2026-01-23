import express from "express";
import Newsletter from "../models/Newsletter.js";

const router = express.Router();

/* SUBSCRIBE */
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(200).json({ message: "Already subscribed" });
    }

    await Newsletter.create({ email });

    res.json({ success: true });
  } catch (err) {
    console.error("Newsletter error:", err);
    res.status(500).json({ message: "Subscription failed" });
  }
});

export default router;

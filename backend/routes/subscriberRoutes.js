import express from "express";
import Subscriber from "../models/Subscriber.js";

const router = express.Router();

/* ===== SUBSCRIBE ===== */
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return res.status(200).json({ message: "Already subscribed" });
    }

    await Subscriber.create({ email });
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Subscription failed" });
  }
});

export default router;

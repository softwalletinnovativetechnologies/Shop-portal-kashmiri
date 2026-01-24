import express from "express";
import Coupon from "../models/Coupon.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ===== GET ALL COUPONS ===== */
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch coupons" });
  }
});

/* ===== CREATE COUPON ===== */
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { code, type, value, minOrderAmount, category, expiry } = req.body;

    if (!code || !type || !value || !expiry) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await Coupon.findOne({ code });
    if (exists) {
      return res.status(400).json({ message: "Coupon already exists" });
    }

    const coupon = await Coupon.create({
      code,
      type,
      value,
      minOrderAmount,
      category,
      expiry,
    });

    res.status(201).json(coupon);
  } catch (err) {
    console.error("Coupon create error:", err);
    res.status(500).json({ message: "Coupon creation failed" });
  }
});

/* ===== TOGGLE ACTIVE ===== */
router.put("/:id/toggle", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    coupon.active = !coupon.active;
    await coupon.save();

    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: "Toggle failed" });
  }
});

export default router;

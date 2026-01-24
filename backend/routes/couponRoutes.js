import express from "express";
import Coupon from "../models/Coupon.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= AVAILABLE COUPONS ================= */
router.get("/available", async (req, res) => {
  try {
    const now = new Date();

    const coupons = await Coupon.find({
      active: true,
      expiry: { $gte: now },
    }).select("-__v");

    res.json(coupons);
  } catch (err) {
    console.error("Available coupons error:", err);
    res.status(500).json({ message: "Failed to load coupons" });
  }
});
/* ===== APPLY COUPON ===== */
router.post("/apply", authMiddleware, async (req, res) => {
  try {
    const { code, cartTotal, categories } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      active: true,
      expiry: { $gte: new Date() },
    });

    if (!coupon) {
      return res.status(400).json({ message: "Invalid or expired coupon" });
    }

    if (cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({
        message: `Minimum order ₹${coupon.minOrderAmount} required`,
      });
    }

    if (coupon.category !== "ALL" && !categories.includes(coupon.category)) {
      return res.status(400).json({
        message: "Coupon not applicable for selected products",
      });
    }

    let discount = 0;

    if (coupon.type === "PERCENT") {
      discount = Math.floor((cartTotal * coupon.value) / 100);
    } else {
      discount = coupon.value;
    }

    // ❗ SAFETY
    discount = Math.min(discount, cartTotal);

    res.json({
      discount,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
      },
    });
  } catch (err) {
    console.error("Apply coupon error:", err);
    res.status(500).json({ message: "Coupon apply failed" });
  }
});

/* ===== AUTO BEST COUPON ===== */
router.post("/best", authMiddleware, async (req, res) => {
  try {
    const { cartTotal, categories } = req.body;

    const coupons = await Coupon.find({
      active: true,
      expiry: { $gte: new Date() },
    });

    let best = { discount: 0, coupon: null };

    for (const c of coupons) {
      if (cartTotal < c.minOrderAmount) continue;
      if (c.category !== "ALL" && !categories.includes(c.category)) continue;

      let d =
        c.type === "PERCENT"
          ? Math.floor((cartTotal * c.value) / 100)
          : c.value;

      d = Math.min(d, cartTotal);

      if (d > best.discount) {
        best = { discount: d, coupon: c };
      }
    }

    res.json(best);
  } catch {
    res.status(500).json({ message: "Best coupon failed" });
  }
});

export default router;

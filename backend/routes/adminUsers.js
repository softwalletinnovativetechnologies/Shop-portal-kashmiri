import express from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ================= GET USER BY ID ================= */
router.get(
  "/:id",
  authMiddleware, // 🔑 FIRST
  adminMiddleware, // 👑 SECOND
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  },
);

/* ================= GET USER ORDERS ================= */
router.get(
  "/:id/orders",
  authMiddleware, // 🔑 FIRST
  adminMiddleware, // 👑 SECOND
  async (req, res) => {
    try {
      const orders = await Order.find({ user: req.params.id }).sort({
        createdAt: -1,
      });
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  },
);

export default router;

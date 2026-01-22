import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { logAdminAction } from "../utils/logAdminAction.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

/* ===== GET ALL ORDERS (ADMIN) ===== */
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/* ===== UPDATE ORDER STATUS (ADMIN) ===== */
router.put("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    /* 🔐 VALID STATUS CHECK */
    const allowedStatus = [
      "PLACED",
      "PROCESSING",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id).populate(
      "user",
      "email name",
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    /* 🛑 PREVENT DUPLICATE STATUS */
    if (order.orderStatus === status) {
      return res.json(order);
    }

    /* ✅ UPDATE ORDER */
    order.orderStatus = status;
    order.statusHistory.push({ status, time: new Date() });
    await order.save();

    /* 📝 AUDIT LOG (NON-BLOCKING) */
    logAdminAction({
      adminId: req.user._id,
      action: `Order status changed to ${status}`,
      target: order._id,
      ip: req.ip,
    }).catch((err) => console.error("Audit log failed:", err.message));

    /* 📧 EMAIL USER (NON-BLOCKING) */
    sendEmail(
      order.user.email,
      `Order Update: ${status}`,
      `
        <h2>Order Status Updated</h2>
        <p><b>Order ID:</b> ${order._id}</p>
        <p>Your order is now <b>${status}</b></p>
      `,
    ).catch((err) => console.error("Order email failed:", err.message));

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

export default router;

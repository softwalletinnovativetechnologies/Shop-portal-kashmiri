import express from "express";
import Order from "../models/Order.js";
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
    console.error("Fetch orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/* ===== UPDATE ORDER STATUS (ADMIN) ===== */
router.put("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    console.log("ADMIN STATUS UPDATE:", req.params.id, status);

    const allowedStatus = [
      "PLACED",
      "CONFIRMED",
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

    /* ✅ UPDATE ORDER */
    order.orderStatus = status;
    order.statusHistory.push({
      status,
      time: new Date(),
    });

    await order.save();

    /* 📝 AUDIT LOG (NON-BLOCKING) */
    logAdminAction({
      adminId: req.user._id,
      action: `Order status changed to ${status}`,
      target: order._id,
      ip: req.ip,
    }).catch((err) => console.error("Audit log failed:", err.message));

    /* 📧 EMAIL USER (NON-BLOCKING) */
    await sendEmail({
      to: order.user.email,
      subject: `Order Update: ${status}`,
      html: `
        <h2>Order Status Updated 🚚</h2>
        <p><b>Order ID:</b> ${order._id}</p>
        <p>Your order status is now:</p>
        <h3>${status.replaceAll("_", " ")}</h3>
      `,
    }).catch((err) => console.error("Order email failed:", err.message));

    /* ✅ SEND UPDATED ORDER BACK */
    res.json(order);
  } catch (err) {
    console.error("Order status update error:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

export default router;

import express from "express";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import { generateInvoice } from "../utils/generateInvoice.js";
import { sendWhatsApp } from "../utils/sendWhatsApp.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

/* ================= CREATE ORDER ================= */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, address, paymentMethod, paymentStatus } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // 🔒 SERVER SIDE TOTAL
    const totalAmount = items.reduce((sum, item) => {
      const price = Number(item.price) || Number(item.product?.price) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + price * qty;
    }, 0);

    if (totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid order amount" });
    }

    // 🚚 Delivery ETA
    const eta = new Date();
    eta.setDate(eta.getDate() + 5);

    const order = await Order.create({
      user: req.user._id,
      items: items.map((item) => ({
        name: item.name || item.product?.name,
        image: item.image || item.product?.image,
        price: Number(item.price) || Number(item.product?.price),
        quantity: item.quantity || 1,
      })),
      address,
      totalAmount,
      paymentMethod,
      paymentStatus,
      orderStatus: "PLACED",
      deliveryETA: eta,
      statusHistory: [{ status: "PLACED", time: new Date() }],
    });

    // 📄 Generate Invoice
    const invoicePath = generateInvoice(order);

    // 📧 Email (non-blocking)
    sendEmail(
      req.user.email,
      "Order Placed Successfully ✅",
      `
        <h2>Your order is confirmed 🎉</h2>
        <p><b>Order ID:</b> ${order._id}</p>
        <p><b>Total:</b> ₹${order.totalAmount}</p>
        <p><b>Estimated Delivery:</b> ${eta.toDateString()}</p>
      `,
      invoicePath,
    ).catch((err) => console.error("Email failed:", err.message));

    // 📲 WhatsApp (non-blocking)
    sendWhatsApp(
      order.address.phone,
      `✅ Order Placed!
Order ID: ${order._id}
ETA: ${eta.toDateString()}`,
    ).catch((err) => console.error("WhatsApp failed:", err.message));

    // ✅ 🔥 THIS WAS MISSING (MOST IMPORTANT)
    return res.status(201).json(order);
  } catch (err) {
    console.error("Order create error:", err);
    return res.status(500).json({ message: "Order creation failed" });
  }
});

/* ================= GET LOGGED-IN USER ORDERS ================= */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/* ================= RAZORPAY ================= */
router.post("/razorpay", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: "Razorpay keys missing" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Number(amount),
      currency: "INR",
      receipt: "order_" + Date.now(),
    });

    res.json(razorpayOrder);
  } catch (err) {
    console.error("Razorpay error:", err);
    res.status(500).json({ message: "Razorpay order failed" });
  }
});

export default router;

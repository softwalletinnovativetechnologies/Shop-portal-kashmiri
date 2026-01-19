import express from "express";
import Razorpay from "razorpay";
import Order from "../models/Order.js";

const router = express.Router();

/* ================= CREATE ORDER (COD + ONLINE) ================= */
router.post("/", async (req, res) => {
  try {
    const order = new Order({
      user: req.body.user, // ObjectId
      items: req.body.items,
      address: req.body.address,
      totalAmount: req.body.totalAmount,
      paymentMethod: req.body.paymentMethod,
      paymentStatus: req.body.paymentStatus,
      razorpay: req.body.razorpay || {}, // optional
    });

    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error("Order save error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ================= RAZORPAY ORDER CREATE ================= */
router.post("/razorpay", async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: "Razorpay keys missing in .env" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: req.body.amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json(order);
  } catch (err) {
    console.error("Razorpay error:", err);
    res.status(500).json({ message: "Razorpay order failed" });
  }
});

/* ================= GET USER ORDERS ================= */
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.params.userId, // MUST match schema field
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/:id/cancel", async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.orderStatus === "DELIVERED")
    return res.status(400).json({ message: "Cannot cancel delivered order" });

  order.orderStatus = "CANCELLED";
  await order.save();

  res.json({ success: true });
});

router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true },
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;

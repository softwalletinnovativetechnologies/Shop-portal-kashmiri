import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

/* ===== GET ALL ORDERS ===== */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/* ===== UPDATE ORDER STATUS ===== */
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true },
    );

    res.json(order);
  } catch {
    res.status(500).json({ message: "Status update failed" });
  }
});

export default router;

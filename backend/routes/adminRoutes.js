import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";

const router = express.Router();

/* ===== ADMIN DASHBOARD STATS ===== */
router.get("/stats", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const totalSalesAgg = await Order.aggregate([
      { $match: { paymentStatus: "PAID" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const totalSales = totalSalesAgg[0]?.total || 0;

    const pendingOrders = await Order.countDocuments({
      paymentStatus: "PENDING",
    });

    res.json({
      totalOrders,
      totalUsers,
      totalSales,
      pendingOrders,
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard data error" });
  }
});

export default router;

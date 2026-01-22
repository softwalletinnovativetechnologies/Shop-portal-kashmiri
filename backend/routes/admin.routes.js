import express from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Query from "../models/Query.js";

const router = express.Router();

/* ================= ADMIN DASHBOARD STATS ================= */
router.get("/stats", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const salesAgg = await Order.aggregate([
      { $match: { paymentStatus: "PAID" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      totalOrders,
      totalUsers,
      totalSales: salesAgg[0]?.total || 0,
      pendingOrders: await Order.countDocuments({
        paymentStatus: "PENDING",
      }),
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard error" });
  }
});

/* ================= GET ALL USERS ================= */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/* ================= GET SINGLE USER ================= */
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch {
    res.status(500).json({ message: "User fetch error" });
  }
});

/* ================= USER ORDERS ================= */
router.get("/users/:id/orders", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id });
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Orders fetch error" });
  }
});

/* ================= USER QUERIES ================= */
router.get("/users/:id/queries", async (req, res) => {
  try {
    const queries = await Query.find({ user: req.params.id });
    res.json(queries);
  } catch {
    res.status(500).json({ message: "Queries fetch error" });
  }
});

/* ================= ADMIN REPLY TO QUERY ================= */
router.put("/queries/:id/reply", async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) return res.status(404).json({ message: "Query not found" });

    query.reply = req.body.reply;
    query.repliedAt = new Date();
    await query.save();

    res.json(query);
  } catch {
    res.status(500).json({ message: "Reply failed" });
  }
});

export default router;

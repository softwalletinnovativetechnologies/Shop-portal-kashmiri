import express from "express";
import Query from "../models/Query.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= CREATE QUERY (USER) ================= */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, email, query } = req.body;

    if (!query?.trim()) {
      return res.status(400).json({ message: "Query is required" });
    }

    const newQuery = await Query.create({
      user: req.user._id,
      name,
      email: emailAddress,
      query,
    });

    res.status(201).json(newQuery);
  } catch (err) {
    console.error("Query create error:", err);
    res.status(500).json({ message: "Failed to send query" });
  }
});

export default router;

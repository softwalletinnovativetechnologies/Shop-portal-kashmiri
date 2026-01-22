import express from "express";
import ContactQuery from "../models/ContactQuery.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

import jwt from "jsonwebtoken";

const router = express.Router();

/* ================= SEND QUERY (PUBLIC + AUTH) ================= */
router.post("/", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("AUTH:", req.headers.authorization);
    console.log("JWT:", process.env.JWT_SECRET);

    const { name, emailAddress, query } = req.body;

    if (!query || query.trim().length < 5) {
      return res.status(400).json({ message: "Query too short" });
    }

    let userId = null;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (e) {
        console.log("JWT ERROR:", e.message);
      }
    }

    await ContactQuery.create({
      user: userId,
      name,
      email: emailAddress,
      query,
      status: "OPEN",
    });

    res.status(201).json({ success: true });
  } catch (err) {
    console.error("CONTACT ROUTE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
/* USER GET OWN QUERIES */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const queries = await ContactQuery.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(queries);
  } catch {
    res.status(500).json({ message: "Failed to fetch queries" });
  }
});

export default router;

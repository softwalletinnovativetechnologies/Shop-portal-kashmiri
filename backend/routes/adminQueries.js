import express from "express";
import Query from "../models/Query.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ADMIN – GET QUERIES OF A USER */
router.get("/user/:userId", adminMiddleware, async (req, res) => {
  try {
    const queries = await ContactQuery.find({
      user: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(queries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch queries" });
  }
});

router.put("/:id/reply", adminMiddleware, async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply) return res.status(400).json({ message: "Reply required" });

    const query = await ContactQuery.findById(req.params.id);
    if (!query) return res.status(404).json({ message: "Query not found" });

    query.reply = reply;
    query.status = "RESOLVED";
    await query.save();

    res.json(query);
  } catch {
    res.status(500).json({ message: "Reply failed" });
  }
});

export default router;

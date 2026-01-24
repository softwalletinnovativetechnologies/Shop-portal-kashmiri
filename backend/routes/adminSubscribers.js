import express from "express";
import Subscriber from "../models/Subscriber.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===== GET ALL SUBSCRIBERS ===== */
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  const subs = await Subscriber.find({ status: "ACTIVE" }).sort({
    createdAt: -1,
  });
  res.json(subs);
});

export default router;

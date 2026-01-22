import express from "express";
import AuditLog from "../models/AuditLog.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  const logs = await AuditLog.find()
    .populate("admin", "name email")
    .sort({ createdAt: -1 })
    .limit(200);

  res.json(logs);
});

export default router;

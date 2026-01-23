import express from "express";
import Subscriber from "../models/Subscriber.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", adminMiddleware, async (req, res) => {
  const list = await Subscriber.find().sort({ createdAt: -1 });
  res.json(list);
});

export default router;

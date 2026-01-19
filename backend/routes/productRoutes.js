import express from "express";
import Product from "../models/Product.js";
import mongoose from "mongoose";

const router = express.Router();

/* ================= GET ALL PRODUCTS ================= */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET PRODUCT BY ID ================= */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Mongo ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.json(product);
    }

    // Numeric ID (fallback)
    const product = await Product.findOne({ id: Number(id) });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

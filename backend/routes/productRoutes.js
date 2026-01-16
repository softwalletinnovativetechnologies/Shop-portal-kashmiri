import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// TEST ROUTE
router.get("/", async (req, res) => {
  res.json({
    success: true,
    message: "Products API working ✅",
  });
});

export default router;

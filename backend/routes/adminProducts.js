import express from "express";
import Product from "../models/Product.js";
import multer from "multer";
import path from "path";

const router = express.Router();

/* ===== IMAGE STORAGE ===== */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ===== GET PRODUCTS ===== */
router.get("/", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

/* ===== CREATE PRODUCT ===== */
router.post("/", upload.single("image"), async (req, res) => {
  const product = new Product({
    ...req.body,
    image: `/uploads/${req.file.filename}`,
  });

  await product.save();
  res.json(product);
});

/* ===== UPDATE PRODUCT ===== */
router.put("/:id", upload.single("image"), async (req, res) => {
  const data = req.file
    ? { ...req.body, image: `/uploads/${req.file.filename}` }
    : req.body;

  const product = await Product.findByIdAndUpdate(req.params.id, data, {
    new: true,
  });

  res.json(product);
});

/* ===== DELETE PRODUCT ===== */
router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;

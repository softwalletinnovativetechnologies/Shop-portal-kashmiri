import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const imagesDir = path.join(process.cwd(), "../frontend/public/images");

    const files = fs
      .readdirSync(imagesDir)
      .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file));

    res.json(files);
  } catch (err) {
    console.error("Image fetch error:", err);
    res.status(500).json({ message: "Failed to load images" });
  }
});

export default router;

import express from "express";
import Settings from "../models/Settings.js";

const router = express.Router();

/* GET SETTINGS */
router.get("/", async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        storeName: "Kashmiri Gifts",
        storeEmail: "support@kashmirigifts.com",
      });
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* UPDATE SETTINGS */
router.put("/", async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

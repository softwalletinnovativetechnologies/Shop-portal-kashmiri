import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= GET LOGGED IN USER ================= */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= UPDATE PROFILE (LOGGED IN USER) ================= */
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, addresses } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    if (Array.isArray(addresses)) {
      const hasDefault = addresses.some((a) => a.isDefault);
      if (!hasDefault && addresses.length > 0) {
        addresses[0].isDefault = true;
      }
      user.addresses = addresses;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

/* ================= CHANGE PASSWORD (LOGGED IN USER) ================= */
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Password update failed" });
  }
});

/* ================= ADMIN / INTERNAL (OPTIONAL) ================= */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
  } catch {
    res.status(400).json({ message: "Invalid user id" });
  }
});

export default router;

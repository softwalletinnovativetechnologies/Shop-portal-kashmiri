import express from "express";
import ContactQuery from "../models/ContactQuery.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

/* ================= GET QUERIES OF USER ================= */
router.get("/user/:userId", adminMiddleware, async (req, res) => {
  try {
    const queries = await ContactQuery.find({
      user: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(queries);
  } catch (err) {
    console.error("Fetch user queries error:", err);
    res.status(500).json({ message: "Failed to fetch queries" });
  }
});

/* ================= ADMIN REPLY ================= */
router.put("/:id/reply", adminMiddleware, async (req, res) => {
  try {
    const { reply } = req.body;

    // 🔒 VALIDATION
    if (!reply || reply.trim().length < 2) {
      return res.status(400).json({ message: "Reply cannot be empty" });
    }

    const query = await ContactQuery.findById(req.params.id).populate(
      "user",
      "email name",
    );

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    // ✅ SAVE REPLY FIRST (SOURCE OF TRUTH)
    query.reply = reply.trim();
    query.status = "RESOLVED";
    await query.save();

    // 📧 SEND EMAIL (NON-BLOCKING, SAFE)
    try {
      await sendEmail(
        query.user.email,
        "Reply to your query – Kashmiri Gifts",
        `
          <p>Hi ${query.user.name},</p>

          <p><b>Your query:</b></p>
          <p>${query.query}</p>

          <hr />

          <p><b>Our reply:</b></p>
          <p>${query.reply}</p>

          <br />
          <p style="font-size:13px;color:#555">
            You can also view this reply by logging into your
            Kashmiri Gifts account.
          </p>

          <p>
            Regards,<br/>
            <b>Kashmiri Gifts Support Team</b>
          </p>
        `,
      );
    } catch (emailErr) {
      // ❗ EMAIL FAIL SHOULD NEVER BREAK API
      console.error("Email sending failed:", emailErr.message);
    }

    res.json({
      success: true,
      message: "Reply saved successfully",
      query,
    });
  } catch (err) {
    console.error("Reply failed:", err);
    res.status(500).json({ message: "Reply failed" });
  }
});

export default router;

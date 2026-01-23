import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

/* ================= CORE MIDDLEWARE ================= */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

/* 🔐 BODY PARSERS (IMPORTANT FIX) */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true })); // ✅ REQUIRED

/* ================= ROUTES ================= */

/* AUDIT LOGS */
import adminAuditRoutes from "./routes/adminAuditLogs.js";

/* USER */
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import adminSubscribers from "./routes/adminSubscribers.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
/* ADMIN */
import adminRoutes from "./routes/admin.routes.js";
import adminOrders from "./routes/adminOrders.js";
import adminProducts from "./routes/adminProducts.js";
import adminUserRoutes from "./routes/adminUsers.js";
import adminQueryRoutes from "./routes/adminQueryRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import adminNewsletterRoutes from "./routes/adminNewsletterRoutes.js";
/* ================= PUBLIC ROUTES ================= */
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/admin/subscribers", adminSubscribers);
app.use("/api/newsletter", newsletterRoutes);

/* ================= ADMIN ROUTES ================= */
app.use("/api/admin/audit-logs", adminAuditRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/orders", adminOrders);
app.use("/api/admin/products", adminProducts);
app.use("/api/admin/settings", settingsRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/queries", adminQueryRoutes);
app.use("/api/admin/newsletter", adminNewsletterRoutes);
app.use("/api/images", imageRoutes);

/* ================= STATIC ================= */
app.use("/uploads", express.static("uploads"));

/* ================= DB CONNECT ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });

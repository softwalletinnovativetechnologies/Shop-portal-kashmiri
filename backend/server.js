import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// 🔎 ENV VERIFY (TEMPORARY)

// ROUTES
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminOrders from "./routes/adminOrders.js";
import adminProducts from "./routes/adminProducts.js";
import adminUsers from "./routes/adminUsers.js";
import settingsRoutes from "./routes/settingsRoutes.js";

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/orders", adminOrders);
app.use("/uploads", express.static("uploads"));
app.use("/api/admin/products", adminProducts);
app.use("/api/admin/users", adminUsers);
app.use("/api/admin/settings", settingsRoutes);

// DB CONNECT
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT, () =>
      console.log(`✅ Server running on ${process.env.PORT}`),
    );
  })
  .catch((err) => console.error(err));

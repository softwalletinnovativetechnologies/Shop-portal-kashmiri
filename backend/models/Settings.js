import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    storeName: String,
    storeEmail: String,
    storePhone: String,
    storeAddress: String,

    payment: {
      cod: { type: Boolean, default: true },
      razorpay: { type: Boolean, default: true },
    },

    order: {
      defaultStatus: { type: String, default: "PLACED" },
      allowCancel: { type: Boolean, default: true },
      cancelTime: { type: Number, default: 24 },
    },

    delivery: {
      freeAbove: Number,
      charge: Number,
      minDays: Number,
      maxDays: Number,
    },

    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);

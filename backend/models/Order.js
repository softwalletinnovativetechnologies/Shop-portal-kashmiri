import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: Array,
    address: Object,
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["COD", "ONLINE"], required: true },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    orderStatus: {
      type: String,
      default: "PLACED",
      enum: [
        "PLACED",
        "CONFIRMED",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PLACED",
    },
    statusHistory: [
      {
        status: String,
        time: { type: Date, default: Date.now },
      },
    ],
    deliveryETA: {
  type: Date,
},
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);

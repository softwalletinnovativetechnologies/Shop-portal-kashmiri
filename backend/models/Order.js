import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: Array,
    address: Object,
    totalAmount: Number,
    paymentMethod: String,
    paymentStatus: String,

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
    },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);

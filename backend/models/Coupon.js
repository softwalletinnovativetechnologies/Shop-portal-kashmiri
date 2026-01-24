import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["PERCENT", "FLAT"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      default: "ALL",
    },
    expiry: {
      type: Date,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Coupon", couponSchema);

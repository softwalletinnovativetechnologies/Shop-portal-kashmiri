import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "UNSUBSCRIBED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Newsletter", newsletterSchema);

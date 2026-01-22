import mongoose from "mongoose";

const querySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    email: String,
    query: {
      type: String,
      required: true,
    },
    reply: String,
    status: {
      type: String,
      enum: ["OPEN", "RESOLVED"],
      default: "OPEN",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Query", querySchema);

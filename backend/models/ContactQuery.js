import mongoose from "mongoose";

const contactQuerySchema = new mongoose.Schema(
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

/*
🔥 VERY IMPORTANT
Force mongoose to use EXISTING "queries" collection
*/
export default mongoose.model("ContactQuery", contactQuerySchema, "queries");

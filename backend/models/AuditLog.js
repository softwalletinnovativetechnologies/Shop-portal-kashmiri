import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    target: {
      type: String, // Order ID / User ID / Product ID
    },
    ipAddress: String,
  },
  { timestamps: true },
);

export default mongoose.model("AuditLog", auditLogSchema);

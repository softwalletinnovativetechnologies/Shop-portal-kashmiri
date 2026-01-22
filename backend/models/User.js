import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  address: String,
  city: String,
  state: String,
  pincode: String,
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phone: String,

    // ✅ AMAZON STYLE MULTIPLE ADDRESSES
    addresses: [addressSchema],

    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);

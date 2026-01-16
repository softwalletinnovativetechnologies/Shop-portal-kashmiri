import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: String,
    description: String,
    category: String,
    stock: { type: Number, default: 10 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;

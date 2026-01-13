import { useParams } from "react-router-dom";
import products from "../data/products";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  if (!product) return <h2>Product not found</h2>;

  return (
    <div className="product-details">
      <div className="product-box">
        <img src={product.image} alt={product.name} />

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="price">₹{product.price}</p>
          <p className="desc">{product.description}</p>

          <button className="btn-primary">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

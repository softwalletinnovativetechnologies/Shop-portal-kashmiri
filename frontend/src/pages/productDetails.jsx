import { useParams, useNavigate } from "react-router-dom";
import products from "../data/products";
import { addToCart } from "../utils/cart";
import { toggleWishlist, isInWishlist } from "../utils/wishlist";
import { useState } from "react";
import "./productDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === Number(id));

  const [wish, setWish] = useState(product ? isInWishlist(product.id) : false);

  if (!product) {
    return (
      <div className="not-found">
        <h2>Product not found 😢</h2>
        <button onClick={() => navigate("/shop")}>Back to Shop</button>
      </div>
    );
  }

  // ✅ BUY NOW FIX (IMPORTANT)
  const handleBuyNow = () => {
    const buyNowItem = [
      {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        quantity: 1,
      },
    ];

    localStorage.setItem("cart", JSON.stringify(buyNowItem));
    navigate("/checkout");
  };

  return (
    <div className="product-page">
      <div className="product-container">
        {/* IMAGE */}
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>

        {/* INFO */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="price">₹{product.price}</p>
          <p className="desc">{product.description}</p>

          <div className="actions">
            {/* ✅ FIXED BUY NOW */}
            <button className="btn-primary" onClick={handleBuyNow}>
              Buy Now
            </button>

            {/* ADD TO CART */}
            <button className="btn-primary" onClick={() => addToCart(product)}>
              Add to Cart
            </button>

            {/* WISHLIST */}
            <button
              className="btn-outline"
              onClick={() => {
                toggleWishlist(product);
                setWish(!wish);
              }}
            >
              {wish ? "❤️ Wishlisted" : "🤍 Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

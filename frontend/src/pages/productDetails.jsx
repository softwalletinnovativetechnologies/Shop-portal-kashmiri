import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import products from "../data/products";
import { toggleWishlist, isInWishlist } from "../utils/wishlist";
import { addToCart } from "../utils/cart";
import "./productDetails.css";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => String(p.id) === id);

  const [wishlisted, setWishlisted] = useState(false);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    if (product) {
      setWishlisted(isInWishlist(product.id));
    }
  }, [product]);

  if (!product) {
    return <h2 className="not-found">Product not found</h2>;
  }

  const handleWishlist = () => {
    toggleWishlist(product);
    setWishlisted(isInWishlist(product.id));
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-card">
        {/* IMAGE */}
        <div className="product-image" onClick={() => setShowImage(true)}>
          <img src={product.image} alt={product.name} />
          <span className="zoom-text">Click to zoom</span>
        </div>

        {/* INFO */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="price">₹{product.price}</p>

          <p className="description">{product.description}</p>

          <div className="actions">
            <button className="btn-primary" onClick={() => addToCart(product)}>
              Add to Cart
            </button>

            <button
              className={`btn-wishlist ${wishlisted ? "active" : ""}`}
              onClick={handleWishlist}
            >
              {wishlisted ? "💖 Wishlisted" : "♡ Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* IMAGE MODAL */}
      {showImage && (
        <div className="image-modal" onClick={() => setShowImage(false)}>
          <img src={product.image} alt={product.name} />
        </div>
      )}
    </div>
  );
}

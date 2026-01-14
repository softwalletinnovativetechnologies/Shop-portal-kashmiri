import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../utils/wishlist";
import { addToCart } from "../utils/cart";
import "./Wishlist.css";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

  const handleRemove = (id) => {
    removeFromWishlist(id);
    setWishlist(getWishlist());
  };

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    setWishlist(getWishlist());
  };

  if (wishlist.length === 0) {
    return (
      <div className="empty-wishlist">
        <img src="/images/empty-wishlist.png" alt="Empty Wishlist" />
        <p>Your wishlist is empty 💔</p>
        <Link to="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1 className="wishlist-title">Your Wishlist</h1>

      <div className="wishlist-grid">
        {wishlist.map((item) => (
          <div className="wishlist-card" key={item.id}>
            <div className="wishlist-img">
              <img src={item.image} alt={item.name} />
            </div>

            <div className="wishlist-info">
              <h3>{item.name}</h3>
              <p className="price">₹{item.price}</p>
              <p className="desc">{item.description}</p>

              <div className="wishlist-actions">
                <button
                  className="btn-primary"
                  onClick={() => handleMoveToCart(item)}
                >
                  Move to Cart
                </button>

                <button
                  className="btn-outline"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

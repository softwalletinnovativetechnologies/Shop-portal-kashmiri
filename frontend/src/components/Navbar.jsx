import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getWishlistCount } from "../utils/wishlist";
import { getCartCount } from "../utils/cart";
import "./Navbar.css";

export default function Navbar() {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      setWishlistCount(getWishlistCount());
      setCartCount(getCartCount());
    };

    updateCounts();

    window.addEventListener("wishlistUpdated", updateCounts);
    window.addEventListener("cartUpdated", updateCounts);

    return () => {
      window.removeEventListener("wishlistUpdated", updateCounts);
      window.removeEventListener("cartUpdated", updateCounts);
    };
  }, []);

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="nav-left">
        <NavLink to="/" className="logo">
          Kashmiri Gifts
        </NavLink>
      </div>

      {/* CENTER */}
      <div className="nav-center">
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>
        <NavLink to="/shop" className="nav-link">
          Shop
        </NavLink>
        <NavLink to="/about" className="nav-link">
          About
        </NavLink>
        <NavLink to="/contact" className="nav-link">
          Contact
        </NavLink>
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        <NavLink to="/wishlist" className="nav-icon">
          <i className="fa-regular fa-heart"></i>
          {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
        </NavLink>

        <NavLink to="/cart" className="nav-icon">
          <i className="fa-solid fa-cart-shopping"></i>
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </NavLink>

        <NavLink to="/login" className="login-btn">
          Login
        </NavLink>
      </div>
    </nav>
  );
}

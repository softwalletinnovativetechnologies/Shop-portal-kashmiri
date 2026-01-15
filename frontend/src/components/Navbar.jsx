import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { getWishlistCount } from "../utils/wishlist";
import { getCartCount } from "../utils/cart";
import "./Navbar.css";

function Navbar() {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateCounts = () => {
      setWishlistCount(getWishlistCount());
      setCartCount(getCartCount());
    };

    updateCounts();

    window.addEventListener("wishlistUpdated", updateCounts);
    window.addEventListener("cartUpdated", updateCounts);

    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("wishlistUpdated", updateCounts);
      window.removeEventListener("cartUpdated", updateCounts);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleContactClick = () => {
    if (location.pathname !== "/") {
      navigate("/#contact");
    } else {
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
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
        <span className="nav-link" onClick={handleContactClick}>
          Contact
        </span>
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        <NavLink to="/wishlist" className="nav-icon">
          <i className="fa-regular fa-heart"></i>
          {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
        </NavLink>

        <NavLink to="/cart" className="nav-icon">
          <i className="fa-solid fa-bag-shopping"></i>
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </NavLink>

        <NavLink to="/login" className="login-btn">
          Login
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;

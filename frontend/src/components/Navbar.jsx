import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCartCount } from "../utils/cart";
import { getWishlistCount } from "../utils/wishlist";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const navigate = useNavigate();

  /* ===== SCROLL EFFECT ===== */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ===== CART + WISHLIST COUNT (🔥 MAIN FIX) ===== */
  useEffect(() => {
    const updateCounts = () => {
      setCartCount(getCartCount());
      setWishlistCount(getWishlistCount());
    };

    updateCounts(); // initial load

    window.addEventListener("cartUpdated", updateCounts);
    window.addEventListener("wishlistUpdated", updateCounts);

    return () => {
      window.removeEventListener("cartUpdated", updateCounts);
      window.removeEventListener("wishlistUpdated", updateCounts);
    };
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        {/* LOGO */}
        <NavLink to="/" className="logo">
          Kashmiri Gifts
        </NavLink>

        {/* LINKS */}
        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/shop" onClick={() => setOpen(false)}>
            Shop
          </NavLink>
          <NavLink to="/about" onClick={() => setOpen(false)}>
            About
          </NavLink>

          <button
            className="contact-link"
            onClick={() => {
              navigate("/");
              setTimeout(() => {
                document.getElementById("contact")?.scrollIntoView({
                  behavior: "smooth",
                });
              }, 200);
              setOpen(false);
            }}
          >
            Contact
          </button>
        </nav>

        {/* ACTIONS */}
        <div className="nav-actions">
          <NavLink to="/wishlist" className="icon">
            ♡
            {wishlistCount > 0 && (
              <span className="badge">{wishlistCount}</span>
            )}
          </NavLink>

          <NavLink to="/cart" className="icon">
            👜
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </NavLink>

          <NavLink to="/login" className="login-btn">
            Login
          </NavLink>

          {/* HAMBURGER */}
          <button
            className="hamburger"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

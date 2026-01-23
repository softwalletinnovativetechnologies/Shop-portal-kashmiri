import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCartCount } from "../utils/cart";
import { getWishlistCount } from "../utils/wishlist";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  /* 🔍 SEARCH */
  const [search, setSearch] = useState("");
  const [typing, setTyping] = useState(false);

  /* 🔐 Sync user */
  const syncUser = () => {
    const stored = localStorage.getItem("user");
    if (!stored) return setUser(null);
    try {
      setUser(JSON.parse(stored));
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    syncUser();
  }, []);

  useEffect(() => {
    window.addEventListener("storage", syncUser);
    window.addEventListener("userChanged", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("userChanged", syncUser);
    };
  }, []);

  useEffect(() => {
    const updateCounts = () => {
      setCartCount(getCartCount());
      setWishlistCount(getWishlistCount());
    };
    updateCounts();
    window.addEventListener("cartUpdated", updateCounts);
    window.addEventListener("wishlistUpdated", updateCounts);
    return () => {
      window.removeEventListener("cartUpdated", updateCounts);
      window.removeEventListener("wishlistUpdated", updateCounts);
    };
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setProfileOpen(false);
    setMobileMenu(false);
    navigate("/login");
  };

  const go = (path) => {
    setProfileOpen(false);
    setMobileMenu(false);
    navigate(path);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
    setMobileMenu(false);
  };

  return (
    <>
      <header className="navbar">
        <NavLink to="/" className="logo">
          Kashmiri Gifts
        </NavLink>

        {/* ===== DESKTOP NAV (auto hidden in mobile via CSS) ===== */}
        <nav className="nav desktop-only">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        {/* ===== SEARCH ===== */}
        <form
          className={`nav-search ${typing ? "typing" : ""}`}
          onSubmit={submitSearch}
        >
          <input
            type="text"
            placeholder="Search shawls, dry fruits, hampers..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setTyping(true);
              setTimeout(() => setTyping(false), 600);
            }}
          />
          <button type="submit">🔍</button>
        </form>

        <div className="nav-actions">
          <NavLink to="/wishlist" className="icon">
            ♡ {wishlistCount > 0 && <span>{wishlistCount}</span>}
          </NavLink>

          <NavLink to="/cart" className="icon">
            👜 {cartCount > 0 && <span>{cartCount}</span>}
          </NavLink>

          {/* ===== HAMBURGER (ONLY MOBILE) ===== */}
          <div
            className="hamburger mobile-only"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* ===== PROFILE (unchanged) ===== */}
          {user && (
            <div className="profile-wrapper">
              <div
                className="profile-icon"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>

              {profileOpen && (
                <div className="profile-dropdown">
                  {user.role === "admin" ? (
                    <button onClick={() => go("/admin")}>
                      Admin Dashboard
                    </button>
                  ) : (
                    <>
                      <button onClick={() => go("/account")}>My Account</button>
                      <button onClick={() => go("/orders")}>My Orders</button>
                      <button onClick={() => go("/wishlist")}>
                        My Wishlist
                      </button>
                      <button onClick={() => go("/cart")}>My Cart</button>
                    </>
                  )}
                  <button onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ===== MOBILE MENU PANEL ===== */}
      {mobileMenu && (
        <div className="mobile-menu">
          <NavLink to="/" onClick={() => go("/")}>
            Home
          </NavLink>
          <NavLink to="/shop" onClick={() => go("/shop")}>
            Shop
          </NavLink>
          <NavLink to="/about" onClick={() => go("/about")}>
            About
          </NavLink>
          <NavLink to="/contact" onClick={() => go("/contact")}>
            Contact
          </NavLink>
        </div>
      )}
    </>
  );
}

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
  const [open, setOpen] = useState(false);

  /* 🔍 SEARCH STATE */
  const [search, setSearch] = useState("");
  const [typing, setTyping] = useState(false);

  /* 🔐 Sync user safely */
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
    setOpen(false);
    window.dispatchEvent(new Event("userChanged"));
    navigate("/login");
  };

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  /* 🔍 SEARCH SUBMIT */
  const submitSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    navigate(`/shop?search=${encodeURIComponent(search.trim())}`, {
      replace: false,
    });
  };

  return (
    <header className="navbar">
      <NavLink to="/" className="logo">
        Kashmiri Gifts
      </NavLink>

      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/shop">Shop</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>

      {/* 🔍 ADVANCED SEARCH */}
      <form
        className={`nav-search ${typing ? "typing" : ""}`}
        onSubmit={submitSearch}
      >
        <input
          type="text"
          placeholder="Search shawls, pashmina, dry fruits..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setTyping(true);
            setTimeout(() => setTyping(false), 800);
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

        {!user ? (
          <button onClick={() => navigate("/login")} className="login-btn">
            Login
          </button>
        ) : (
          <div className="profile-wrapper">
            <div className="profile-icon" onClick={() => setOpen(!open)}>
              {user.name?.charAt(0).toUpperCase()}
            </div>

            {open && (
              <div className="profile-dropdown">
                {user.role === "admin" ? (
                  <>
                    <button onClick={() => go("/admin")}>
                      Admin Dashboard
                    </button>
                    <button onClick={logout}>Logout</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => go("/account")}>My Account</button>
                    <button onClick={() => go("/orders")}>My Orders</button>
                    <button onClick={() => go("/wishlist")}>My Wishlist</button>
                    <button onClick={() => go("/cart")}>My Cart</button>
                    <button onClick={logout}>Logout</button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

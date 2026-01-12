import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      {/* LEFT */}
      <div className="nav-left">
        <Link to="/" className="logo">
          Kashmiri Gifts
        </Link>
      </div>

      {/* CENTER */}
      <ul className="nav-center">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/shop">Shop</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>

      {/* RIGHT */}
      <div className="nav-right">
        <Link to="/login" className="nav-btn">
          Login
        </Link>
        <span className="icon">🛒</span>
      </div>
    </nav>
  );
}

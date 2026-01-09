import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Kashmiri Gifts</div>

      <ul className="nav-links">
        <li>Home</li>
        <li>Shop</li>
        <li>About Us</li>
        <li>Contact</li>
      </ul>

      <div className="nav-actions">
        <span>Login</span>
        <span>🛒</span>
        <span>✉</span>
      </div>
    </nav>
  );
}

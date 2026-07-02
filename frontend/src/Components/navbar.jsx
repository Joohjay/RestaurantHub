import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar({ theme, toggleTheme, cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navBrand">
        <Link to="/" className="brand" onClick={closeMenu}>
          Restaurant<span className="brandAccent">Hub</span>
        </Link>
      </div>
      <button className="mobileMenuButton" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation menu">
        {menuOpen ? "✕" : "☰"}
      </button>
      <ul className={`navLinks ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={closeMenu}>Home</Link>
        </li>
        <li>
          <Link to="/restaurants" onClick={closeMenu}>Restaurants</Link>
        </li>
        <li>
          <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
        </li>
        <li>
          <Link to="/about" onClick={closeMenu}>About Us</Link>
        </li>
        <li>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>
        </li>
      </ul>
      <div className="navActions">
        <button className="iconButton" onClick={toggleTheme} title="Toggle theme">
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
        <a href="/#search" className="iconButton" title="Search">
          🔍
        </a>
        <Link to="/checkout" className="cartButton" onClick={closeMenu}>
          🛒
          <span>{cartCount}</span>
        </Link>
        <Link to="/login" onClick={closeMenu}>
          <button className="secondaryBtn">Login</button>
        </Link>
        <Link to="/register" onClick={closeMenu}>
          <button className="primaryBtn">Register</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

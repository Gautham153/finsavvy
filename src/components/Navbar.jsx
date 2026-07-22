import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaWallet,
  FaChartBar,
  FaUser,
  FaCog,
  FaInfoCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import "./navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Tracker", path: "/tracker", icon: <FaWallet /> },
    { name: "Analytics", path: "/analytics", icon: <FaChartBar /> },
    { name: "Profile", path: "/profile", icon: <FaUser /> },
    { name: "Settings", path: "/settings", icon: <FaCog /> },
    { name: "About", path: "/about", icon: <FaInfoCircle /> },
  ];

  return (
    <nav style={styles.nav}>
      <h1 className="logo">
        <img
          src="/Abstract logo with gradient arrow.svg"
          alt="logo"
          className="logo-img"
        />
        <span className="fin">Fin</span><span className="savvy">Savvy</span>
      </h1>

      {/* Desktop Menu */}
      <ul style={styles.navLinks} className="desktop-menu">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link to={item.path} style={styles.link}>
              {item.icon} <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Hamburger */}
      <div
        style={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul style={styles.mobileMenu}>
          {navItems.map((item) => (
            <li key={item.name} onClick={() => setMenuOpen(false)}>
              <Link to={item.path} style={styles.link}>
                {item.icon} <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 25px",
    backdropFilter: "blur(12px)",
    background: "rgba(15, 23, 42, 0.6)", // glass effect
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    zIndex: 1000,
  },
  logo: {
    margin: 0,
    fontSize: "20px",
  },
  navLinks: {
    display: "flex",
    listStyle: "none",
    gap: "20px",
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    textDecoration: "none",
    color: "#e2e8f0",
    padding: "6px 10px",
    borderRadius: "8px",
    transition: "0.3s",
  },
  hamburger: {
    display: "none",
    fontSize: "22px",
    cursor: "pointer",
  },
  mobileMenu: {
    position: "absolute",
    top: "60px",
    right: "20px",
    listStyle: "none",
    background: "rgba(15,23,42,0.95)",
    padding: "15px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};

export default Navbar;
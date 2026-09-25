import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/barber-lounge-logo-transparent.png";
import "../Styles/NavigationBar.css";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Barbers", href: "#barbers" },
  { name: "Contact", href: "#contact" },
];

const NavigationBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <a href="#home" className="logo" onClick={closeMenu}>
          <img src={logo} alt="The Barber Lounge" />
        </a>

        <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} onClick={closeMenu}>
              {link.name}
            </a>
          ))}

          <a
            href="#booking"
            className="nav-book-btn mobile-book-btn"
            onClick={closeMenu}
          >
            Book Now
            <span>↗</span>
          </a>
        </nav>

        <a href="#booking" className="nav-book-btn desktop-book-btn">
          Book Now
          <span>↗</span>
        </a>

        <button
          className={`menu-toggle ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default NavigationBar;

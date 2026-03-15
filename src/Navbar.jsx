import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css"; // We'll create a dedicated CSS or put it in index.css

function Navbar({ name }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // To dynamically show things based on route

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar top">
      <div className="navbar-brand">
        <h2 id="welcome">Welcome {name}{name !== "User" ? "," : ""}</h2>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        {/* We can dynamically show links based on where we are, or show all */}
        <Link to="/" className="nav-link schedule-btn" onClick={closeMenu}>
          Schedule
        </Link>
        <Link to="/tracker" className="nav-link" onClick={closeMenu}>
          Tracker
        </Link>
        <Link to="/signin" className="nav-link" onClick={closeMenu}>
          Sign In
        </Link>
        <Link to="/signup" className="nav-link" onClick={closeMenu}>
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

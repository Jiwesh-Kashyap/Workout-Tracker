import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import "./Navbar.css";

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
        {name !== "User" && (
            <button className="nav-link logout-btn" onClick={async () => {
            try{
              const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/logout`, {
                method: "POST",
                credentials: "include",
              });
              if(response.ok){
                localStorage.removeItem("userName");
                console.log("Successfully Logged Out!");
                Navigate('/');
                closeMenu();
                window.location.href = '/signin';
              }
              else{
                console.log("Error while logging out");
              }
            }
            catch(err){
                console.log('Error while logging out', err);
            }
              closeMenu();
            }}>
              Log Out
            </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

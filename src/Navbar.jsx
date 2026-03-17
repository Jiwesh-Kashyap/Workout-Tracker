import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import "./Navbar.css";

function Navbar({ name }) {
  const [isOpen, setIsOpen] = useState(false);
  const { setName } = useContext(UserContext); // Grab setName from context
  const navigate = useNavigate(); // Grab navigate hook since <Navigate> is for rendering

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
                setName("User"); 
                console.log("Successfully Logged Out!");
                closeMenu();
                navigate('/signin');
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

import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "./UserContext";
import "./Navbar.css";

function Navbar({ name }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { setName } = useContext(UserContext); // Grab setName from context
    const navigate = useNavigate(); // Grab navigate hook since <Navigate> is for rendering
    const location = useLocation();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const handleSaveWorkout = (updateTemplate) => {
        setIsSaving(true);
        window.dispatchEvent(new CustomEvent('finish-workout', { 
            detail: { updateTemplate } 
        }));
        
        const handleSuccess = () => {
            setIsSaving(false);
            setIsSaveModalOpen(false);
            window.removeEventListener('workout-saved', handleSuccess);
        };
        window.addEventListener('workout-saved', handleSuccess);
        
        setTimeout(() => {
            setIsSaving(false);
            setIsSaveModalOpen(false);
            window.removeEventListener('workout-saved', handleSuccess);
        }, 5000);
    };

    return (
        <>
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
                {name === "User" && (
                    <>
                        <Link to="/signin" className="nav-link" onClick={closeMenu}>
                            Sign In
                        </Link>
                        <Link to="/signup" className="nav-link" onClick={closeMenu}>
                            Sign Up
                        </Link>
                    </>
                )}
                {name !== "User" && (
                    <>
                        {location.pathname.startsWith('/tracker/') && (
                            <button className="nav-link save-btn" onClick={() => {
                                setIsSaveModalOpen(true);
                                closeMenu();
                            }}>
                                Save Workout
                            </button>
                        )}
                    <button className="nav-link logout-btn" onClick={async () => {
                        try {
                            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/logout`, {
                                method: "POST",
                                credentials: "include",
                            });
                            if (response.ok) {
                                localStorage.removeItem("userName");
                                localStorage.removeItem("token");
                                setName("User");
                                console.log("Successfully Logged Out!");
                                closeMenu();
                                navigate('/signin');
                            }
                            else {
                                console.log("Error while logging out");
                            }
                        }
                        catch (err) {
                            console.log('Error while logging out', err);
                        }
                        closeMenu();
                    }}>
                        Log Out
                    </button>
                    </>
                )}
            </div>
        </nav>

        {isSaveModalOpen && (
            <div className="save-modal-overlay">
                <div className="save-modal">
                    <h3>Log this workout</h3>
                    <p>How would you like to save today's session?</p>
                    
                    <div className="modal-buttons">
                        <button className="modal-btn save-only" disabled={isSaving} onClick={() => handleSaveWorkout(false)}>
                            {isSaving ? "Saving..." : "Save Workout"}
                        </button>
                        <button className="modal-btn save-update" disabled={isSaving} onClick={() => handleSaveWorkout(true)}>
                            {isSaving ? "Saving..." : "Save & Update Routine"}
                        </button>
                        <button className="modal-btn cancel" disabled={isSaving} onClick={() => setIsSaveModalOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

export default Navbar;

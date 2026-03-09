import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Tracker from "./Tracker";
import Signin from "./Signin";
import Signup from "./Signup";
import { useEffect, useState } from "react";
import Schedule from "./Schedule";

function App() {
  const [name, setName] = useState("User");

  useEffect(() => {
    const fetchName = async () => {
      try {
        const savedName = localStorage.getItem("userName");

        if (savedName) {
          setName(savedName);
        }
      } catch (error) {
        console.error("Failed to fetch username! ", error);
      }
    };
    fetchName();
  });

  return (
      <BrowserRouter>
        <nav className="top"
          style={{
              padding: "1rem",
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              position: "relative",
              top: 0,
              right: 0,
              zIndex: 1000,
            }}
        >
        <h2 id="welcome">Welcome {name},</h2>
        <div className="links">
          <Link
            to="/"
            style={{
              color: "white",
              textDecoration: "none",
              border: "2px solid white",
              borderRadius: "5px",
              padding: "2px",
            }}
          >
            Tracker
          </Link>
          <Link
            to="/signin"
            style={{
              color: "white",
              textDecoration: "none",
              border: "2px solid white",
              borderRadius: "5px",
              padding: "2px",
            }}
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            style={{
              color: "white",
              textDecoration: "none",
              border: "2px solid white",
              borderRadius: "5px",
              padding: "2px",
            }}
          >
            Sign Up
          </Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Schedule />} />
          <Route path="/tracker" element={<Tracker/>}/>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Tracker from "./Tracker";
import Signin from "./Signin";
import Signup from "./Signup";
import { useEffect, useState } from "react";
import Schedule from "./Schedule";
import Navbar from "./Navbar";

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
        <Navbar name={name} />
        <Routes>
          <Route path="/" element={<Schedule />} />
          <Route path="/tracker/:dayName" element={<Tracker/>}/>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Tracker from "./Tracker";
import Signin from "./Signin";
import Signup from "./Signup";

function App() {
    return (
        <BrowserRouter>
            <nav style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', position: 'absolute', top: 0, right: 0, zIndex: 1000 }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Tracker</Link>
                <Link to="/signin" style={{ color: 'white', textDecoration: 'none' }}>Sign In</Link>
                <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Tracker />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
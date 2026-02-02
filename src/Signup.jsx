import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signin() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default HTML form submission

        try {
            const response = await fetch("http://localhost:4000/api/user/signup", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) {
                navigate("/");
            } else {
                const data = await response.json();
                alert(data.message || "Sign up failed");
            }
        } catch (error) {
            console.error("Sign up error:", error);
            alert("Something went wrong via signing up");
        }
    };

    // Basic styles for functionality since tailwind was removed
    const containerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        color: "white",
    };

    const cardStyle = {
        background: "rgba(36, 9, 62, 0.5)",
        padding: "2rem",
        borderRadius: "10px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        width: "100%",
        maxWidth: "400px",
    };

    const inputStyle = {
        width: "100%",
        padding: "0.5rem",
        marginBottom: "1rem",
        borderRadius: "5px",
        border: "1px solid #ccc",
        marginTop: "0.5rem",
    };

    const buttonStyle = {
        width: "100%",
        padding: "0.75rem",
        background: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1rem",
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="name"
                            placeholder="Jimmy McGill"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={inputStyle}
                        />
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <button type="submit" style={buttonStyle}>
                        Sign up
                    </button>
                </form>
            </div>
        </div>
    );
}

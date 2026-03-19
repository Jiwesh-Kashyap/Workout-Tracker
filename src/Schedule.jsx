import React, { useEffect, useState, useContext } from "react";
import DayPlan from "./DayPlan";
import Lenis from 'lenis';
import Footer from "./Footer";
import { UserContext } from "./UserContext";
import { Link } from "react-router-dom";

function Schedule() {
    const [dayName, setDayName] = useState(null);
    const [message, setMessage] = useState(null);
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAuthPopup, setShowAuthPopup] = useState(false);
    const { name } = useContext(UserContext);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 0.7,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        // Start the loop
        requestAnimationFrame(raf);

        // Cleanup: Destroy the instance if the component unmounts
        return () => {
            lenis.destroy();
        };
    }, [plans])


    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                })
                if (response.ok) {
                    const json = await response.json();
                    setPlans(json);
                    setIsLoading(false);
                }
            }
            catch (error) {
                console.log('schedule.jsx=> Caught an error while making request: ', error);
            }
        }
        fetchSchedule();
    }, []);

    // const handleCheck = () => {

    // }
    const addPlan = async (e) => {
        e.preventDefault();

        // Block unauthenticated users
        if (name === "User") {
            setShowAuthPopup(true);
            return;
        }

        if (!validateInput()) return;

        const newPlan = { dayName, message };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newPlan)
            });

            if (response.ok) {
                // If backend added it successfully, fetch the updated list 
                // Alternatively, just append it locally:
                setPlans(prev => [newPlan, ...prev]);
            } else {
                console.log("Failed to add plan to backend");
            }
        } catch (err) {
            console.log("Error posting plan:", err);
        }

        setDayName('');
        setMessage('');
    };
    const validateInput = () => {
        if (!dayName) {
            window.alert("Day name cannot be null!");
            return false;
        }
        else return true;
    }

    const handleDelete = async (planName) => {
        // Optimistic UI for delete
        const previousPlans = [...plans];
        setPlans(plans.filter(p => p.dayName !== planName));

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}`, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ dayName: planName })
            });

            if (!response.ok) {
                console.log("Failed to delete plan from backend");
                setPlans(previousPlans); // Rollback
            }
        } catch (err) {
            console.log("Error deleting plan:", err);
            setPlans(previousPlans); // Rollback
        }
    };

    const planList = plans.map((item, ind) => {
        if (React.isValidElement(item)) {
            return <li key={ind}>{item}</li>;
        }
        return (
            <li key={item._id || ind}>
                <DayPlan name={item.dayName} content={item.message} checker={item.checker} onDelete={handleDelete} />
            </li>
        );
    });


    if (isLoading) {
        return (
            <div className="loading-screen">
                <h2 className="loading-msg">Loading...</h2>
                {/* spinner */}
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div className="schedule">
            {/* AUTHENTICATION REQUIRED POPUP */}
            {showAuthPopup && (
                <div className="delete-popup show">
                    <div className="delete-heading">
                        <p>SIGN IN REQUIRED</p>
                    </div>
                    <div className="delete-message">
                        <p>You must be signed in to create and save a routine.</p>
                        <div className="delete-buttons" style={{ marginTop: '20px' }}>
                            <Link to="/signin" className="delete-confirm" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Sign In</Link>
                            <button className="delete-cancel" onClick={() => setShowAuthPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {plans.length === 0 ? (
                <div className="no-plan">
                    <div className="no-plan-message">
                        <h1>ADD YOUR FIRST ROUTINE NOW!</h1>
                    </div>
                </div>
            ) : (
                <ul className="day-list">{planList}</ul>
            )}

            <form action="/" method="POST" className="schedule-form">
                <input
                    type="text"
                    placeholder="Input day name..."
                    id="day-name"
                    value={dayName || ''}
                    onChange={(e) => setDayName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Input any message..."
                    id="day-plan-message"
                    value={message || ''}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className="add-day-plan-button" onClick={addPlan}>
                    Add
                </button>
            </form>
            <Footer />
        </div>
    );
}

export default Schedule;

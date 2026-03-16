import React, { useEffect, useState } from "react";
import DayPlan from "./DayPlan";
import Lenis from 'lenis';
import Footer from "./Footer";

function Schedule() {
    const [dayName, setDayName] = useState(null);
    const [message, setMessage] = useState(null);
    const [plans, setPlans] = useState([]);

    useEffect(() =>{
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
            try{
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}`, {
                    credentials: 'include',
                })
                if(response.ok){
                    const json = await response.json();
                    setPlans(json);
                }
            }
            catch(error){
                console.log('schedule.jsx=> Caught an error while making request: ', error);
            }
        }
        fetchSchedule();
    }, []);

    // const handleCheck = () => {

    // }
    const addPlan = async (e) => {
        e.preventDefault();
        if (!validateInput()) return;

        const newPlan = { dayName, message };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPlan),
                credentials: 'include'
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
        if(!dayName){
            window.alert("Day name cannot be null!");
            return false;
        }
        else return true;
    }

    const planList = plans.map((item, ind) => {
        if (React.isValidElement(item)) {
            return <li key={ind}>{item}</li>;
        }
        return (
            <li key={item._id || ind}>
                <DayPlan name={item.dayName} content={item.message} checker={item.checker} />
            </li>
        );
    });


    return (
        <div className="schedule">
            <ul className="day-list">{planList}</ul>
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

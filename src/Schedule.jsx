import React, { useState } from "react";
import DayPlan from "./DayPlan";

function Schedule() {
    const [dayName, setDayName] = useState(null);
    const [message, setMessage] = useState(null);
    const [plans, setPlans] = useState([]);

    const handleCheck = () => {

    }
    const addPlan = (e) => {
        e.preventDefault();
        setPlans(c => [...c, <DayPlan key={c.length} name={dayName} content={message} handleCheck={handleCheck}></DayPlan>]);
    };

  const planList = plans.map((item,ind) => (
        <li key={ind}>
            {item}
        </li>
    )); //keep an id here


    return (
        <div className="schedule">
            <ul className="day-list">{planList}</ul>
            <form action="/" method="POST" className="schedule-form">
                <input
                    type="text"
                    placeholder="Input day name..."
                    id="day-name"
                    onChange={(e) => setDayName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Input any message..."
                    id="day-plan-message"
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className="add-day-plan-button" onClick={addPlan}>
                    Add
                </button>
            </form>
        </div>
    );
}

export default Schedule;

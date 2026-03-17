import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeleteImage from "./DeleteImage"; // Import the delete component

function DayPlan({ name, content, checker, onDelete }) {
  const [check, setCheck] = useState(checker || false);

  useEffect(() => {
    setCheck(checker || false);
  }, [checker]);

  const navigate = useNavigate();
  const handleClick = async () => {
    navigate(`/tracker/${name}`);
  };
  const checkFn = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}`, {
        method: "PUT",
        body: JSON.stringify({ dayName: name }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const fetchedCheck = await response.json();
        setCheck(fetchedCheck.checker);
      }
    } catch (err) {
      console.log("Error while updating checker: ", err);
    }
  };

  return (
    <div className="day-plan" onClick={handleClick}>
      <input 
        type="checkbox" 
        checked={check} 
        onChange={checkFn} 
        onClick={(e) => e.stopPropagation()} 
      />
      <h2 className="day-plan-h2">{name}</h2>
      <h4 className="day-plan-h4">{content}</h4>
      
      {/* Container to stop the click from bubbling to the parent div */}
      <div className="day-plan-delete" onClick={(e) => e.stopPropagation()}>
        <DeleteImage className="delete" onDelFunc={() => onDelete(name)} type="routine" />
      </div>
    </div>
  );
}

export default DayPlan;

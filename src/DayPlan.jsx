import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeleteImage from "./DeleteImage"; // Import the delete component
import EditImage from "./EditImage";
import { EllipsisVertical } from "lucide-react";

function DayPlan({ name, content, checker, onDelete, onEdit }) {
    const [check, setCheck] = useState(checker || false);

    const [optionsIsVisible, setOptionsIsVisible] = useState(false);

    useEffect(() => {
        setCheck(checker || false);
    }, [checker, name, content]);

    const handleOptions = () => {
        setOptionsIsVisible(false);
    }
    const navigate = useNavigate();
    const handleClick = async () => {
        if(optionsIsVisible){
            handleOptions();
        } else{
            navigate(`/tracker/${name}`);
        }
    };
    const checkFn = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}`, {
                method: "PUT",
                body: JSON.stringify({ dayName: name }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
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
        <div className="day-plan" onClick={() => {handleClick(), handleOptions()}}>
            <input
                type="checkbox"
                checked={check}
                onChange={checkFn}
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 appearance-none bg-white cursor-pointer border rounded-3xl border-slate-500 hover:ring-2 hover:ring-blue-500/50 transition-all checked:border-blue-600 checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox=%220%200%2016%2016%22%20fill=%22white%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d=%22M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%22/%3E%3C/svg%3E')] bg-center bg-no-repeat"
            />
            <h2 className="day-plan-h2">{name}</h2>
            <h4 className="day-plan-h4">{content}</h4>

            <div className="mt-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
                <button 
                    onClick={() => navigate(`/${name}/report`)}
                    className="px-4 py-2 bottom-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors shadow-sm absolute cursor-pointer"
                >
                    View Report
                </button>
            </div>

            {/* Container to stop the click from bubbling to the parent div */}
            <div className="day-plan-delete" onClick={(e) => e.stopPropagation()}>
                <div>
                    <EllipsisVertical onClick={() => setOptionsIsVisible(!optionsIsVisible)}/>
                    <div className={`w-max absolute right-0 top-8 bg-slate-800 p-2 m-2 cursor-pointer rounded shadow-lg border border-slate-700 transition-all duration-200 origin-top-right z-50 ${optionsIsVisible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                        <div className="rounded px-2 py-1 flex hover:bg-slate-700 transition-colors" 
                        onClick={(e) => { e.stopPropagation(); onDelete(name); setOptionsIsVisible(false); }}>Delete Plan</div>

                        <div className="rounded px-2 py-1 flex hover:bg-slate-700 transition-colors" 
                        onClick={(e) => { e.stopPropagation(); onEdit(); setOptionsIsVisible(false); }}>Edit Plan</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DayPlan;

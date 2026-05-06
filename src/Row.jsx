import React, { useState, useEffect } from "react";
import DoneImage from "./DoneImage";
import DeleteImage from "./DeleteImage";
import EditImage from "./EditImage";
import Checker from "./Checker";

function Row({ item, index, handleDelete, dayName, onEditClick }) {
    const [isCompleted, setIsCompleted] = useState(item.completed || false);
    const [isDeleted, setIsDeleted] = useState(false);

    useEffect(() => {
        setIsCompleted(item.completed || false);
    }, [item]);



    const deleteClass = (isDeleted ? 'delete hide' : 'delete');
    const doneClass = (isCompleted ? 'done hide' : 'done');
    const checkerClass = (isCompleted ? 'checker-list hide' : 'checker-list');

    const handleComplete = async () => {
        //Optimistic UI
        const previousState = isCompleted;
        setIsCompleted(!isCompleted);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tracker/${dayName}`, {
                method: 'PUT',
                body: JSON.stringify({name: item.exerciseName, intent: "COMPLETE_WORKOUT"}),
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                intent: "COMPLETE_WORKOUT"
            })
            if (response.ok) {
                console.log('Row updated successfully!');
            } else {
                throw new Error("Backend response not ok");
            }

            const { workout } = await response.json();
            setIsCompleted(workout.completed);
        }
        catch (err) {
            console.log('Error while updating row!', err);
            setIsCompleted(previousState);
        }
    }
    function onDelete(workoutName) {
        handleDelete(workoutName);
        setIsDeleted(true);
    }

    const finalClassName = `rows ${isCompleted ? 'row-completed' : ''} ${isDeleted ? 'deleted' : ''}`;

    return (
        <tr className={finalClassName}>
            <td className='serial'>{index + 1}</td>
            <td className='name-table'>{item.exerciseName}</td>
            <td className='sets-table'>{item.numOfSets}</td>
            <td className='reps-table'>{item.numOfReps}</td>
            <td className='weights-table'>{item.weight}</td>
            <td id="line-div-action-cell" className="hide-hr separator-cell"></td>
            <td className="drag-handle" style={{cursor: "grab"}}>☰</td>
            {/* We pass the handleComplete function down */}
            <td className='action-cell'>
                <DoneImage className={doneClass} onCheckFunc={handleComplete} />
                <DeleteImage className={deleteClass} onDelFunc={() => onDelete(item.exerciseName)} />
                <EditImage className="edit-row" onClickFunc={onEditClick} />
                <Checker className={checkerClass} sets={item.numOfSets} onComplete={handleComplete} />

            </td>
        </tr>
    );
}
export default Row